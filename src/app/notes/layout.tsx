import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'O-Level IT Tools Notes — M1-R5 Chapter-wise PDF Download',
    description: 'O-Level IT Tools & Network Basics (M1-R5) complete chapter-wise notes — Computer, OS, Word Processing, Spreadsheet, Impress, Internet, Email, Digital Finance, Cyber Security. Free PDF download.',
    keywords: ['O-Level notes', 'IT Tools notes', 'M1-R5 notes', 'NIELIT O-Level', 'computer notes', 'LibreOffice notes', 'O-Level PDF', 'IT Tools chapter wise'],
    openGraph: {
        title: 'O-Level IT Tools Notes — Free PDF Download',
        description: 'Complete M1-R5 chapter-wise notes for NIELIT O-Level exam preparation.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
