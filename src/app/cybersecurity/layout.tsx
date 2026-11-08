import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cyber Security Guide 2025 — Threats, Safety Tips, RBI Guidelines',
    description: 'Complete cyber security awareness guide 2025 — phishing, malware, ransomware, social engineering, UPI frauds, latest attacks, password security, RBI guidelines, real cases, aur emergency helplines. Simple Hindi + English mein.',
    keywords: ['cyber security', 'cyber security Hindi', 'phishing attack', 'ransomware', 'UPI fraud', 'online safety', 'RBI guidelines', 'cyber crime helpline', 'internet security tips', 'social engineering'],
    openGraph: {
        title: 'Cyber Security Guide 2025 — Complete Awareness',
        description: 'Latest cyber threats, safety tips, RBI guidelines, and real cases in simple Hindi + English.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
