import { PythonLab } from '@/components/python/PythonLab';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best AI Python Interpreter & Compiler Online | AI Python Learning Lab',
  description: 'Experience the best free online Python interpreter with built-in AI assistance. Write, execute, and debug Python code instantly in your browser with real-time AI explanations and code generation.',
  keywords: 'best python interpreter online, online python compiler, python lab, run python online, ai python debugger, python learning lab, free python ide online, nextjs python lab',
  openGraph: {
    title: 'Best AI Python Interpreter & Compiler Online',
    description: 'Write and run Python code instantly in your browser. Get real-time AI help to explain errors and generate code.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Python Learning Lab',
    description: 'The ultimate browser-based Python IDE with AI-powered debugging.',
  }
};

export default function PythonLabPage() {
  return <PythonLab />;
}
