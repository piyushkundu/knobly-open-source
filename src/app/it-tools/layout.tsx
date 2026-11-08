import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IT Tools & Network Basics — M1-R5 O-Level Chapter-wise Study',
    description: 'O-Level IT Tools & Network Basics (M1-R5) — 9 chapter-wise study material, handwritten notes, Computer, OS, Writer, Calc, Impress, Internet, Email, Finance, Cyber Security. Free access on Knobly Web.',
    keywords: ['IT Tools', 'M1-R5', 'O-Level', 'NIELIT', 'IT Tools chapters', 'handwritten notes', 'O-Level study material', 'Knobly Web'],
    openGraph: {
        title: 'IT Tools — M1-R5 O-Level Chapters',
        description: 'Complete 9-chapter IT Tools study material for NIELIT O-Level M1-R5 exam preparation.',
    },
};

export default function ITToolsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
