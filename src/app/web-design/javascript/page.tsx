'use client';
import ContentPage, { CodeBlock, Section } from '@/components/content/ContentPage';

export default function JsPage() {
    return (
        <ContentPage title="JavaScript" breadcrumb={{ label: 'Web Design', href: '/web-design' }}>
            <Section title="Variables">
                <CodeBlock lang="javascript" code={`let name = "Knobly";      // can change
const PI = 3.14;          // constant
var old = "avoid using";  // old style`} />
            </Section>
            <Section title="Functions">
                <CodeBlock lang="javascript" code={`// Regular
function greet(name) {
  return "Hello, " + name;
}

// Arrow
const add = (a, b) => a + b;

console.log(greet("World"));
console.log(add(2, 3));`} />
            </Section>
            <Section title="DOM Manipulation">
                <CodeBlock lang="javascript" code={`// Select elements
const el = document.getElementById("myId");
const els = document.querySelectorAll(".card");

// Modify
el.textContent = "New text";
el.style.color = "blue";
el.classList.add("active");

// Events
el.addEventListener("click", () => {
  alert("Clicked!");
});`} />
            </Section>
            <Section title="ES6+ Features">
                <CodeBlock lang="javascript" code={`// Template literals
const msg = \`Hello \${name}, you are \${age} years old\`;

// Destructuring
const { x, y } = { x: 10, y: 20 };
const [first, ...rest] = [1, 2, 3, 4];

// Spread operator
const merged = { ...obj1, ...obj2 };

// Optional chaining
const value = user?.profile?.name;`} />
            </Section>
        </ContentPage>
    );
}
