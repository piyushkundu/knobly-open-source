import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chapter 2 — Things and Connections | Internet of Things Hindi',
    description: 'IoT Things and Connections — Control systems, open loop, closed loop, and real time systems in IoT. O-Level M4-R5 IoT Chapter 2 Hindi.',
    keywords: ['IoT things and connections', 'IoT control system', 'open loop control system', 'closed loop control system', 'real time system', 'IoT Hindi', 'M4-R5 chapter 2'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
