'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!oobCode) {
      setStatus('error');
      setErrorMessage('Invalid or missing verification link. Please sign up or request a new link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await applyActionCode(auth, oobCode);
        setStatus('success');
      } catch (err: unknown) {
        setStatus('error');
        const msg = err instanceof Error ? err.message : '';
        if (msg.includes('expired') || msg.includes('invalid-action-code')) {
          setErrorMessage('This verification link has expired or has already been used.');
        } else {
          setErrorMessage('Something went wrong during verification. Please try again or request a new link.');
        }
      }
    };

    verifyEmail();
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

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e8edf3',
          padding: '36px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          textAlign: 'center',
        }}>

          {status === 'loading' && (
            <div>
              <div style={{
                width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '14px',
                background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #bae6fd',
              }}>
                <span style={{ fontSize: '24px' }}>⏳</span>
              </div>
              <h2 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>Verifying Your Email</h2>
              <p style={{ margin: '0', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>Please wait a moment...</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 20px', borderRadius: '16px',
                background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #a7f3d0',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
              }}>
                <span style={{ fontSize: '28px' }}>🎉</span>
              </div>
              <h2 style={{ margin: '0 0 10px', color: '#10b981', fontSize: '22px', fontWeight: 800 }}>✨ Email Verified! ✨</h2>
              <p style={{ margin: '0 0 24px', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                Welcome aboard! 🚀 Your account is now fully active. Get ready to learn, code, and grow with us. 🌟
              </p>
              
              <a href="/" style={{
                display: 'block', width: '100%', padding: '14px', boxSizing: 'border-box',
                background: 'linear-gradient(135deg, #4a9fe5, #6db3f2)',
                color: '#fff', fontSize: '14px', fontWeight: 700,
                border: 'none', borderRadius: '12px', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(74,159,229,0.25)',
                marginBottom: '16px', transition: 'all 0.2s',
              }}>
                Go to Home Page 🏠
              </a>
              
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
                Redirecting automatically in {countdown}s...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{
                width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '14px',
                background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #fecaca',
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
              </div>
              <h2 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>Verification Failed</h2>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{errorMessage}</p>
              <a href="/" style={{
                display: 'inline-block', padding: '12px 28px',
                background: '#f1f5f9', color: '#475569', fontSize: '13px', fontWeight: 700,
                borderRadius: '10px', textDecoration: 'none', border: '1px solid #e2e8f0',
              }}>
                Back to Website
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#eef2f7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#94a3b8', fontFamily: 'Arial, sans-serif', fontSize: '14px',
      }}>Loading...</div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
