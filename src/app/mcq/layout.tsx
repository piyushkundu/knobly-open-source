import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MCQ Practice Tests — O-Level, Python, IT Tools, Computer Quiz',
    description: 'Free MCQ practice tests for O-Level exam — IT Tools (M1-R5), Python (M3-R5), computer fundamentals, operating system, internet, aur cyber security. Score tracking ke saath unlimited practice.',
    keywords: ['MCQ test', 'O-Level MCQ', 'Python MCQ', 'computer quiz', 'IT Tools MCQ', 'online test', 'NIELIT MCQ', 'O-Level practice test', 'free MCQ online'],
    openGraph: {
        title: 'MCQ Practice Tests — O-Level & Python',
        description: 'Free unlimited MCQ practice tests for O-Level exam preparation.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
