'use client';

import { auth } from '@/lib/firebase';

type AdminApiPath = '/api/admin-delete' | '/api/admin-ai-format' | '/api/admin/verify-test' | '/api/html-tasks';

/** Attach the current Firebase session without changing the user's login. */
export async function adminFetch(path: AdminApiPath, init: RequestInit = {}): Promise<Response> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in to continue.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  return fetch(path, { ...init, headers });
}
