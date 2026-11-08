'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, signInWithPopup, GoogleAuthProvider, EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, fullName: string, username: string, avatar: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    resendVerificationEmail: (email: string, password: string) => Promise<void>;
    createUserId: (userId: string, password: string) => Promise<void>;
    loginWithUserId: (userId: string, password: string) => Promise<void>;
    getUserIdForCurrentUser: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    let adminFlag = false;
                    // Check 'users' collection (isAdmin field)
                    try {
                        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                        if (userDoc.exists() && userDoc.data()?.isAdmin === true) adminFlag = true;
                    } catch (_) { }
                    // Also check 'profiles' collection (role field)
                    if (!adminFlag) {
                        try {
                            const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
                            if (profileDoc.exists() && profileDoc.data()?.role === 'admin') adminFlag = true;
                        } catch (_) { }
                    }
                    setIsAdmin(adminFlag);
                } catch (err) {
                    console.warn('[Knobly] Could not fetch user doc:', err);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            // Check if email is verified (skip for @knobly.id virtual emails)
            if (!cred.user.emailVerified && !cred.user.email?.endsWith('@knobly.id')) {
                await signOut(auth);
                throw new Error('EMAIL_NOT_VERIFIED');
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '';
            // Re-throw non-credential errors immediately (e.g. EMAIL_NOT_VERIFIED)
            if (msg === 'EMAIL_NOT_VERIFIED') throw err;

            // If login failed with invalid credentials and the email is NOT a @knobly.id,
            // check if this user has a linked Knobly User ID and retry with that
            if ((msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) && !email.endsWith('@knobly.id')) {
                // Step 1: Look up profile by email via server-side API to bypass Firestore security rules
                let knoblyEmail: string | null = null;
                try {
                    const res = await fetch('/api/auth/resolve-knobly-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.trim().toLowerCase() }),
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        knoblyEmail = data.knoblyEmail || null;
                        console.log('[Knobly Login] Resolved remote email:', knoblyEmail);
                    } else {
                        console.log('[Knobly Login] Failed to resolve email via API.');
                    }
                } catch (fetchErr) {
                    console.warn('[Knobly Login] API lookup failed:', fetchErr);
                }

                // Step 2: If we found a knobly_user_id, retry auth with @knobly.id email
                if (knoblyEmail) {
                    console.log('[Knobly Login] Retrying auth with:', knoblyEmail);
                    // Let this throw naturally if it fails — user will see the real error
                    const cred = await signInWithEmailAndPassword(auth, knoblyEmail, password);
                    // Knobly ID emails skip verification check
                    return;
                }
            }
            throw err;
        }
    };

    const signup = async (email: string, password: string, fullName: string, username: string, avatar: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, {
            displayName: fullName,
            photoURL: avatar || undefined,
        });
        // Save to users collection
        try {
            await setDoc(doc(db, 'users', cred.user.uid), {
                email,
                displayName: fullName,
                username,
                photoURL: avatar,
                isAdmin: false,
                created_at: serverTimestamp(),
            });
        } catch (_) { console.warn('Could not create users doc'); }
        // Also save to profiles collection (used by dashboard & superadmin)
        try {
            await setDoc(doc(db, 'profiles', cred.user.uid), {
                email,
                full_name: fullName,
                username,
                avatar_url: avatar || '',
                role: 'user',
                created_at: serverTimestamp(),
            });
        } catch (_) { console.warn('Could not create profile doc'); }
        // Initialize exam_user_state for XP tracking
        try {
            await setDoc(doc(db, 'exam_user_state', cred.user.uid), {
                user_id: cred.user.uid,
                total_xp: 0,
                total_points: 0,
                current_level: 1,
                created_at: serverTimestamp(),
            });
        } catch (_) { }
        // Send custom branded verification email via our API
        try {
            await fetch('/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, displayName: fullName }),
            });
            console.log('[Knobly] Custom verification email sent to:', email);
        } catch (verifyErr) {
            console.error('[Knobly] Failed to send verification email:', verifyErr);
        }
        // Sign out so user must verify email before accessing app
        await signOut(auth);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const uid = result.user.uid;

        // Check if user already exists in users collection
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', uid), {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                isAdmin: false,
                created_at: serverTimestamp(),
            });
        }
        // Check if profile exists, create if not
        const profileDoc = await getDoc(doc(db, 'profiles', uid));
        if (!profileDoc.exists()) {
            await setDoc(doc(db, 'profiles', uid), {
                email: result.user.email,
                full_name: result.user.displayName || '',
                username: result.user.email?.split('@')[0] || '',
                avatar_url: result.user.photoURL || '',
                role: 'user',
                created_at: serverTimestamp(),
            });
            // Initialize exam_user_state
            try {
                await setDoc(doc(db, 'exam_user_state', uid), {
                    user_id: uid,
                    total_xp: 0,
                    total_points: 0,
                    current_level: 1,
                    created_at: serverTimestamp(),
                });
            } catch (_) { }
        }
    };

    const resetPassword = async (email: string) => {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            let errorMsg = 'Failed to send reset email.';
            try {
                const data = await res.json();
                errorMsg = data.error || errorMsg;
            } catch (_) {
                // API returned HTML (server error) — use default message
            }
            throw new Error(errorMsg);
        }
    };

    // Resend verification email - temporarily signs in to get user object
    const resendVerificationEmail = async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (cred.user.emailVerified) {
            await signOut(auth);
            throw new Error('EMAIL_ALREADY_VERIFIED');
        }
        await signOut(auth);
        // Send custom branded verification email via our API
        const res = await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to resend verification email.');
        }
    };

    // Create a unique User ID + password for Google-signed-in users
    const createUserId = async (userId: string, password: string) => {
        if (!user) throw new Error('You must be logged in.');
        const cleanId = userId.trim().toLowerCase();
        if (cleanId.length < 3) throw new Error('User ID must be at least 3 characters.');
        if (!/^[a-z0-9_]+$/.test(cleanId)) throw new Error('User ID can only contain letters, numbers and underscores.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        // Check uniqueness
        const existingDoc = await getDoc(doc(db, 'usernames', cleanId));
        if (existingDoc.exists()) throw new Error('This User ID is already taken. Please try another one.');

        // Create a virtual email from the userId for Firebase Auth
        const virtualEmail = `${cleanId}@knobly.id`;
        const credential = EmailAuthProvider.credential(virtualEmail, password);

        // Link email/password provider to current Google account
        await linkWithCredential(user, credential);

        // Save unique username mapping
        await setDoc(doc(db, 'usernames', cleanId), {
            uid: user.uid,
            email: virtualEmail,
            created_at: serverTimestamp(),
        });

        // Update profile with userId
        try {
            await setDoc(doc(db, 'profiles', user.uid), { knobly_user_id: cleanId }, { merge: true });
        } catch (_) { }
    };

    // Login with User ID (resolves userId → email, then signs in)
    const loginWithUserId = async (userId: string, password: string) => {
        const cleanId = userId.trim().toLowerCase();
        const usernameDoc = await getDoc(doc(db, 'usernames', cleanId));
        if (!usernameDoc.exists()) throw new Error('This User ID does not exist.');
        const virtualEmail = usernameDoc.data().email;
        await signInWithEmailAndPassword(auth, virtualEmail, password);
    };

    // Check if current user already has a User ID
    const getUserIdForCurrentUser = async (): Promise<string | null> => {
        if (!user) return null;
        try {
            const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
            if (profileDoc.exists() && profileDoc.data()?.knobly_user_id) {
                return profileDoc.data().knobly_user_id;
            }
        } catch (_) { }
        return null;
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, signup, logout, loginWithGoogle, resetPassword, resendVerificationEmail, createUserId, loginWithUserId, getUserIdForCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
