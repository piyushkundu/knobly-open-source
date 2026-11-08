'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = getStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength] || '';
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][strength] || '';
  const isValid = password.length >= 6 && password === confirmPassword && !!oobCode;

  useEffect(() => {
    if (!oobCode) {
      setStatus('error');
      setErrorMessage('Invalid or missing reset link. Please request a new password reset.');
    }
  }, [oobCode]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((p) => {
          if (p <= 1) { clearInterval(timer); router.push('/'); return 0; }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus('loading');
    setErrorMessage('');
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('expired') || msg.includes('invalid-action-code')) {
        setErrorMessage('This reset link has expired. Please request a new one.');
      } else if (msg.includes('weak-password')) {
        setErrorMessage('Password is too weak. Use at least 6 characters.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 44px 12px 16px',
    background: '#f7f9fc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '8px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const eyeBtn: React.CSSProperties = {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#eef2f7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header — matches website's K. KNOBLY style */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#ffffff', boxShadow: '0 2px 8px rgba(74,159,229,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: 800, color: '#4a9fe5',
            }}>K.</div>
            <span style={{
              fontSize: '20px', fontWeight: 800, letterSpacing: '4px',
              color: '#1e293b',
            }}>KNOBLY</span>
          </div>
          <p style={{
            margin: '2px 0 0', color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px',
          }}>O-Level & Python Learning Platform</p>
        </div>

        {/* Card — white with soft shadow like the website tiles */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e8edf3',
          padding: '32px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '14px',
                background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #a7f3d0',
              }}><span style={{ fontSize: '24px' }}>✅</span></div>
              <h2 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>Password Updated!</h2>
              <p style={{ margin: '0 0 14px', color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>You can now log in with your new password.</p>
              <p style={{ margin: 0, color: '#4a9fe5', fontSize: '13px', fontWeight: 600 }}>Redirecting in {countdown}s...</p>
            </div>

          ) : status === 'error' && !oobCode ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '14px',
                background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #fecaca',
              }}><span style={{ fontSize: '24px' }}>⚠️</span></div>
              <h2 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>Invalid Link</h2>
              <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>{errorMessage}</p>
              <a href="/" style={{
                display: 'inline-block', padding: '10px 26px',
                background: 'linear-gradient(135deg, #4a9fe5, #6db3f2)',
                color: '#fff', fontSize: '13px', fontWeight: 700,
                borderRadius: '10px', textDecoration: 'none',
              }}>Go to Home</a>
            </div>

          ) : (
            <>
              <h2 style={{ margin: '0 0 4px', color: '#1e293b', fontSize: '20px', fontWeight: 700 }}>Reset Password</h2>
              <p style={{ margin: '0 0 22px', color: '#94a3b8', fontSize: '13px' }}>Create a new password for your account</p>

              {status === 'error' && errorMessage && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                }}>
                  <p style={{ margin: 0, color: '#dc2626', fontSize: '12px' }}>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setStatus('idle'); setErrorMessage(''); }}
                      placeholder="Enter new password"
                      required minLength={6}
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#4a9fe5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,159,229,0.12)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div key={l} style={{
                            flex: 1, height: '3px', borderRadius: '3px',
                            background: l <= strength ? strengthColor : '#e2e8f0',
                            transition: 'background 0.3s',
                          }} />
                        ))}
                      </div>
                      <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: strengthColor, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setStatus('idle'); setErrorMessage(''); }}
                      placeholder="Confirm new password"
                      required minLength={6}
                      style={{
                        ...inputStyle,
                        borderColor: confirmPassword.length > 0 && password !== confirmPassword ? '#fca5a5' : '#e2e8f0',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#4a9fe5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,159,229,0.12)'; }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = confirmPassword.length > 0 && password !== confirmPassword ? '#fca5a5' : '#e2e8f0';
                      }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p style={{ margin: '5px 0 0', color: '#ef4444', fontSize: '11px' }}>Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid || status === 'loading'}
                  style={{
                    width: '100%', padding: '12px',
                    background: isValid && status !== 'loading' ? 'linear-gradient(135deg, #4a9fe5, #6db3f2)' : '#e2e8f0',
                    color: isValid && status !== 'loading' ? '#fff' : '#94a3b8',
                    fontSize: '14px', fontWeight: 700,
                    border: 'none', borderRadius: '12px',
                    cursor: isValid && status !== 'loading' ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s',
                    opacity: status === 'loading' ? 0.7 : 1,
                    boxShadow: isValid && status !== 'loading' ? '0 4px 14px rgba(74,159,229,0.25)' : 'none',
                  }}
                >
                  {status === 'loading' ? 'Resetting...' : '🔑 Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>

        {status !== 'success' && (
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <a href="/" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>← Back to Home</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#eef2f7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#94a3b8', fontFamily: 'Arial, sans-serif', fontSize: '14px',
      }}>Loading...</div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
