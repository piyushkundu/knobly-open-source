import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'O-Level Syllabus — NIELIT Course Structure & Exam Pattern',
    description: 'NIELIT O-Level complete syllabus — M1-R5 IT Tools, M2-R5 Web Design, M3-R5 Python, M4-R5 IoT. Exam pattern, marks distribution, aur practical details.',
    keywords: ['O-Level syllabus', 'NIELIT O-Level', 'O-Level exam pattern', 'M1-R5 syllabus', 'M3-R5 syllabus', 'O-Level course'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
