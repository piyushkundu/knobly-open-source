import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'HTML Tutorial — Elements, Tags, Attributes, Compiler',
    description: 'HTML complete tutorial — tags, elements, attributes, forms, tables, lists, images, links, HTML5 semantic elements, aur online HTML compiler. Hindi + English mein.',
    keywords: ['HTML tutorial', 'HTML Hindi', 'HTML tags', 'HTML elements', 'HTML online compiler', 'learn HTML', 'HTML basics', 'web development'],
    openGraph: {
        title: 'HTML Tutorial — Complete Guide',
        description: 'Free HTML tutorials with online compiler — learn HTML from basics.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
