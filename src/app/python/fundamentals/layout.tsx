import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Python Fundamentals — Variables, Data Types, Operators, I/O',
    description: 'Python fundamentals chapter — variables, data types (int, float, string, bool), operators, input/output, type casting, aur comments. Hindi + English mein simple explanation with code examples.',
    keywords: ['Python fundamentals', 'Python variables', 'Python data types', 'Python operators', 'Python input output', 'Python basics Hindi'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
