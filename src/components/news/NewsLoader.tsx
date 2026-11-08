export default function NewsLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '3rem 0' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          borderTop: '4px solid #3b82f6', borderLeft: '4px solid #3b82f6',
          borderRight: '4px solid transparent', borderBottom: '4px solid transparent',
          animation: '_newsSpinA 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: '8px', borderRadius: '50%',
          borderRight: '4px solid #8b5cf6', borderBottom: '4px solid #8b5cf6',
          borderTop: '4px solid transparent', borderLeft: '4px solid transparent',
          animation: '_newsSpinB 1.5s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: '16px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          animation: '_newsPulse 1.5s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(59,130,246,0.6)'
        }} />
      </div>
      <p style={{ color: '#9ca3af', fontWeight: 500, letterSpacing: '0.05em', fontSize: '1.1rem' }}>
        Fetching today&apos;s top news...
      </p>
      <style>{`
        @keyframes _newsSpinA { to { transform: rotate(360deg); } }
        @keyframes _newsSpinB { to { transform: rotate(-360deg); } }
        @keyframes _newsPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
      `}</style>
    </div>
  );
}
