import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chapter 1 — Introduction to IoT | Internet of Things Hindi',
    description: 'IoT ka introduction — definition, history, characteristics, connectivity, intelligence, sensing aur dynamic nature. O-Level M4-R5 IoT Chapter 1 Hindi mein.',
    keywords: ['IoT introduction', 'what is IoT', 'IoT Hindi', 'IoT history', 'IoT characteristics', 'M4-R5 chapter 1'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
