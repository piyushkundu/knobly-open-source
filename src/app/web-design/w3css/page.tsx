'use client';
import ContentPage, { Section, InfoBox } from '@/components/content/ContentPage';

export default function W3CssPage() {
    return (
        <ContentPage title="W3.CSS" breadcrumb={{ label: 'Web Design', href: '/web-design' }}>
            <Section title="Introduction">
                <p><strong>W3.CSS</strong> is a free, lightweight CSS framework by W3Schools. No JavaScript needed!</p>
                <InfoBox type="tip">Add it to any page: &lt;link rel=&quot;stylesheet&quot; href=&quot;https://www.w3schools.com/w3css/4/w3.css&quot;&gt;</InfoBox>
            </Section>
            <Section title="Responsive Grid">
                <div className="glass-card rounded-xl p-4 my-3 text-sm text-gray-200 overflow-x-auto">
                    <pre><code>{`<div class="w3-row-padding">
  <div class="w3-third">Column 1</div>
  <div class="w3-third">Column 2</div>
  <div class="w3-third">Column 3</div>
</div>`}</code></pre>
                </div>
            </Section>
            <Section title="Common Classes">
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="glass-card rounded-lg p-2"><code>w3-container</code> — padding 16px</div>
                    <div className="glass-card rounded-lg p-2"><code>w3-card-4</code> — card with shadow</div>
                    <div className="glass-card rounded-lg p-2"><code>w3-button</code> — button</div>
                    <div className="glass-card rounded-lg p-2"><code>w3-round</code> — rounded</div>
                    <div className="glass-card rounded-lg p-2"><code>w3-animate-*</code> — animations</div>
                    <div className="glass-card rounded-lg p-2"><code>w3-responsive</code> — responsive table</div>
                </div>
            </Section>
        </ContentPage>
    );
}
