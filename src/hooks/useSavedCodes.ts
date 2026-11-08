'use client';

import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { SavedCodeItem } from '@/types/python';

export function useSavedCodes() {
  const { user } = useAuth();
  const [codes, setCodes] = useState<SavedCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCodes = useCallback(async () => {
    if (!user) { setCodes([]); return; }
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      
      let items: SavedCodeItem[] = [];
      if (docSnap.exists() && docSnap.data().saved_codes) {
        items = docSnap.data().saved_codes || [];
      }
      
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setCodes(items);
    } catch (err) {
      console.error('Failed to load saved codes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const saveCode = useCallback(async (title: string, code: string, folder?: string, lastOutput?: string, description?: string): Promise<SavedCodeItem | null> => {
    if (!user) return null;
    try {
      const newCode: SavedCodeItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: title || 'Untitled',
        code,
        isImportant: false,
        folder: folder || '',
        lastOutput: lastOutput,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userDocRef = doc(db, 'users', user.uid);
      const newCodesList = [newCode, ...codes];
      
      // Try to update string. If user doc doesn't exist, we setDoc with merge
      await setDoc(userDocRef, { saved_codes: newCodesList }, { merge: true });
      
      setCodes(newCodesList);
      return newCode;
    } catch (err) {
      console.error('Failed to save code:', err);
      return null;
    }
  }, [user, codes]);

  const updateCode = useCallback(async (id: string, updates: Partial<Pick<SavedCodeItem, 'title' | 'code' | 'description' | 'folder' | 'isImportant' | 'lastOutput'>>) => {
    if (!user) return;
    try {
      const newCodesList = codes.map(c =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      );
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { saved_codes: newCodesList });
      setCodes(newCodesList);
    } catch (err) {
      console.error('Failed to update code:', err);
    }
  }, [user, codes]);

  const deleteCode = useCallback(async (id: string) => {
    if (!user) return;
    try {
      const newCodesList = codes.filter(c => c.id !== id);
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { saved_codes: newCodesList });
      setCodes(newCodesList);
    } catch (err) {
      console.error('Failed to delete code:', err);
    }
  }, [user, codes]);

  const toggleImportant = useCallback(async (id: string) => {
    if (!user) return;
    try {
      const newCodesList = codes.map(c => 
        c.id === id 
          ? { ...c, isImportant: !c.isImportant, updatedAt: new Date().toISOString() } 
          : c
      );
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { saved_codes: newCodesList });
      setCodes(newCodesList);
    } catch (err) {
      console.error('Failed to toggle important:', err);
    }
  }, [user, codes]);

  return {
    codes,
    isLoading,
    isLoggedIn: !!user,
    saveCode,
    updateCode,
    deleteCode,
    toggleImportant,
    loadCodes,
  };
}
