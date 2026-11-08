'use client';
import ContentPage, { CodeBlock, Section } from '@/components/content/ContentPage';

export default function CssPage() {
    return (
        <ContentPage title="CSS" breadcrumb={{ label: 'Web Design', href: '/web-design' }}>
            <Section title="Selectors">
                <CodeBlock lang="css" code={`/* Element */
p { color: blue; }

/* Class */
.card { background: #f0f0f0; padding: 20px; }

/* ID */
#header { height: 60px; }

/* Attribute */
input[type="text"] { border: 1px solid gray; }`} />
            </Section>
            <Section title="Flexbox">
                <CodeBlock lang="css" code={`.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;       /* vertical */
  gap: 16px;
  flex-wrap: wrap;
}`} />
            </Section>
            <Section title="Grid">
                <CodeBlock lang="css" code={`.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}`} />
            </Section>
            <Section title="Responsive Design">
                <CodeBlock lang="css" code={`@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .sidebar { display: none; }
}`} />
            </Section>
        </ContentPage>
    );
}
