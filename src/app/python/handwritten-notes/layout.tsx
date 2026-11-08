import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Python Handwritten Notes — O-Level M3-R5 | Free PDF Download',
    description: 'Python handwritten notes for O-Level M3-R5 exam — 11 chapters, 275+ pages, free PDF download. Introduction to Programming, Python basics, operators, lists, tuples, dictionaries, functions, file handling, modules, NumPy.',
    keywords: ['Python handwritten notes', 'O-Level Python notes', 'M3-R5 notes', 'Python PDF notes', 'free Python notes', 'NIELIT Python notes', 'Python chapter wise notes'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
