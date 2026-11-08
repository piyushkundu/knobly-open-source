import type { ComponentProps } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options } from 'rehype-sanitize';
import styles from './SafeAIContent.module.css';

const allowedElements = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'a',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'div', 'span', 'dl', 'dt', 'dd', 'kbd', 'sub', 'sup', 'abbr',
];

const lessonSchema: Options = {
  ...defaultSchema,
  tagNames: allowedElements,
  // Formatting only: no event handlers, styles, IDs, forms, or media requests.
  attributes: {
    a: ['href', 'title'],
    abbr: ['title'],
    code: [['className', /^language-[a-zA-Z0-9_-]+$/]],
    ol: ['start'],
    li: ['value'],
    td: ['colSpan', 'rowSpan'],
    th: ['colSpan', 'rowSpan', 'scope'],
  },
  protocols: { href: ['http', 'https', 'mailto'] },
  strip: [
    ...(defaultSchema.strip ?? []),
    'style', 'iframe', 'object', 'embed', 'svg', 'math',
    'form', 'template', 'noscript',
  ],
};

// HTML must be parsed before sanitization; no unsafe plugins run afterwards.
const lessonPlugins: NonNullable<ComponentProps<typeof Markdown>['rehypePlugins']> = [
  rehypeRaw,
  [rehypeSanitize, lessonSchema],
];

interface SafeAIContentProps {
  content: string;
  format?: 'markdown' | 'html';
  isDark?: boolean;
}

export function SafeAIContent({ content, format = 'markdown', isDark = false }: SafeAIContentProps) {
  return (
    <div className={styles.content} data-format={format} data-theme={isDark ? 'dark' : 'light'}>
      <Markdown
        allowedElements={allowedElements}
        rehypePlugins={format === 'html' ? lessonPlugins : undefined}
      >
        {content}
      </Markdown>
    </div>
  );
}
