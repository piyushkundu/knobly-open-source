'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export function AdminTaskGate({ children, onSignIn }: { children: ReactNode; onSignIn: () => void }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <p className="p-4 text-xs text-slate-500" role="status">Checking admin access...</p>;
  if (!user) {
    return (
      <div className="p-4 space-y-3 text-xs text-slate-600">
        <p>Sign in with your administrator account to manage task availability.</p>
        <button type="button" onClick={onSignIn} className="px-4 py-2 rounded-xl bg-orange-700 text-white font-bold hover:bg-orange-800">
          Sign in as Admin
        </button>
      </div>
    );
  }
  if (!isAdmin) return <p className="p-4 text-xs text-slate-600">Only an administrator can change task availability. Ask your instructor to unlock this task.</p>;

  return <>{children}</>;
}
