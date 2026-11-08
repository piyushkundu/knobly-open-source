'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play, Sparkles, Code2, Sun, Moon, RotateCcw, Download,
  FolderOpen, ChevronDown, Check, Eye, Terminal, ArrowLeft,
  Smartphone, Tablet, Monitor, Save, Share2, Layers, AlignLeft
} from 'lucide-react';
import { WebCodeEditor } from './WebCodeEditor';
import { WebPreviewConsole } from './WebPreviewConsole';
import { WebAIAssistant } from './WebAIAssistant';
import { WebSavedProjects } from './WebSavedProjects';
import { WebEditorTab, DeviceMode, Language, SavedWebProject } from '@/types/web-compiler';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import { createPreviewConsoleBridge } from '@/lib/preview-sandbox';

import './web-compiler.css';

const DEMO_STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knobly Web Project</title>
</head>
<body>
  <div class="card">
    <div class="badge">✨ HTML5 • CSS3 • JavaScript</div>
    <h1>Knobly Web Compiler</h1>
    <p>Welcome to the AI-powered live web development lab! Edit your HTML, CSS, or JS tabs and watch your changes render instantly in real-time.</p>
    
    <div class="interactive-box">
      <button id="counter-btn" class="btn">Clicked: <span id="count">0</span> times</button>
      <button id="color-btn" class="btn btn-secondary">Change Accent</button>
    </div>

    <div class="footer-note">
      💡 Tip: Use the <b>Ask AI</b> button for instant code generation or debugging!
    </div>
  </div>
</body>
</html>`;

const DEMO_STARTER_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
  color: #f8fafc;
  padding: 24px;
}

.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 40px;
  max-width: 480px;
  width: 100%;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(249, 115, 22, 0.2);
  color: #fb923c;
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

h1 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 28px;
}

.interactive-box {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.btn {
  padding: 12px 20px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.4);
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -5px rgba(249, 115, 22, 0.5);
}

.btn:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.18);
  box-shadow: none;
}

.footer-note {
  font-size: 11px;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}`;

const DEMO_STARTER_JS = `// Interactive JavaScript logic
console.log("Knobly Web Compiler initialized!");

let count = 0;
const counterBtn = document.getElementById('counter-btn');
const countSpan = document.getElementById('count');
const colorBtn = document.getElementById('color-btn');

if (counterBtn && countSpan) {
  counterBtn.addEventListener('click', () => {
    count++;
    countSpan.textContent = count;
    console.log("Button clicked, count is now:", count);
  });
}

if (colorBtn) {
  const hues = [30, 160, 210, 280, 340];
  let hueIndex = 0;
  colorBtn.addEventListener('click', () => {
    hueIndex = (hueIndex + 1) % hues.length;
    const newHue = hues[hueIndex];
    document.querySelector('.btn').style.background = 'hsl(' + newHue + ', 90%, 55%)';
    console.log("Accent color switched to hue:", newHue);
  });
}`;

// Empty defaults so students start with a clean blank canvas without pre-filled boilerplate
const DEFAULT_HTML = '';
const DEFAULT_CSS = '';
const DEFAULT_JS = '';

