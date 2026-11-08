import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CCC Course — NIELIT CCC Exam Preparation',
    description: 'NIELIT CCC (Course on Computer Concepts) exam preparation — computer basics, internet, LibreOffice, digital literacy, aur MCQ practice tests. Hindi mein free study material.',
    keywords: ['CCC course', 'CCC exam', 'NIELIT CCC', 'CCC MCQ', 'CCC notes', 'computer concepts', 'CCC preparation'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
