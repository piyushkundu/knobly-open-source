import { WebLab } from '@/components/web-compiler/WebLab';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best AI Web Compiler Online | HTML, CSS & JavaScript Lab',
  description: 'Experience the best free online Web Compiler with built-in AI assistance. Write, execute, and preview HTML, CSS, and JavaScript in real-time.',
};

export default function WebCompilerPage() {
  return <WebLab />;
}