const TEMPLATES = [
  {
    name: 'Blank Canvas',
    html: '',
    css: '',
    js: '',
  },
  {
    name: 'Starter Interactive Demo',
    html: DEMO_STARTER_HTML,
    css: DEMO_STARTER_CSS,
    js: DEMO_STARTER_JS,
  },
  {
    name: 'Glassmorphic Profile Card',
    html: `<!DOCTYPE html>
<html>
<head><title>Profile Card</title></head>
<body>
  <div class="profile-card">
    <div class="avatar-ring">
      <div class="avatar">👨‍💻</div>
    </div>
    <h2 id="name">Aditya Sharma</h2>
    <p class="role">Full Stack & UI Developer</p>
    
    <div class="skills">
      <span class="tag">HTML5</span>
      <span class="tag">CSS3</span>
      <span class="tag">JavaScript</span>
      <span class="tag">React</span>
    </div>

    <div class="stats">
      <div class="stat"><span class="num">38</span><span class="label">Projects</span></div>
      <div class="stat"><span class="num">1.4k</span><span class="label">Followers</span></div>
      <div class="stat"><span class="num">95%</span><span class="label">Rating</span></div>
    </div>

    <button id="connect-btn" class="follow-btn">Connect With Me</button>
  </div>
</body>
</html>`,
    css: `body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #090d16 0%, #172554 100%);
  margin: 0;
  color: white;
}
.profile-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 36px 30px;
  width: 320px;
  text-align: center;
  backdrop-filter: blur(25px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.avatar-ring {
  width: 90px;
  height: 90px;
  margin: 0 auto 16px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #06b6d4, #f97316);
}
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}
h2 { margin: 0 0 4px; font-size: 20px; font-weight: 700; }
.role { color: #38bdf8; font-size: 13px; margin: 0 0 16px; font-weight: 500; }
.skills { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
.tag { background: rgba(255, 255, 255, 0.08); font-size: 11px; padding: 4px 10px; border-radius: 12px; color: #cbd5e1; }
.stats { display: flex; justify-content: space-around; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 14px 0; margin-bottom: 20px; }
.stat { display: flex; flex-direction: column; text-align: center; }
.num { font-size: 18px; font-weight: 800; color: #f8fafc; }
.label { font-size: 10px; text-transform: uppercase; color: #64748b; margin-top: 2px; }
.follow-btn { width: 100%; padding: 12px; border-radius: 14px; background: linear-gradient(135deg, #0284c7, #06b6d4); color: white; border: none; font-weight: 700; font-size: 13px; cursor: pointer; transition: opacity 0.2s; }
.follow-btn:hover { opacity: 0.9; }`,
    js: `document.getElementById('connect-btn').addEventListener('click', function() {
  this.textContent = 'Connected ✓';
  this.style.background = '#10b981';
  console.log('Connected with user!');
});`,
  },
  {
    name: 'Animated Login Form',
    html: `<!DOCTYPE html>
<html>
<head><title>Login</title></head>
<body>
  <div class="login-box">
    <h2>Welcome Back 👋</h2>
    <p class="subtitle">Please enter your credentials to login</p>
    <form id="login-form">
      <div class="input-group">
        <label>Email Address</label>
        <input type="email" placeholder="student@knobly.in" required id="email" />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" placeholder="••••••••" required id="password" />
      </div>
      <button type="submit" class="submit-btn">Sign In to Dashboard</button>
      <div id="status-msg"></div>
    </form>
  </div>
</body>
</html>`,
    css: `body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #09090b, #18181b);
  margin: 0;
  color: white;
}
.login-box {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 20px;
  padding: 36px;
  width: 340px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
h2 { margin: 0 0 6px; font-size: 22px; font-weight: 800; }
.subtitle { color: #71717a; font-size: 13px; margin: 0 0 24px; }
.input-group { margin-bottom: 18px; text-align: left; }
label { display: block; font-size: 12px; font-weight: 600; color: #a1a1aa; margin-bottom: 6px; }
input { width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 12px; border: 1px solid #27272a; background: #09090b; color: white; font-size: 13px; outline: none; transition: border-color 0.2s; }
input:focus { border-color: #f97316; }
.submit-btn { width: 100%; padding: 12px; border-radius: 12px; background: #f97316; color: white; border: none; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 6px; transition: opacity 0.2s; }
.submit-btn:hover { opacity: 0.9; }
#status-msg { margin-top: 14px; font-size: 12px; text-align: center; }`,
    js: `document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const status = document.getElementById('status-msg');
  status.textContent = 'Signing in ' + email + '...';
  status.style.color = '#38bdf8';
  console.log('Login attempt for:', email);
  setTimeout(() => {
    status.textContent = 'Welcome back! Login Successful. 🎉';
    status.style.color = '#34d399';
  }, 1000);
});`,
  },
  {
    name: 'Interactive Canvas Particle Animation',
    html: `<!DOCTYPE html>
<html>
<head><title>Canvas Particles</title></head>
<body>
  <canvas id="canvas"></canvas>
  <div class="overlay">
    <h2>Interactive Canvas</h2>
    <p>Move your mouse or tap to spawn glowing particles!</p>
  </div>
</body>
</html>`,
    css: `body { margin: 0; overflow: hidden; background: #050508; font-family: sans-serif; }
canvas { display: block; position: absolute; inset: 0; }
.overlay { position: absolute; top: 20px; left: 20px; color: white; pointer-events: none; }
h2 { margin: 0 0 4px; font-size: 20px; color: #f97316; }
p { margin: 0; font-size: 12px; color: #94a3b8; }`,
    js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 4 + 2,
    color: 'hsl(' + (Math.random() * 60 + 10) + ', 100%, 60%)'
  });
}

