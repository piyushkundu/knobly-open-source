import { CLab } from '@/components/c-lang/CLab';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best AI C Compiler Online | AI C Learning Lab',
  description: 'Experience the best free online C compiler with built-in AI assistance. Write, execute, and debug C code instantly in your browser with real-time AI explanations and code generation.',
  keywords: 'best c compiler online, online c interpreter, c lab, run c online, ai c debugger, c programming lab, free c ide online, nextjs c lab',
  openGraph: {
    title: 'Best AI C Compiler Online',
    description: 'Write and run C code instantly in your browser. Get real-time AI help to explain errors and generate code.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI C Learning Lab',
    description: 'The ultimate browser-based C compiler and IDE with AI-powered debugging.',
  }
};

export default function CLabPage() {
  return <CLab />;
}
