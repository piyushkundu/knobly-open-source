import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Knobly Web',
    description: 'Test management dashboard - view tests, scores, and leaderboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return children;
}
