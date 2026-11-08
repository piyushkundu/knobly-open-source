"use client";

import dynamic from 'next/dynamic';

const TerminalApp = dynamic(() => import('@/components/apps/terminal/TerminalApp'), { ssr: false });

export default function TerminalWrapper() {
  return <TerminalApp />;
}