function animate() {
  ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
window.addEventListener('mousemove', (e) => {
  particles.push({
    x: e.clientX, y: e.clientY,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    size: Math.random() * 6 + 2,
    color: '#06b6d4'
  });
  if (particles.length > 100) particles.shift();
});`,
  },
  {
    name: 'Student Results Table (O-Level)',
    html: `<!DOCTYPE html>
<html>
<head><title>Student Results</title></head>
<body>
  <div class="container">
    <h2>NIELIT O-Level Student Results</h2>
    <table>
      <thead>
        <tr><th>Roll No</th><th>Student Name</th><th>Subject</th><th>Marks</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr><td>101</td><td>Piyush Kundu</td><td>M2-R5 Web Design</td><td>94</td><td><span class="badge pass">Pass</span></td></tr>
        <tr><td>102</td><td>Aman Verma</td><td>M2-R5 Web Design</td><td>82</td><td><span class="badge pass">Pass</span></td></tr>
        <tr><td>103</td><td>Pooja Sharma</td><td>M2-R5 Web Design</td><td>91</td><td><span class="badge pass">Pass</span></td></tr>
        <tr><td>104</td><td>Rohan Gupta</td><td>M2-R5 Web Design</td><td>76</td><td><span class="badge pass">Pass</span></td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`,
    css: `body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: white; padding: 30px; margin: 0; }
