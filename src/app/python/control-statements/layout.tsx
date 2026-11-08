import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Python Control Statements — if-else, Loops, Break, Continue',
    description: 'Python control statements — if-else conditions, for loop, while loop, break, continue, nested loops, aur pattern programs. Hindi + English explanation with examples.',
    keywords: ['Python if else', 'Python loops', 'Python for loop', 'Python while loop', 'Python break continue', 'Python pattern programs'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
