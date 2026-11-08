'use client';
import React from 'react';
import { KEY_FINGER_MAP, FINGER_COLORS } from './typingData';

interface Props {
  activeKey?: string;
  pressedKey?: string;
  isCorrect?: boolean;
  highlightKeys?: string[];
  showFingers?: boolean;
  weakKeys?: Record<string, number>;
}

// Realistic keyboard layout with modifier keys
const ROWS = [
  [{ k:'`',w:1 },{ k:'1',w:1 },{ k:'2',w:1 },{ k:'3',w:1 },{ k:'4',w:1 },{ k:'5',w:1 },{ k:'6',w:1 },{ k:'7',w:1 },{ k:'8',w:1 },{ k:'9',w:1 },{ k:'0',w:1 },{ k:'-',w:1 },{ k:'=',w:1 },{ k:'delete',w:1.8,label:'delete ⌫' }],
  [{ k:'tab',w:1.5,label:'tab ↹' },{ k:'q',w:1 },{ k:'w',w:1 },{ k:'e',w:1 },{ k:'r',w:1 },{ k:'t',w:1 },{ k:'y',w:1 },{ k:'u',w:1 },{ k:'i',w:1 },{ k:'o',w:1 },{ k:'p',w:1 },{ k:'[',w:1 },{ k:']',w:1 },{ k:'\\',w:1.3 }],
  [{ k:'caps',w:1.8,label:'caps lock ⇪' },{ k:'a',w:1 },{ k:'s',w:1 },{ k:'d',w:1 },{ k:'f',w:1 },{ k:'g',w:1 },{ k:'h',w:1 },{ k:'j',w:1 },{ k:'k',w:1 },{ k:'l',w:1 },{ k:';',w:1 },{ k:"'",w:1 },{ k:'enter',w:2,label:'enter ↵' }],
  [{ k:'shift-l',w:2.2,label:'shift ⇧' },{ k:'z',w:1 },{ k:'x',w:1 },{ k:'c',w:1 },{ k:'v',w:1 },{ k:'b',w:1 },{ k:'n',w:1 },{ k:'m',w:1 },{ k:',',w:1 },{ k:'.',w:1 },{ k:'/',w:1 },{ k:'shift-r',w:2.6,label:'⇧ shift' }],
  [{ k:'ctrl-l',w:1.3,label:'ctrl' },{ k:'alt-l',w:1.1,label:'alt' },{ k:'cmd-l',w:1.3,label:'cmd' },{ k:' ',w:6.2 },{ k:'cmd-r',w:1.3,label:'cmd' },{ k:'alt-r',w:1.1,label:'alt' },{ k:'ctrl-r',w:1.3,label:'ctrl' }],
];

const TypingKeyboard = React.memo(function TypingKeyboard({ activeKey, pressedKey, isCorrect, highlightKeys = [], showFingers = true, weakKeys }: Props) {
  const isModifier = (k: string) => ['tab','caps','delete','enter','shift-l','shift-r','ctrl-l','ctrl-r','alt-l','alt-r','cmd-l','cmd-r'].includes(k);

  const getKeyStyle = (keyData: { k: string; w: number; label?: string }): React.CSSProperties => {
    const { k, w } = keyData;
    const finger = KEY_FINGER_MAP[k] || '';
    const fc = finger ? FINGER_COLORS[finger] : '';
    const isA = activeKey?.toLowerCase() === k;
    const isP = pressedKey?.toLowerCase() === k;
    const isH = highlightKeys.includes(k);
    const isMod = isModifier(k);
    const isSpace = k === ' ';
    const wk = weakKeys?.[k] || 0;

    const base: React.CSSProperties = {
      width: `${w * 48}px`,
      height: isSpace ? 40 : 46,
      borderRadius: 6,
      display: 'flex',
      alignItems: isSpace ? 'center' : 'flex-start',
      justifyContent: isSpace ? 'center' : 'flex-start',
      padding: isMod ? '6px 8px' : '6px',
      fontSize: isMod ? 10 : isSpace ? 10 : 15,
      fontWeight: 600,
      fontFamily: "'Outfit', -apple-system, sans-serif",
      cursor: 'default',
      transition: 'all 0.08s ease',
      position: 'relative',
      textTransform: isMod ? 'none' : 'lowercase',
      letterSpacing: isMod ? '0.02em' : 'normal',
      border: '1px solid #d1d5db',
      background: '#fff',
      color: '#6b7280',
      boxShadow: '0 2px 0 #d1d5db, 0 3px 4px rgba(0,0,0,0.05)',
    };

    if (isMod) {
      base.background = '#f3f4f6';
      base.color = '#9ca3af';
      base.fontSize = 9;
    }

    // Finger color tint
    if (showFingers && fc && !isMod && !isA && !isP) {
      base.background = '#fff';
      base.borderColor = `${fc}50`;
    }

    // Highlighted keys (lesson target keys)
    if (isH && !isMod) {
      base.background = `${fc}12`;
      base.borderColor = `${fc}60`;
      base.color = fc;
    }

    // Active key (next to type)
    if (isA) {
      base.background = 'linear-gradient(180deg, #3b82f6, #2563eb)';
      base.color = '#fff';
      base.border = '1px solid #1d4ed8';
      base.boxShadow = '0 2px 0 #1e40af, 0 4px 12px rgba(59,130,246,0.4)';
      base.transform = 'translateY(-1px)';
    }

    // Pressed key
    if (isP) {
      if (isCorrect) {
        base.background = '#dcfce7';
        base.borderColor = '#22c55e';
        base.color = '#16a34a';
        base.boxShadow = '0 0 0 2px rgba(34,197,94,0.3)';
        base.transform = 'translateY(1px)';
      } else if (isCorrect === false) {
        base.background = '#fef2f2';
        base.borderColor = '#ef4444';
        base.color = '#dc2626';
        base.boxShadow = '0 0 0 2px rgba(239,68,68,0.3)';
        base.transform = 'translateX(-2px) translateY(1px)';
      }
    }

    // Weakness heatmap
    if (weakKeys && wk > 3 && !isMod) {
      base.background = `rgba(239,68,68,${Math.min(0.15, wk * 0.015)})`;
      base.borderColor = `rgba(239,68,68,${Math.min(0.5, wk * 0.04)})`;
    }

    return base;
  };

  const keyLabel = (k: string, label?: string) => {
    if (label) return label;
    if (k === ' ') return '';
    return k;
  };

  return (
    <div className="flex flex-col items-center gap-0.5 w-full select-none" style={{ maxWidth: 780, margin: '0 auto' }}>
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[3px] justify-center">
          {row.map((keyData, ki) => (
            <div key={`${ri}-${ki}`} style={getKeyStyle(keyData)}>
              <span>{keyLabel(keyData.k, keyData.label)}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Finger legend */}
      {showFingers && (
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {Object.entries(FINGER_COLORS).map(([n, c]) => (
            <div key={n} className="flex items-center gap-1">
              <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 9, color: '#94a3b8', textTransform: 'capitalize' }}>{n.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default TypingKeyboard;
