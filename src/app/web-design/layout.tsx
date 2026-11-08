import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Web Design — HTML, CSS, JavaScript Tutorial Hindi',
    description: 'Web design complete course — HTML structure, CSS styling, JavaScript programming, responsive design, aur W3.CSS framework. Hindi + English mein free tutorial with examples.',
    keywords: ['web design', 'HTML tutorial Hindi', 'CSS tutorial', 'JavaScript Hindi', 'web development', 'frontend development', 'responsive design', 'W3CSS'],
    openGraph: {
        title: 'Web Design — HTML, CSS, JavaScript',
        description: 'Free web design tutorials — HTML, CSS, JavaScript in Hindi + English.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