.container { max-width: 650px; margin: 0 auto; }
h2 { font-size: 20px; margin-bottom: 20px; color: #f97316; }
table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
th { background: #334155; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #94a3b8; }
td { padding: 14px 16px; border-bottom: 1px solid #334155; font-size: 13px; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #24324a; }
.badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.pass { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }`,
    js: `console.log("Student marks table rendered!");`,
  },
  {
    name: 'Minimal Blank HTML5',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start writing your HTML here...</p>
</body>
</html>`,
    css: `body {
  font-family: sans-serif;
  padding: 30px;
}`,
    js: `// Write your JavaScript here\n`,
  },
];

export function WebLab() {
  const router = useRouter();
  const { user } = useAuth();

  // Tabs state - blank by default as requested
  const [tabs, setTabs] = useState<WebEditorTab[]>([
    { id: 'html', name: 'index.html', language: 'html', code: '' },
    { id: 'css', name: 'style.css', language: 'css', code: '' },
    { id: 'js', name: 'script.js', language: 'javascript', code: '' },
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Runtime & UI state
  const [bundledHtml, setBundledHtml] = useState('');
  const [autoRun, setAutoRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [initialAIError, setInitialAIError] = useState('');
  const [editorWidthPercent, setEditorWidthPercent] = useState(55);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const isDraggingRef = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const autoRunTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state from localStorage on initial render
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('web-lab-theme') as 'dark' | 'light';
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        document.documentElement.classList.toggle('light', savedTheme === 'light');
      } else {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }

      const savedLang = localStorage.getItem('web-lab-language') as Language;
      if (savedLang) setLanguage(savedLang);

      const savedHtml = localStorage.getItem('knobly_web_draft_html');
      const savedCss = localStorage.getItem('knobly_web_draft_css');
      const savedJs = localStorage.getItem('knobly_web_draft_js');

      // If user had the old starter boilerplate saved, clear it so they start completely blank
      const isOldBoilerplate = savedHtml && (
        savedHtml.includes('Knobly Web Compiler') ||
        savedHtml.includes('Welcome to the AI-powered live web development lab') ||
        savedHtml.includes('interactive-box')
      );

      if (isOldBoilerplate) {
        localStorage.removeItem('knobly_web_draft_html');
        localStorage.removeItem('knobly_web_draft_css');
        localStorage.removeItem('knobly_web_draft_js');
        setTabs([
          { id: 'html', name: 'index.html', language: 'html', code: '' },
          { id: 'css', name: 'style.css', language: 'css', code: '' },
          { id: 'js', name: 'script.js', language: 'javascript', code: '' },
        ]);
      } else if (savedHtml || savedCss || savedJs) {
        setTabs([
          { id: 'html', name: 'index.html', language: 'html', code: savedHtml ?? '' },
          { id: 'css', name: 'style.css', language: 'css', code: savedCss ?? '' },
          { id: 'js', name: 'script.js', language: 'javascript', code: savedJs ?? '' },
        ]);
      } else {
        setTabs([
          { id: 'html', name: 'index.html', language: 'html', code: '' },
          { id: 'css', name: 'style.css', language: 'css', code: '' },
          { id: 'js', name: 'script.js', language: 'javascript', code: '' },
        ]);
      }
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }, []);

  // Bundling function: combines all tabs + injects console logger
  const bundleCode = useCallback((currentTabs: WebEditorTab[]) => {
    const htmlTab = currentTabs.find((t) => t.language === 'html')?.code || '';
    const cssTab = currentTabs.filter((t) => t.language === 'css').map((t) => t.code).join('\n\n');
    const jsTab = currentTabs.filter((t) => t.language === 'javascript').map((t) => t.code).join('\n\n');

    const consoleInjectionScript = `
<script>
${createPreviewConsoleBridge(window.location.origin)}
(function() {
  // Intercept anchor clicks
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest ? e.target.closest('a, area') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    var trimmed = href.trim();
    if (!trimmed || trimmed === '#') {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var lower = trimmed.toLowerCase();
    if (lower.startsWith('javascript:')) return;
    if (trimmed.startsWith('#')) {
      e.preventDefault();
      e.stopPropagation();
      var targetId = trimmed.substring(1).trim();
      if (!targetId || targetId.toLowerCase() === 'top') {
        var topEl = document.getElementById('top') || document.querySelector('[name="top"]') || document.querySelector('a[name="top"]');
        if (topEl) topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      try {
        var el = document.getElementById(targetId) || document.querySelector('[name="' + targetId + '"]') || document.querySelector('a[name="' + targetId + '"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(err) {
        var el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    var isExternal = lower.startsWith('http://')
                  || lower.startsWith('https://')
                  || lower.startsWith('//')
                  || lower.startsWith('mailto:')
                  || lower.startsWith('tel:');
    if (isExternal) {
      e.preventDefault();
      e.stopPropagation();
      try { window.open(trimmed, '_blank', 'noopener,noreferrer'); } catch(err) {}
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }, true);

  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, true);
})();
</script>`;

    let finalHtml = htmlTab;

    // Inject CSS
    if (cssTab.trim()) {
      const styleBlock = '<style>\n' + cssTab + '\n</style>';
      if (finalHtml.includes('</head>')) {
        finalHtml = finalHtml.replace('</head>', styleBlock + '\n</head>');
      } else {
        finalHtml = styleBlock + '\n' + finalHtml;
      }
    }

    // Inject Console Interceptor + JS
    const jsBlock = consoleInjectionScript + '\n<script>\ntry {\n' + jsTab + '\n} catch(err) { console.error(err.message); }\n</script>';

    if (finalHtml.includes('</body>')) {
      finalHtml = finalHtml.replace('</body>', jsBlock + '\n</body>');
    } else {
      finalHtml = finalHtml + '\n' + jsBlock;
    }

    return finalHtml;
  }, []);

  // Update bundled preview
  const handleCompile = useCallback(() => {
    setIsRunning(true);
    const bundled = bundleCode(tabs);
    setBundledHtml(bundled);

    // Save drafts to localStorage
    try {
      const htmlCode = tabs.find((t) => t.language === 'html')?.code || '';
      const cssCode = tabs.find((t) => t.language === 'css')?.code || '';
      const jsCode = tabs.find((t) => t.language === 'javascript')?.code || '';
      localStorage.setItem('knobly_web_draft_html', htmlCode);
      localStorage.setItem('knobly_web_draft_css', cssCode);
      localStorage.setItem('knobly_web_draft_js', jsCode);
    } catch (e) {}

    setTimeout(() => setIsRunning(false), 300);
  }, [bundleCode, tabs]);

  // Initial compile
  useEffect(() => {
    handleCompile();
  }, []);

  // Auto-run debounce
  useEffect(() => {
    if (!autoRun) return;
    if (autoRunTimerRef.current) clearTimeout(autoRunTimerRef.current);

    autoRunTimerRef.current = setTimeout(() => {
      const bundled = bundleCode(tabs);
      setBundledHtml(bundled);
    }, 450);

    return () => {
      if (autoRunTimerRef.current) clearTimeout(autoRunTimerRef.current);
    };
  }, [tabs, autoRun, bundleCode]);

  // Code change in active tab
  const handleCodeChange = (newCode: string) => {
    setTabs((prev) =>
      prev.map((t, idx) =>
        idx === activeTabIndex ? { ...t, code: newCode, isDirty: true } : t
      )
    );
  };

  const handleSwitchTab = (index: number) => {
    setActiveTabIndex(index);
  };

  const handleNewTab = (name: string, language: 'html' | 'css' | 'javascript') => {
    const newTab: WebEditorTab = {
      id: Date.now().toString(),
      name,
      language,
      code: language === 'html' ? '<div></div>' : '',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabIndex(tabs.length);
  };

  const handleCloseTab = (index: number) => {
    if (tabs.length <= 1) return;
    setTabs((prev) => prev.filter((_, i) => i !== index));
    if (activeTabIndex >= index && activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('web-lab-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('web-lab-language', lang);
  };

  const handleSelectTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTabs([
      { id: 'html', name: 'index.html', language: 'html', code: tpl.html },
      { id: 'css', name: 'style.css', language: 'css', code: tpl.css },
      { id: 'js', name: 'script.js', language: 'javascript', code: tpl.js },
    ]);
    setActiveTabIndex(0);
    setShowTemplates(false);
    setTimeout(() => handleCompile(), 100);
  };

  const handleFormatCode = () => {
    setTabs((prev) =>
      prev.map((tab) => {
        let formatted = tab.code;
        if (tab.language === 'html') {
          formatted = formatted
            .replace(/>\s*</g, '>\n<')
            .split('\n')
            .map((line) => line.trim())
            .join('\n');
        }
        return { ...tab, code: formatted };
      })
    );
    setStatusNotification('Code formatted ✨');
    setTimeout(() => setStatusNotification(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([bundledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knobly-project.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset code to blank? Unsaved changes will be lost.')) {
      setTabs([
        { id: 'html', name: 'index.html', language: 'html', code: '' },
        { id: 'css', name: 'style.css', language: 'css', code: '' },
        { id: 'js', name: 'script.js', language: 'javascript', code: '' },
      ]);
      try {
        localStorage.removeItem('knobly_web_draft_html');
        localStorage.removeItem('knobly_web_draft_css');
        localStorage.removeItem('knobly_web_draft_js');
      } catch (e) {}
      setActiveTabIndex(0);
      setTimeout(() => handleCompile(), 100);
    }
  };

  const handleLoadSavedProject = (proj: SavedWebProject) => {
    setTabs([
      { id: 'html', name: 'index.html', language: 'html', code: proj.html },
      { id: 'css', name: 'style.css', language: 'css', code: proj.css },
      { id: 'js', name: 'script.js', language: 'javascript', code: proj.js },
    ]);
    setActiveTabIndex(0);
    setTimeout(() => handleCompile(), 100);
    setStatusNotification('Loaded project "' + proj.title + '"!');
    setTimeout(() => setStatusNotification(null), 2500);
  };

  const handleApplyAICode = (code: string) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.language === 'html') {
          return { ...tab, code };
        }
        return tab;
      })
    );
    setActiveTabIndex(0);
    setTimeout(() => handleCompile(), 100);
    setStatusNotification('Applied AI code to index.html! 🎉');
    setTimeout(() => setStatusNotification(null), 3000);
  };

  return (
    <div className="web-compiler-root flex flex-col h-[100dvh] w-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 md:px-6 h-[54px] md:h-[60px] bg-[var(--header-bg)] backdrop-blur-2xl border-b border-[var(--border-color)] shrink-0 z-30">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const from = params.get('from');
                if (from) {
                  router.push(from);
                  return;
                }
                const storedFrom = sessionStorage.getItem('knobly_compiler_return');
                if (storedFrom) {
                  sessionStorage.removeItem('knobly_compiler_return');
                  router.push(storedFrom);
                  return;
                }
                if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
                  router.back();
                  return;
                }
              }
              router.push('/html');
            }}
            title="Go Back"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[var(--border-color)] shadow-sm flex items-center justify-center bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="text-[var(--text-primary)]" />
          </button>

          <div className="relative">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Code2 size={18} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[var(--bg-primary)] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-extrabold text-[var(--text-primary)] font-mono tracking-tight flex items-center gap-1.5">
              <span>Knobly Web Lab</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold">
                HTML • CSS • JS
              </span>
            </h1>
            <span className="text-[10px] text-[var(--text-muted)] -mt-0.5 hidden sm:block">
              Interactive Web Compiler & AI Tutor
            </span>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Compile / Run Button */}
          <button
            onClick={handleCompile}
            disabled={isRunning}
            data-run-button="true"
            title="Compile & Run (F5 or Ctrl+Enter)"
            className="flex items-center gap-1.5 px-3 md:px-5 h-8 md:h-9 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-orange-500/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={12} fill="currentColor" className={isRunning ? 'animate-spin' : ''} />
            <span className="mt-0.5">{isRunning ? 'Updating' : 'Run'}</span>
          </button>

          {/* Auto-Run Toggle (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)]">
            <span className="text-[10px] font-semibold">Auto-Run</span>
            <button
              onClick={() => setAutoRun(!autoRun)}
              className={'w-7 h-4 rounded-full transition-colors relative ' + (autoRun ? 'bg-orange-500' : 'bg-gray-600')}
            >
              <div
                className={'w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ' + (autoRun ? 'left-3.5' : 'left-0.5')}
              />
            </button>
          </div>

          {/* iAsk AI Assistant Button */}
          <button
            onClick={() => {
              setInitialAIError('');
              setShowAIAssistant(true);
            }}
            title="Ask AI to Generate or Explain Code"
            className="flex items-center gap-1.5 px-2.5 md:px-4 h-8 md:h-9 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] transition-all group"
          >
            <div className="w-4 h-4 rounded-full border-[2.5px] border-b-pink-500 border-l-pink-500 border-t-purple-500 border-r-indigo-500 animate-[spin_3s_linear_infinite] shrink-0" />
            <span className="hidden sm:inline font-extrabold text-xs">
              i<span className="text-sm uppercase text-[var(--accent-primary)]">A</span>sk AI
            </span>
          </button>

          {/* Templates Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1 px-2.5 h-8 md:h-9 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all"
            >
              <Sparkles size={13} className="text-purple-400" />
              <span className="hidden md:inline">Templates</span>
              <ChevronDown size={11} />
            </button>

            {showTemplates && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl py-1.5 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 border-b border-[var(--border-color)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Starter Templates
                  </div>
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => handleSelectTemplate(t)}
                      className="w-full text-left px-3 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors flex items-center justify-between"
                    >
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Saved Projects Modal Trigger */}
          <button
            onClick={() => setShowSavedModal(true)}
            title="My Saved Projects"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <FolderOpen size={15} />
          </button>

          {/* Download Project */}
          <button
            onClick={handleDownload}
            title="Download index.html"
            className="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-full border border-[var(--border-color)] items-center justify-center bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <Download size={14} />
          </button>

          {/* Reset / Clear Code */}
          <button
            onClick={handleReset}
            title="Reset to Template"
            className="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-full border border-[var(--border-color)] items-center justify-center bg-[var(--glass-bg)] hover:bg-red-500/10 hover:text-red-400 text-[var(--text-muted)] transition-all"
          >
            <RotateCcw size={14} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--glass-bg)] hover:bg-[var(--bg-tertiary)] transition-all"
          >
            {theme === 'dark' ? (
              <Moon size={15} className="text-indigo-300" />
            ) : (
              <Sun size={15} className="text-amber-500" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 pt-1.5 shrink-0">
        <button
          onClick={() => setMobileTab('editor')}
          className={'flex-1 py-2 text-xs font-bold transition-colors border-b-2 ' + (
            mobileTab === 'editor'
              ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
              : 'border-transparent text-[var(--text-muted)]'
          )}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={'flex-1 py-2 text-xs font-bold transition-colors border-b-2 ' + (
            mobileTab === 'preview'
              ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
              : 'border-transparent text-[var(--text-muted)]'
          )}
        >
          Live Preview
        </button>
      </div>

      {/* Status Toast */}
      {statusNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs shadow-xl animate-in fade-in slide-in-from-top-2">
          {statusNotification}
        </div>
      )}

      {/* Main Split Content Area */}
      <main
        ref={mainRef}
        className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden"
      >
        {/* Left Panel: Code Editor */}
        <div
          className={'h-full w-full md:block ' + (mobileTab !== 'editor' ? 'hidden' : '')}
          style={{ flex: '1 1 ' + editorWidthPercent + '%', minWidth: 260 }}
        >
          <WebCodeEditor
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onSwitchTab={handleSwitchTab}
            onNewTab={handleNewTab}
            onCloseTab={handleCloseTab}
            onChange={handleCodeChange}
            theme={theme}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            onFormat={handleFormatCode}
            onRun={handleCompile}
            isRunning={isRunning}
          />
        </div>

        {/* Draggable Divider for Desktop */}
        <div
          className="hidden md:flex shrink-0 items-center justify-center cursor-col-resize hover:bg-[var(--accent-primary)]/20 transition-colors z-20"
          style={{ width: 6 }}
          onMouseDown={(e) => {
            e.preventDefault();
            isDraggingRef.current = true;
            const main = mainRef.current;
            if (!main) return;
            const onMove = (ev: MouseEvent) => {
              if (!isDraggingRef.current) return;
              const rect = main.getBoundingClientRect();
              const pct = Math.min(80, Math.max(25, ((ev.clientX - rect.left) / rect.width) * 100));
              setEditorWidthPercent(pct);
            };
            const onUp = () => {
              isDraggingRef.current = false;
              document.removeEventListener('mousemove', onMove);
              document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
          }}
        >
          <div className="w-1 h-10 rounded-full bg-[var(--border-color)] opacity-60 hover:opacity-100" />
        </div>

        {/* Right Panel: Live Preview & DevTools Console */}
        <div
          className={'h-full w-full md:block ' + (mobileTab !== 'preview' ? 'hidden' : '')}
          style={{ flex: '0 1 ' + (100 - editorWidthPercent) + '%', minWidth: 260 }}
        >
          <WebPreviewConsole
            bundledHtml={bundledHtml}
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
            onAskAIWithErrors={(errors) => {
              setInitialAIError(errors);
              setShowAIAssistant(true);
            }}
            onRefresh={handleCompile}
          />
        </div>
      </main>

      {/* AI Web Assistant Modal */}
      <WebAIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onApplyGeneratedCode={handleApplyAICode}
        currentCode={tabs[activeTabIndex]?.code || ''}
        initialErrorText={initialAIError}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Saved Projects Modal */}
      <WebSavedProjects
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        onLoadProject={handleLoadSavedProject}
        onSaveCurrent={(title) => {
          setStatusNotification('Project "' + title + '" saved successfully!');
          setTimeout(() => setStatusNotification(null), 2500);
        }}
        currentTabs={tabs}
      />

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
