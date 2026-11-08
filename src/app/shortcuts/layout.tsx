import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Computer Shortcuts — Keyboard Shortcuts Guide',
    description: 'Complete keyboard shortcuts guide — Windows, LibreOffice Writer, Calc, Impress, browser, aur general computer shortcuts. Exam aur daily use ke liye.',
    keywords: ['keyboard shortcuts', 'computer shortcuts', 'Windows shortcuts', 'LibreOffice shortcuts', 'shortcut keys', 'computer tips'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
