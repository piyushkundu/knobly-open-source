import 'server-only';
import type { Auth, UserRecord } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

export interface PasswordResetTarget {
  targetEmail: string;
  deliveryEmail: string;
  virtual: boolean;
}

const normalize = (email: string) => email.trim().toLowerCase();
const isVirtual = (email: string) => email.endsWith('@knobly.id');
function googleEmail(user: UserRecord): string | null {
  const email = user.providerData.find(provider => provider.providerId === 'google.com')?.email;
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !isVirtual(normalize(email)) ? normalize(email) : null;
}
function fromAuth(user: UserRecord): PasswordResetTarget | null {
  if (user.disabled || !user.email || !user.providerData.some(provider => provider.providerId === 'password')) return null;
  const targetEmail = normalize(user.email);
  if (!isVirtual(targetEmail)) return { targetEmail, deliveryEmail: targetEmail, virtual: false };
  const deliveryEmail = googleEmail(user);
  return deliveryEmail ? { targetEmail, deliveryEmail, virtual: true } : null;
}
function notFound(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'auth/user-not-found');
}

export async function resolvePasswordResetTarget(email: string, auth: Auth, db: Firestore): Promise<PasswordResetTarget | null> {
  const requested = normalize(email);
  try { return fromAuth(await auth.getUserByEmail(requested)); }
  catch (error) { if (!notFound(error)) throw error; }
  if (isVirtual(requested)) return null;

  // Firestore profile rows are only untrusted hints for legacy Google aliases.
  // Read IDs only; confirm the alias and reset target from Firebase Auth.
  const candidates = await db.collection('profiles').where('email', '==', requested).limit(10).select().get();
  for (const candidate of candidates.docs) {
    let user: UserRecord;
    try { user = await auth.getUser(candidate.id); }
    catch (error) { if (notFound(error)) continue; throw error; }
    if (googleEmail(user) !== requested) continue;
    const target = fromAuth(user);
    if (target) return target;
  }
  return null;
}
