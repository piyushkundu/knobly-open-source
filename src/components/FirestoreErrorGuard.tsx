'use client';

import { useEffect } from 'react';

/**
 * Global error suppressor for Firebase Firestore SDK internal assertion errors.
 * 
 * Firebase JS SDK v12.x has a known bug where its internal WebChannel state machine
 * can corrupt during SPA navigation, throwing unhandled "INTERNAL ASSERTION FAILED"
 * errors that bypass normal try/catch. These errors are SDK-level issues, not app bugs.
 * 
 * This component catches and suppresses these errors to prevent page crashes.
 */
export default function FirestoreErrorGuard() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            if (
                event.message?.includes('INTERNAL ASSERTION FAILED') ||
                event.message?.includes('Unexpected state') ||
                event.message?.includes('@firebase/firestore')
            ) {
                // Suppress the error — it's an internal Firebase SDK issue
                event.preventDefault();
                console.warn('[Knobly] Suppressed Firestore internal error:', event.message);
                return true;
            }
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason?.message || event.reason?.toString?.() || '';
            if (
                reason.includes('INTERNAL ASSERTION FAILED') ||
                reason.includes('Unexpected state') ||
                reason.includes('@firebase/firestore')
            ) {
                // Suppress the error — it's an internal Firebase SDK issue
                event.preventDefault();
                console.warn('[Knobly] Suppressed Firestore internal rejection:', reason);
                return true;
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null;
}
