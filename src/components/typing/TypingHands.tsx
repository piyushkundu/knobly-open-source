'use client';
import React from 'react';
import { KEY_FINGER_MAP } from './typingData';

interface Props {
  activeKey?: string;
}

// Map finger names to hand + finger position for overlay highlighting
const FINGER_INFO: Record<string, { hand: 'left' | 'right'; label: string }> = {
  'left-pinky': { hand: 'left', label: 'Left Pinky' },
  'left-ring': { hand: 'left', label: 'Left Ring' },
  'left-middle': { hand: 'left', label: 'Left Middle' },
  'left-index': { hand: 'left', label: 'Left Index' },
  'right-index': { hand: 'right', label: 'Right Index' },
  'right-middle': { hand: 'right', label: 'Right Middle' },
  'right-ring': { hand: 'right', label: 'Right Ring' },
  'right-pinky': { hand: 'right', label: 'Right Pinky' },
  'thumb': { hand: 'right', label: 'Thumb' },
};

const TypingHands = React.memo(function TypingHands({ activeKey }: Props) {
  const finger = activeKey ? KEY_FINGER_MAP[activeKey.toLowerCase()] : undefined;
  const info = finger ? FINGER_INFO[finger] : undefined;

  return (
    <div className="flex justify-center items-end select-none pointer-events-none" style={{ marginTop: -10, gap: 16 }}>
      {/* Left Hand */}
      <div className="relative" style={{ width: 250, height: 180 }}>
        <img
          src="/sample-assets/placeholder.svg"
          alt="Left hand"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.55,
            filter: info?.hand === 'left' ? 'brightness(1.05)' : 'none',
            transition: 'filter 0.15s ease',
          }}
        />
        {/* Active finger indicator */}
        {info?.hand === 'left' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md" style={{ background: 'rgba(59,130,246,0.85)', fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
            {info.label}
          </div>
        )}
      </div>

      {/* Right Hand */}
      <div className="relative" style={{ width: 250, height: 180 }}>
        <img
          src="/sample-assets/placeholder.svg"
          alt="Right hand"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.55,
            filter: info?.hand === 'right' ? 'brightness(1.05)' : 'none',
            transition: 'filter 0.15s ease',
          }}
        />
        {info?.hand === 'right' && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md" style={{ background: 'rgba(59,130,246,0.85)', fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
            {info.label}
          </div>
        )}
      </div>
    </div>
  );
});

export default TypingHands;
