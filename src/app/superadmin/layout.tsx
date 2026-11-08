import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Super Admin | Knobly Web',
    description: 'Knobly Web Super Admin Panel — Manage tests, questions, users, gamification, notifications, and more.',
    robots: { index: false, follow: false },
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
