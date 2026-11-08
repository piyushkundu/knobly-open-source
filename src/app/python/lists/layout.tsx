import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Python Lists — Methods, Slicing, Comprehensions, Operations',
    description: 'Python lists complete guide — list creation, methods (append, pop, sort, reverse), slicing, list comprehensions, nested lists, aur operations. Hindi + English mein.',
    keywords: ['Python lists', 'Python list methods', 'Python list slicing', 'Python list comprehension', 'Python append pop sort'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
