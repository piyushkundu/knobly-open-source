import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Python Programming — Complete Course | Free Tutorial Hindi',
    description: 'Python programming complete course — fundamentals, control statements, lists, tuples, file handling, NumPy aur handwritten notes. O-Level M3-R5 exam ke liye best free tutorial Hindi mein.',
    keywords: ['Python programming', 'Python tutorial Hindi', 'O-Level Python', 'M3-R5', 'Python fundamentals', 'Python lists', 'Python tuples', 'Python file handling', 'Python NumPy', 'NIELIT Python'],
    openGraph: {
        title: 'Python Programming — Complete Course',
        description: 'Free Python programming course with handwritten notes, MCQ, and practice questions for O-Level M3-R5.',
    },
};

export default function PythonLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
