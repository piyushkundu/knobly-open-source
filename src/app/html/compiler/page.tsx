import { WebLab } from '@/components/web-compiler/WebLab';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best AI HTML, CSS & JavaScript Web Compiler Online | Knobly Web Lab',
  description: 'Experience the best free online Web Compiler with built-in AI assistance. Write, execute, and preview HTML, CSS, and JavaScript instantly in your browser with live devtools console and AI debugging.',
  keywords: 'html compiler, online web compiler, html css js ide, run html online, web lab, online frontend compiler, ai web designer, nextjs web lab',
  openGraph: {
    title: 'Best AI HTML CSS JS Web Compiler Online',
    description: 'Write, preview, and debug HTML, CSS, and JavaScript instantly with real-time AI assistance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Web Development Learning Lab',
    description: 'The ultimate browser-based HTML, CSS, and JavaScript IDE with real-time AI assistance.',
  },
};

export default function HtmlCompilerPage() {
  return <WebLab />;
}
