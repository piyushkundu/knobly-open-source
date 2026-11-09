'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { KnoblyApp } from '@/types/app';

import BootScreen from '@/components/layout/BootScreen';
import LoginModal from '@/components/auth/LoginModal';
import AppGrid from '@/components/apps/AppGrid';

// ── Static Base Apps ──
const BASE_APPS: Record<string, KnoblyApp[]> = {
  Main: [
    { id: 'security', name: 'Security', type: 'Cyber', link: '/cybersecurity', icon: 'ph-bold ph-shield-check', color: 'text-emerald-400', borderClass: 'border-emerald', category: 'Main' },
    { id: 'aiweb', name: 'AI Web', type: 'Future', link: '/ai', icon: 'ph-bold ph-robot', color: 'text-purple-400', borderClass: 'border-purple', category: 'Main' },
    { id: 'youtube', name: 'YouTube', type: 'Channel', link: 'https://youtube.com/@knobly1', icon: 'ph-bold ph-youtube-logo', color: 'text-red-500', borderClass: 'border-red', category: 'Main' },
    { id: 'python-lab', name: 'Python Interpreter', type: 'With AI', link: '/python-lab', icon: 'ph-bold ph-terminal-window', color: 'text-indigo-400', borderClass: 'border-indigo', category: 'Main' },
    { id: 'c-lab', name: 'C Compiler', type: 'With AI', link: '/c-lab', icon: 'ph-bold ph-terminal-window', color: 'text-green-500', borderClass: 'border-green', category: 'Main' },
    { id: 'html-compiler', name: 'Web Compiler', type: 'With AI', link: '/html/compiler', icon: 'ph-bold ph-code', color: 'text-orange-500', borderClass: 'border-orange', category: 'Main' },
    { id: 'test-journey', name: 'Test Journey', type: 'Dashboard', link: '/dashboard', icon: 'ph-bold ph-trophy', color: 'text-amber-400', borderClass: 'border-amber', category: 'Main' },
    { id: 'top10-news', name: 'Top 10 News', type: 'AI News', link: '/tech-news', icon: 'ph-bold ph-newspaper', color: 'text-rose-400', borderClass: 'border-rose', category: 'Main' },
    { id: 'topic-explainer', name: 'Topic Explainer', type: 'AI Explain', link: '__topic_explainer__', icon: 'ph-duotone ph-magic-wand', color: 'text-fuchsia-400', borderClass: 'border-fuchsia', category: 'Main' },
    { id: 'map-game', name: 'Map Game', type: 'Play', link: 'https://createme.in', icon: 'ph-bold ph-map-trifold', color: 'text-emerald-500', borderClass: 'border-emerald', category: 'Main' },
    { id: 'typing-master', name: 'Typing Master', type: 'Learn', link: '/typing', icon: 'ph-bold ph-keyboard', color: 'text-teal-400', borderClass: 'border-cyan', category: 'Main' },
    { id: 'ubuntu-terminal', name: 'Ubuntu Terminal', type: 'System', link: '/terminal', icon: 'ph-bold ph-terminal', color: 'text-orange-500', borderClass: 'border-orange', category: 'Main' },
  ],
  OLevel: [
    { id: 'syllabus', name: 'Syllabus', type: 'Info', link: '/syllabus', icon: 'ph-bold ph-list-bullets', color: 'text-gray-300', borderClass: 'border-slate', category: 'OLevel' },
    { id: 'it-tools', name: 'IT Tools', type: 'Module 1', link: '__it_tools__', icon: 'ph-bold ph-desktop', color: 'text-sky-400', borderClass: 'border-sky', category: 'OLevel' },
    { id: 'webdes', name: 'Web Design', type: 'Module 2', link: '__web_design__', icon: 'ph-bold ph-paint-brush', color: 'text-pink-400', borderClass: 'border-pink', category: 'OLevel' },
    { id: 'python', name: 'Python', type: 'Module 3', link: '/python', icon: 'ti ti-brand-python', color: 'text-yellow-400', borderClass: 'border-yellow', category: 'OLevel' },
    { id: 'iot', name: 'IoT', type: 'Module 4', link: '/iot', icon: 'ph-bold ph-wifi-high', color: 'text-orange-400', borderClass: 'border-orange', category: 'OLevel' },
  ],
  CCC: [
    { id: 'notes', name: 'CCC Notes', type: 'Notes', link: '/notes', icon: 'ti ti-notes', color: 'text-cyan-300', borderClass: 'border-cyan', category: 'Main' },
    { id: 'mock-test', name: 'Mock Test', type: 'Practice', link: '/dashboard', icon: 'ph-bold ph-exam', color: 'text-blue-400', borderClass: 'border-blue', category: 'CCC' },
    { id: 'shortcuts', name: 'Shortcuts', type: 'Utility', link: '/shortcuts', icon: 'ph-bold ph-keyboard', color: 'text-slate-300', borderClass: 'border-slate', category: 'CCC' },
  ],
};

// ── IT Tools Module 1 — Chapter sub-items (shown as icon grid inside dashboard) ──
const IT_TOOLS_CHAPTERS: KnoblyApp[] = [
  { id: 'it-ch1', name: 'Chapter 1', type: 'Computer Intro', link: '/olevel/chapter-1', icon: 'ph-bold ph-monitor', color: 'text-blue-400', borderClass: 'border-blue', category: 'OLevel' },
  { id: 'it-ch2', name: 'Chapter 2', type: 'Coming Soon', link: '', icon: 'ph-bold ph-gear', color: 'text-purple-400', borderClass: 'border-purple', category: 'OLevel' },
  { id: 'it-ch3', name: 'Chapter 3', type: 'Coming Soon', link: '', icon: 'ph-bold ph-file-text', color: 'text-emerald-400', borderClass: 'border-emerald', category: 'OLevel' },
  { id: 'it-ch4', name: 'Chapter 4', type: 'Coming Soon', link: '', icon: 'ph-bold ph-table', color: 'text-orange-400', borderClass: 'border-orange', category: 'OLevel' },
  { id: 'it-ch5', name: 'Chapter 5', type: 'Coming Soon', link: '', icon: 'ph-bold ph-presentation-chart', color: 'text-red-400', borderClass: 'border-red', category: 'OLevel' },
  { id: 'it-ch6', name: 'Chapter 6', type: 'Coming Soon', link: '', icon: 'ph-bold ph-globe-simple', color: 'text-cyan-400', borderClass: 'border-cyan', category: 'OLevel' },
  { id: 'it-ch7', name: 'Chapter 7', type: 'Coming Soon', link: '', icon: 'ph-bold ph-envelope-simple', color: 'text-pink-400', borderClass: 'border-pink', category: 'OLevel' },
  { id: 'it-ch8', name: 'Chapter 8', type: 'Coming Soon', link: '', icon: 'ph-bold ph-wallet', color: 'text-indigo-400', borderClass: 'border-indigo', category: 'OLevel' },
  { id: 'it-ch9', name: 'Chapter 9', type: 'Coming Soon', link: '', icon: 'ph-bold ph-shield-check', color: 'text-amber-400', borderClass: 'border-amber', category: 'OLevel' },
  { id: 'it-handwritten', name: 'Handwritten', type: 'Reading', link: '/notes', icon: 'ph-bold ph-pen-nib', color: 'text-yellow-400', borderClass: 'border-yellow', category: 'OLevel' },
];

// ── Web Design Module 2 — Sub-items ──
const WEB_DESIGN_CHAPTERS: KnoblyApp[] = [
  { id: 'html', name: 'HTML', type: 'Structure', link: '/html', icon: 'ti ti-brand-html5', color: 'text-orange-500', borderClass: 'border-orange', category: 'OLevel' },
  { id: 'css', name: 'CSS', type: 'Style', link: '/web-design/css', icon: 'ti ti-brand-css3', color: 'text-blue-500', borderClass: 'border-blue', category: 'OLevel' },
  { id: 'js', name: 'JS', type: 'Scripting', link: '/web-design/javascript', icon: 'ti ti-brand-javascript', color: 'text-yellow-400', borderClass: 'border-yellow', category: 'OLevel' },
  { id: 'w3css', name: 'W3.CSS', type: 'Framework', link: '/web-design/w3css', icon: 'ph-bold ph-layout', color: 'text-green-400', borderClass: 'border-green', category: 'OLevel' },
];

const TABS = ['Main', 'OLevel', 'CCC', 'Favourites'] as const;
type ActiveNav = 'home' | 'apps' | 'youtube' | 'stats' | 'settings';

function isActiveNav(value: string): value is ActiveNav {
  return value === 'home' || value === 'apps' || value === 'youtube' || value === 'stats' || value === 'settings';
}

const WALLPAPER_OPTIONS = [
  { id: 'default', label: 'Core', thumbClass: 'wallpaper-thumb-default', thumbBg: 'radial-gradient(circle at 15% 30%, #38bdf8 0%, transparent 55%), radial-gradient(circle at 85% 70%, #8b5cf6 0%, transparent 55%), radial-gradient(circle at 50% 50%, #1e3a5f 0%, #0f172a 100%)' },
  { id: 'ocean', label: 'Ocean', thumbClass: 'wallpaper-thumb-ocean', thumbBg: 'radial-gradient(circle at 10% 20%, #38bdf8 0%, transparent 50%), radial-gradient(circle at 90% 80%, #3b82f6 0%, transparent 50%), linear-gradient(135deg, #0c4a6e 0%, #1e40af 100%)' },
  { id: 'purple', label: 'Neon', thumbClass: 'wallpaper-thumb-purple', thumbBg: 'radial-gradient(circle at 15% 25%, #f472b6 0%, transparent 55%), radial-gradient(circle at 85% 75%, #818cf8 0%, transparent 55%), linear-gradient(135deg, #581c87 0%, #312e81 100%)' },
  { id: 'sunset', label: 'Sunset', thumbClass: 'wallpaper-thumb-sunset', thumbBg: 'radial-gradient(circle at 10% 25%, #fb7185 0%, transparent 55%), radial-gradient(circle at 90% 75%, #fdba74 0%, transparent 55%), linear-gradient(135deg, #9f1239 0%, #c2410c 100%)' },
  { id: 'matrix', label: 'Matrix', thumbClass: 'wallpaper-thumb-matrix', thumbBg: 'radial-gradient(circle at 15% 30%, #22c55e 0%, transparent 55%), radial-gradient(circle at 85% 70%, #2dd4bf 0%, transparent 55%), linear-gradient(135deg, #064e3b 0%, #065f46 100%)' },
];

const VIDEOS = [
  { id: '_yYBKI0FW_I', title: 'Master Python Lists in ONE Video!', views: 'Featured' },
  { id: 'rlAaZruWkK0', title: 'O-Level Python Practical Exam', views: 'Featured' },
  { id: 'XIeiGNKMPt4', title: 'Python For Loop Explained 🔥', views: 'Featured' },
  { id: 'vHKhQhW0koU', title: 'Master Python Loops: For & While Loop', views: 'Featured' },
  { id: 'OrRv_CSmakM', title: 'Python Decision Making Made Easy', views: 'Featured' },
  { id: 'sUlahBo2Xik', title: 'Python Fundamentals Part 1', views: 'Featured' },
  { id: 'I2T6Fztf590', title: 'Create & Format Tables in LibreOffice Writer', views: 'Featured' },
];

const NAV_ITEMS = [
  { id: 'home' as const, icon: 'ph-bold ph-house' },
  { id: 'apps' as const, icon: 'ph-bold ph-squares-four' },
  { id: 'stats' as const, icon: 'ph-bold ph-chart-bar' },
  { id: 'settings' as const, icon: 'ph-bold ph-gear' },
];

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'apps', label: 'Apps' },
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAdmin, logout, createUserId, getUserIdForCurrentUser } = useAuth();
  const { isDark, toggleTheme, wallpaper, setWallpaper } = useTheme();

  // ── Boot (only first visit ever) ──
  const [booted, setBooted] = useState(false);
  const [bootChecked, setBootChecked] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('knobly_booted') === 'true') {
      setBooted(true);
    }
    setBootChecked(true);
  }, []);
  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('knobly_booted', 'true');
    setBooted(true);
  }, []);

  // ── Navigation ──
  const [activeNav, setActiveNav] = useState<ActiveNav>('home');
  const [activeTab, setActiveTab] = useState<string>('Main');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Modals ──
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // ── Data ──
  const [globalApps, setGlobalApps] = useState<KnoblyApp[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [hiddenApps, setHiddenApps] = useState<string[]>([]);
  const [recentApps, setRecentApps] = useState<KnoblyApp[]>([]);

  // ── Clock ──
  const [currentTime, setCurrentTime] = useState('');
  const [dateString, setDateString] = useState('');
  const [greeting, setGreeting] = useState('');

  // ── Weather ──
  const [weatherTemp, setWeatherTemp] = useState<string | null>(null);
  const [weatherIcon, setWeatherIcon] = useState('ph-cloud-sun');
  const [weatherCity, setWeatherCity] = useState('');

  // ── YouTube ──
  const [currentVideo, setCurrentVideo] = useState(VIDEOS[0]);
  const [myVideos, setMyVideos] = useState(VIDEOS);

  // ── Settings ──
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [settingsSearch, setSettingsSearch] = useState('');
  const [performanceMode, setPerformanceMode] = useState(true);
  const [appsFilter, setAppsFilter] = useState<'all' | 'hidden'>('all');

  // ── User / Profile ──
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameVal, setEditNameVal] = useState('');

  // ── User ID Creation ──
  const [userIdInput, setUserIdInput] = useState('');
  const [userIdPassword, setUserIdPassword] = useState('');
  const [userIdStatus, setUserIdStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userIdMsg, setUserIdMsg] = useState('');
  const [existingUserId, setExistingUserId] = useState<string | null>(null);

  // Check if user already has a User ID
  useEffect(() => {
    if (user) {
      getUserIdForCurrentUser().then(id => setExistingUserId(id)).catch(() => { });
    } else {
      setExistingUserId(null);
    }
  }, [user, getUserIdForCurrentUser]);

  // ── Topic Explainer Modal ──
  const [showTopicExplainer, setShowTopicExplainer] = useState(false);
  const [teSubject, setTeSubject] = useState('');
  const [teTopic, setTeTopic] = useState('');
  const [teLang, setTeLang] = useState<'en' | 'hi'>('hi');

  // ── Notes ──
  const [notesText, setNotesText] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);

  // ── IT Tools & Web Design Chapter View ──
  const [showITToolsChapters, setShowITToolsChapters] = useState(false);
  const [showWebDesignChapters, setShowWebDesignChapters] = useState(false);

  // ── State Persistence (For Browser Back) ──
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  // ── Context Menus ──
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showAppContextMenu, setShowAppContextMenu] = useState(false);
  const [appContextPos, setAppContextPos] = useState({ x: 0, y: 0 });
  const [contextApp, setContextApp] = useState<KnoblyApp | null>(null);

  // ── Uptime ──
  const [uptimeString, setUptimeString] = useState('Just now');

  // ── Mobile detect ──
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateString(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase());
      const hour = now.getHours();
      setGreeting(hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Load favourites, hidden, userName, notes, recentApps from localStorage ──
  useEffect(() => {
    const savedFavs = localStorage.getItem('knobly-favourites');
    const savedHidden = localStorage.getItem('knobly-hidden');
    const savedName = localStorage.getItem('knobly-guest-name');
    const savedNotes = localStorage.getItem('knobly-notes');
    const savedRecent = localStorage.getItem('knobly-recent-apps');
    if (savedFavs) setFavourites(JSON.parse(savedFavs));
    if (savedHidden) setHiddenApps(JSON.parse(savedHidden));
    if (savedName) setUserName(savedName);
    if (savedNotes) setNotesText(savedNotes);
    if (savedRecent) setRecentApps(JSON.parse(savedRecent));
    
    // Load session state for navigation
    const savedTab = sessionStorage.getItem('knobly-active-tab');
    const savedNav = sessionStorage.getItem('knobly-active-nav');
    const savedITTools = sessionStorage.getItem('knobly-it-tools-view');
    const savedWebDesign = sessionStorage.getItem('knobly-web-design-view');
    if (savedTab) setActiveTab(savedTab);
    if (savedNav && isActiveNav(savedNav)) setActiveNav(savedNav);
    if (savedITTools === 'true') setShowITToolsChapters(true);
    if (savedWebDesign === 'true') setShowWebDesignChapters(true);
    setIsStateLoaded(true);

    setIsMobile(window.innerWidth <= 640);
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Save navigation state to sessionStorage ──
  useEffect(() => {
    if (isStateLoaded) {
      sessionStorage.setItem('knobly-active-tab', activeTab);
      sessionStorage.setItem('knobly-active-nav', activeNav);
      sessionStorage.setItem('knobly-it-tools-view', showITToolsChapters.toString());
      sessionStorage.setItem('knobly-web-design-view', showWebDesignChapters.toString());
    }
  }, [activeTab, activeNav, showITToolsChapters, showWebDesignChapters, isStateLoaded]);

  // ── Uptime tracker ──
  useEffect(() => {
    const bootTime = Date.now();
    const interval = setInterval(() => {
      const diffSec = Math.floor((Date.now() - bootTime) / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      if (hours === 0 && minutes === 0) setUptimeString('Just now');
      else if (hours === 0) setUptimeString(`${minutes} min`);
      else setUptimeString(`${hours}h ${minutes}m`);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Performance mode toggle on body ──
  useEffect(() => {
    document.body.classList.toggle('low-perf-mode', !performanceMode);
  }, [performanceMode]);

  // ── Fetch weather ──
  useEffect(() => {
    let disposed = false;
    let weatherInterval: ReturnType<typeof setInterval> | undefined;

    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const url = lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : '/api/weather';
        const res = await fetch(url);
        const data = await res.json();
        if (disposed) return;
        if (data.temp != null) {
          setWeatherTemp(`${data.temp}°C`);
          setWeatherCity(data.city || '');
          const code = parseInt(data.code);
          if (code === 0) setWeatherIcon('ph-sun');
          else if (code <= 3) setWeatherIcon('ph-cloud-sun');
          else if (code <= 49) setWeatherIcon('ph-cloud-fog');
          else if (code <= 69) setWeatherIcon('ph-cloud-rain');
          else if (code <= 79) setWeatherIcon('ph-cloud-snow');
          else if (code <= 99) setWeatherIcon('ph-cloud-lightning');
          else setWeatherIcon('ph-cloud');
        }
      } catch { /* silently ignore */ }
    };

    const startWeatherRefresh = (lat?: number, lon?: number) => {
      if (disposed) return;
      void fetchWeather(lat, lon);
      weatherInterval = setInterval(() => {
        if (!disposed) void fetchWeather(lat, lon);
      }, 600000);
    };

    // Try browser geolocation for accurate location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          startWeatherRefresh(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Permission denied → fallback to IP-based
          startWeatherRefresh();
        },
        { timeout: 5000 }
      );
    } else {
      startWeatherRefresh();
    }

    return () => {
      disposed = true;
      if (weatherInterval) clearInterval(weatherInterval);
    };
  }, []);

  // ── Load global apps from Firestore (one-time fetch) ──
  // Using getDocs instead of onSnapshot to avoid WebChannel state corruption
  // that causes "INTERNAL ASSERTION FAILED: Unexpected state" during SPA navigation.
  useEffect(() => {
    let mounted = true;
    const fetchGlobalApps = async () => {
      try {
        const q = query(collection(db, 'global_apps'), orderBy('name'));
        const snap = await getDocs(q);
        if (!mounted) return;
        const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() } as KnoblyApp));
        setGlobalApps(apps);
      } catch {
        // Silently ignore Firestore errors (permissions, init, etc.)
      }
    };
    fetchGlobalApps();
    return () => { mounted = false; };
  }, []);

  // ── Load videos from Firestore ──
  useEffect(() => {
    let mounted = true;
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        if (!mounted) return;
        if (!snapshot.empty) {
          const firestoreVids = snapshot.docs.map(doc => {
            const v = doc.data();
            return { id: v.youtube_id, title: v.title, views: v.views || 'Video' };
          });
          // Merge: Firestore videos first, then add any hardcoded VIDEOS not already present
          const existingIds = new Set(firestoreVids.map(v => v.id));
          const merged = [...firestoreVids, ...VIDEOS.filter(v => !existingIds.has(v.id))];
          setMyVideos(merged);
          setCurrentVideo(merged[0]);
        }
      } catch { /* silently ignore permission errors */ }
    };
    fetchVideos();
    return () => { mounted = false; };
  }, []);

  // ── Derived: all apps merged ──
  const allApps = { ...BASE_APPS };
  globalApps.forEach((app) => {
    const cat = app.category || 'Main';
    if (!allApps[cat]) allApps[cat] = [];
    if (!allApps[cat].some((a) => a.id === app.id)) allApps[cat].push(app);
  });
  const allAppsList = Object.values(allApps).flat();

  const hiddenAppsSet = new Set(hiddenApps);

  const filteredApps = (() => {
    const q = searchQuery.toLowerCase();
    const filterVisible = (list: KnoblyApp[]) => list.filter((a) => !hiddenAppsSet.has(a.id));
    if (activeNav === 'apps') {
      const base = appsFilter === 'hidden'
        ? allAppsList.filter((a) => hiddenAppsSet.has(a.id))
        : allAppsList.filter((a) => !hiddenAppsSet.has(a.id));
      return q ? base.filter((a) => a.name.toLowerCase().includes(q)) : base;
    }
    if (activeTab === 'Favourites') {
      return filterVisible(allAppsList.filter((a) => favourites.includes(a.id)));
    }
    const list = allApps[activeTab] || [];
    return q ? filterVisible(list).filter((a) => a.name.toLowerCase().includes(q)) : filterVisible(list);
  })();

  // ── Actions ──
  const handleAppClick = (app: KnoblyApp) => {
    // Intercept Topic Explainer
    if (app.link === '__topic_explainer__') {
      setShowTopicExplainer(true);
      return;
    }
    // Intercept IT Tools — show chapters grid
    if (app.link === '__it_tools__') {
      setShowITToolsChapters(true);
      setShowWebDesignChapters(false);
      return;
    }
    // Intercept Web Design — show chapters grid
    if (app.link === '__web_design__') {
      setShowWebDesignChapters(true);
      setShowITToolsChapters(false);
      return;
    }
    // IT Tools chapter items — Coming Soon ones have no link
    if (app.id.startsWith('it-ch') || app.id === 'it-handwritten') {
      if (!app.link) return; // Coming Soon — do nothing
    }
    // Track recent apps & persist
    setRecentApps(prev => {
      const filtered = prev.filter(a => a.id !== app.id);
      const updated = [app, ...filtered].slice(0, 8);
      localStorage.setItem('knobly-recent-apps', JSON.stringify(updated));
      return updated;
    });
    // Navigate directly
    const link = app.link || (app.id === 'notes' ? '/notes' : '');
    if (link) {
      if (link.startsWith('http')) window.open(link, '_blank');
      else router.push(link);
    }
  };

  const toggleAppVisibility = (app: KnoblyApp) => {
    const key = app.id || app.name;
    const newHidden = hiddenAppsSet.has(key) ? hiddenApps.filter(h => h !== key) : [...hiddenApps, key];
    setHiddenApps(newHidden);
    localStorage.setItem('knobly-hidden', JSON.stringify(newHidden));
  };

  const saveUserName = () => {
    localStorage.setItem('knobly-guest-name', userName);
  };

  const saveNotes = (text: string) => {
    setNotesText(text);
    localStorage.setItem('knobly-notes', text);
  };

  const handleContextMenu = (e: React.MouseEvent, app: KnoblyApp) => {
    e.preventDefault();
    e.stopPropagation();
    setContextApp(app);
    setShowAppContextMenu(true);
    setShowContextMenu(false);
    let x = e.clientX;
    let y = e.clientY;
    if (x + 190 > window.innerWidth) x = window.innerWidth - 195;
    if (y + 200 > window.innerHeight) y = window.innerHeight - 205;
    setAppContextPos({ x, y });
  };

  const handleGlobalRightClick = (e: React.MouseEvent) => {
    // If the right-click is on an app card, don't show global menu
    const target = e.target as HTMLElement;
    if (target.closest('.glass-card') || target.closest('.app-card')) return;
    e.preventDefault();
    setShowContextMenu(true);
    setShowAppContextMenu(false);
    let x = e.clientX;
    let y = e.clientY;
    if (x + 190 > window.innerWidth) x = window.innerWidth - 195;
    if (y + 220 > window.innerHeight) y = window.innerHeight - 225;
    setContextMenuPos({ x, y });
  };

  const closeAllContextMenus = () => {
    setShowContextMenu(false);
    setShowAppContextMenu(false);
  };

  const refreshPage = () => { closeAllContextMenus(); window.location.reload(); };

  const changeWallpaper = () => {
    closeAllContextMenus();
    setActiveNav('settings');
    setActiveSettingsTab('appearance');
  };

  const sortApps = () => {
    closeAllContextMenus();
    // Apps are already sorted by the allApps structure, just trigger a re-render toast
    alert('Apps sorted alphabetically!');
  };

  const addAppToGroup = (targetGroup: string) => {
    if (!contextApp) return;
    closeAllContextMenus();
    // In Next.js version, groups are managed by globalApps type field
    alert(`Moved ${contextApp.name} to ${targetGroup}`);
  };

  const pinToFavourites = () => {
    if (!contextApp) return;
    closeAllContextMenus();
    if (!favourites.includes(contextApp.id)) {
      const newFavs = [...favourites, contextApp.id];
      setFavourites(newFavs);
      localStorage.setItem('knobly-favourites', JSON.stringify(newFavs));
    }
  };

  const removeFromFavourites = () => {
    if (!contextApp) return;
    closeAllContextMenus();
    const newFavs = favourites.filter(f => f !== contextApp.id);
    setFavourites(newFavs);
    localStorage.setItem('knobly-favourites', JSON.stringify(newFavs));
  };

  const renameSoon = () => {
    closeAllContextMenus();
    alert('Rename feature coming soon in a future build of Knobly Web.');
  };

  const isInFavourites = (app: KnoblyApp | null) => {
    if (!app) return false;
    return favourites.includes(app.id);
  };

  // ── Boot Screen ──
  if (!bootChecked) {
    return <div className="h-screen w-screen bg-[#020617]" />;
  }
  if (!booted) {
    return (
      <AnimatePresence>
        <BootScreen onComplete={handleBootComplete} />
      </AnimatePresence>
    );
  }

  return (
    <div
      className={`theme-adaptive wallpaper-${wallpaper} h-screen w-screen overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-6 pt-3 px-3 pb-14 lg:p-6 relative select-none`}
      onClick={closeAllContextMenus}
      onContextMenu={handleGlobalRightClick}
    >

      {/* ══════ GLOBAL CONTEXT MENU ══════ */}
      {showContextMenu && (
        <div
          className="context-menu animate__animated animate__fadeIn animate__faster"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ctx-item cursor-pointer" onClick={refreshPage}>
            <i className="ph-bold ph-arrow-clockwise" /> Refresh System
          </div>
          <div className="ctx-item cursor-pointer" onClick={() => { closeAllContextMenus(); toggleTheme(); }}>
            <i className={`ph-bold ${!isDark ? 'ph-moon-stars' : 'ph-sun'}`} />
            {!isDark ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div className="ctx-separator" />
          <div className="ctx-item cursor-pointer" onClick={changeWallpaper}>
            <i className="ph-bold ph-image" /> Change Wallpaper
          </div>
          <div className="ctx-item cursor-pointer" onClick={sortApps}>
            <i className="ph-bold ph-list-dashes" /> Sort Apps
          </div>
          <div className="ctx-separator" />
          <div
            className="ctx-item cursor-pointer"
            style={{ color: user ? '#ef4444' : '#22d3ee' }}
            onClick={() => {
              closeAllContextMenus();
              if (user) { /* logout handled by auth */ }
              else setShowLoginModal(true);
            }}
          >
            <i className={`ph-bold ${user ? 'ph-sign-out' : 'ph-sign-in'}`} />
            {user ? 'Log Out' : 'Login / Sign Up'}
          </div>
        </div>
      )}

      {/* ══════ APP CONTEXT MENU ══════ */}
      {showAppContextMenu && contextApp && (
        <div
          className="context-menu animate__animated animate__fadeIn animate__faster"
          style={{ top: appContextPos.y, left: appContextPos.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ctx-item cursor-pointer" onClick={() => addAppToGroup('Main')}>
            <i className="ph-bold ph-folder-notch-plus" /> Add to Main
          </div>
          <div className="ctx-item cursor-pointer" onClick={() => addAppToGroup('OLevel')}>
            <i className="ph-bold ph-brackets-angle" /> Add to OLevel
          </div>
          <div className="ctx-item cursor-pointer" onClick={() => addAppToGroup('CCC')}>
            <i className="ph-bold ph-pen-nib" /> Add to CCC
          </div>
          <div className="ctx-separator" />
          {!isInFavourites(contextApp) ? (
            <div className="ctx-item cursor-pointer" onClick={pinToFavourites}>
              <i className="ph-bold ph-push-pin" /> Add to Favourites
            </div>
          ) : (
            <div className="ctx-item cursor-pointer" onClick={removeFromFavourites}>
              <i className="ph-bold ph-x-circle" /> Remove from Favourites
            </div>
          )}
          <div className="ctx-separator" />
          <div className="ctx-item cursor-pointer" onClick={renameSoon}>
            <i className="ph-bold ph-text-t" /> Rename (soon)
          </div>
        </div>
      )}

      {/* ══════ LEFT SIDEBAR (Desktop) ══════ */}
      <aside className="glass-panel w-[70px] shrink-0 h-full rounded-[24px] flex-col items-center justify-between px-4 py-6 z-10 hidden lg:flex">
        <div className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] cursor-pointer hover:scale-110 transition-transform knobly-header-style">
          K.
        </div>

        <div className="flex flex-col gap-4">
          {NAV_ITEMS.map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => { setActiveNav(id); setShowITToolsChapters(false); setShowWebDesignChapters(false); }}
              className={`nav-btn w-11 h-11 rounded-3xl flex items-center justify-center transition-all duration-200 relative border border-transparent active-press ${activeNav === id
                ? 'bg-cyan-500/20 text-cyan-200 shadow-[0_8px_18px_rgba(15,23,42,0.8)] border-cyan-400/70 is-active'
                : 'text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/10'
                }`}
            >
              <i className={`${icon} text-2xl`} />
            </button>
          ))}
        </div>

        <button
          onClick={() => user ? logout() : setShowLoginModal(true)}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/40 active-press"
          title={user ? 'Sign Out' : 'Login'}
        >
          <i className={`ph-bold text-lg ${user ? 'ph-sign-out text-red-400' : 'ph-sign-in text-cyan-400'}`} />
        </button>
      </aside>

      {/* ══════ MAIN PANEL ══════ */}
      <main className="glass-panel flex-1 rounded-[28px] px-4 md:px-6 lg:px-8 py-5 lg:py-6 flex flex-col gap-4 overflow-hidden relative z-10 mb-14 lg:mb-0">

        {/* ── Header ── */}
        <header className="flex flex-col gap-3 shrink-0 border-b border-white/5 pb-3">
          {/* Mobile search (only when on apps tab) */}
          {activeNav === 'apps' && (
            <div className="lg:hidden">
              <div className="search-shell relative rounded-xl flex items-center px-3 py-3">
                <i className="ph-bold ph-magnifying-glass text-gray-500 mr-2 transition-colors text-sm search-shell-icon" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search apps..."
                  className="bg-transparent w-full text-sm text-white focus:outline-none placeholder-gray-400 font-medium" />
              </div>
            </div>
          )}

          {/* Settings/Stats/YouTube header */}
          {(activeNav === 'settings' || activeNav === 'stats' || activeNav === 'youtube') ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div id="knobly-logo" className="text-2xl md:text-3xl knobly-header-style">KNOBLY</div>
                <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.2em]">
                  {activeNav === 'youtube' ? 'YouTube' : activeNav === 'settings' ? 'Settings' : 'System Stats'}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => setShowNotifPanel(p => !p)} className="relative w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all shadow-sm active-press">
                  <i className="ph-bold ph-bell-simple text-xs md:text-sm text-gray-400" />
                  {recentApps.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a0f1e]"></span>}
                </button>
                <button onClick={toggleTheme} className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all shadow-sm active-press">
                  {isDark ? <i className="ph-bold ph-moon-stars text-xs md:text-sm text-cyan-300" /> : <i className="ph-bold ph-sun-dim text-xs md:text-sm text-yellow-500" />}
                </button>
                <button
                  onClick={() => user ? (() => { setActiveNav('settings'); setActiveSettingsTab('profile'); })() : setShowLoginModal(true)}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all shadow-sm active-press overflow-hidden"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <i className={`ph-bold ph-user text-xs md:text-sm ${user ? 'text-cyan-300' : 'text-gray-400'}`} />
                  )}
                </button>
              </div>
            </div>
          ) : activeNav !== 'apps' && (
            /* Home header */
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div id="knobly-logo" className="text-2xl md:text-3xl knobly-header-style">KNOBLY</div>
                  <div className="flex items-center gap-1.5 opacity-70 whitespace-nowrap">
                    <i className="ph-bold ph-calendar-blank text-cyan-400 text-xs" />
                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400">{dateString}</span>
                  </div>
                </div>
                <h1 className="text-xl md:text-2xl font-semibold text-white leading-tight mt-0.5">
                  {greeting},{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {user ? (user.displayName || userName) : (userName || 'Guest')}
                  </span>
                </h1>

                {/* Mobile home clock/weather */}
                {isMobile && activeNav === 'home' && (
                  <div className="flex flex-col gap-2 mt-4 lg:hidden w-full border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="ph-bold ph-clock text-lg text-cyan-400" />
                        <span className="text-2xl font-bold tracking-wide text-white">{currentTime}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <i className={`ph-fill ${weatherIcon} text-lg`} />
                          <span className="text-xl font-bold">{weatherTemp || '--°C'}</span>
                        </div>
                        {weatherCity && <span className="text-[9px] text-gray-500 uppercase tracking-wider">{weatherCity}</span>}
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">System Local</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={() => setShowNotifPanel(p => !p)} className="relative w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all shadow-sm active-press">
                    <i className="ph-bold ph-bell-simple text-xs md:text-sm text-gray-400" />
                    {recentApps.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a0f1e]"></span>}
                  </button>
                  <button onClick={toggleTheme} className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all shadow-sm active-press">
                    {isDark ? <i className="ph-bold ph-moon-stars text-xs md:text-sm text-cyan-300" /> : <i className="ph-bold ph-sun-dim text-xs md:text-sm text-yellow-500" />}
                  </button>
                  <button
                    onClick={() => user ? (() => { setActiveNav('settings'); setActiveSettingsTab('profile'); })() : setShowLoginModal(true)}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/10 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-all shadow-sm active-press overflow-hidden"
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <i className={`ph-bold ph-user text-xs md:text-sm ${user ? 'text-cyan-300' : 'text-gray-400'}`} />
                    )}
                  </button>
                  {/* Desktop search */}
                  <div className="relative w-48 md:w-64 lg:w-80 group hidden md:block">
                    <div className="relative rounded-2xl p-[1px] overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(56,189,248,0.3), rgba(236,72,153,0.3), rgba(139,92,246,0.3))', backgroundSize: '300% 100%', animation: 'gradientSlide 6s linear infinite' }}>
                      <div className="search-shell relative rounded-2xl flex items-center px-4 py-2.5">
                        <i className="ph-bold ph-magnifying-glass mr-3 transition-colors text-sm search-shell-icon" style={{ color: isDark ? '#94a3b8' : '#475569' }} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search system... (Ctrl+K)"
                          className="bg-transparent w-full text-sm focus:outline-none font-medium"
                          style={{ color: isDark ? '#e2e8f0' : '#1e293b' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* ══════ NOTIFICATION PANEL ══════ */}
        {showNotifPanel && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
            <div className={`absolute top-16 right-4 md:right-8 z-50 w-80 max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              style={{ background: isDark ? 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(20,16,50,0.98))' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}>
              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <i className="ph-bold ph-bell-simple text-cyan-500" /> Notifications
                </h3>
                {recentApps.length > 0 && (
                  <button onClick={() => { setRecentApps([]); localStorage.removeItem('knobly-recent-apps'); }}
                    className={`text-[9px] hover:text-red-400 transition-colors uppercase tracking-wider font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Recent Apps Section */}
              {recentApps.length > 0 && (
                <div className="p-3">
                  <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Recent Apps</div>
                  <div className="flex flex-col gap-1">
                    {recentApps.map(app => (
                      <button key={app.id} onClick={() => { handleAppClick(app); setShowNotifPanel(false); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} ${app.color}`}>
                          <i className={`${app.icon} text-sm`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{app.name}</div>
                          <div className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{app.type}</div>
                        </div>
                        <i className={`ph-bold ph-arrow-right text-[10px] group-hover:text-cyan-400 transition-colors ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* System Notifications */}
              <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>System</div>
                <div className={`flex items-start gap-3 px-3 py-2 rounded-xl border ${isDark ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-cyan-50 border-cyan-100'}`}>
                  <i className="ph-fill ph-info text-cyan-500 text-base mt-0.5" />
                  <div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Welcome to Knobly Web!</div>
                    <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Explore courses, practice MCQs, and learn with KnoblyAI assistant.</div>
                  </div>
                </div>
              </div>

              {recentApps.length === 0 && (
                <div className="p-6 text-center">
                  <i className={`ph-bold ph-bell-slash text-2xl mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No recent activity</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Settings Panel ── */}
        {activeNav === 'settings' && (
          <motion.section
            key="settings"
            initial={performanceMode ? { y: 16, opacity: 0.85 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1 mt-1 flex flex-col min-h-0"
          >
            <div className="glass-panel rounded-2xl px-3 md:px-5 py-3 flex flex-col gap-3 border border-white/10 flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2 shrink-0">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">Settings</div>
                  <div className="text-xs md:text-sm text-gray-200">Personalize Knobly Web</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-[0.18em]">Performance</span>
                  <button onClick={() => setPerformanceMode(!performanceMode)}
                    className={`relative w-10 md:w-11 h-5 md:h-6 rounded-full border border-white/20 flex items-center px-0.5 transition-all ${performanceMode ? 'bg-emerald-500/60' : 'bg-slate-700/70'}`}>
                    <span className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-white shadow-md transform transition-transform"
                      style={{ transform: performanceMode ? 'translateX(16px)' : 'translateX(0px)' }} />
                  </button>
                </div>
              </div>

              <div className="mt-2 max-w-xs">
                <div className="search-shell relative rounded-xl flex items-center px-3 py-1.5">
                  <i className="ph-bold ph-magnifying-glass text-gray-500 mr-2 text-xs search-shell-icon" />
                  <input type="text" value={settingsSearch} onChange={(e) => setSettingsSearch(e.target.value)} placeholder="Search settings..."
                    className="bg-transparent w-full text-[11px] text-white focus:outline-none placeholder-gray-400 font-medium" />
                </div>
              </div>

              <div className="flex gap-2 mt-2 border-b border-white/10 pb-1 shrink-0">
                {SETTINGS_TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)}
                    className={`settings-tab-btn flex-1 text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-center active-press ${activeSettingsTab === tab.id ? 'settings-tab-btn-active' : 'border-white/10 text-gray-400'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex-1 overflow-y-auto custom-scroll pr-1 text-xs">
                {/* Profile Tab */}
                {activeSettingsTab === 'profile' && (
                  <div className="flex flex-col gap-3">
                    <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-gray-300">Profile</div>
                    {!user ? (
                      <div className="flex flex-col gap-3 p-4 border border-dashed border-white/20 rounded-xl bg-white/5 text-center">
                        <div className="text-cyan-300 font-bold">You are currently a Guest</div>
                        <p className="text-gray-400">Log in to keep your settings and apps safe.</p>
                        <button onClick={() => setShowLoginModal(true)} className="bg-cyan-500 text-black font-bold py-2 rounded-lg hover:bg-cyan-400">Login / Sign Up</button>
                        <hr className="border-white/10 my-2" />
                        <label className="flex flex-col gap-1 text-left">
                          <span className="uppercase tracking-[0.18em] text-[9px] text-gray-400">Local Guest Name</span>
                          <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" maxLength={20}
                            className="px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                            placeholder="Enter a name to display in greeting" />
                        </label>
                        <button onClick={saveUserName}
                          className="theme-fixed self-start mt-1 px-3 py-1.5 rounded-xl bg-slate-700 text-white text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-slate-600 transition-all">
                          Save Guest Name
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/50">
                            {user.photoURL ? (
                              <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full theme-fixed bg-cyan-900 flex items-center justify-center text-cyan-200 font-bold text-xl">
                                {user.email?.[0]?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white text-sm">{user.displayName || 'User'}
                              <button onClick={() => { setIsEditingName(true); setEditNameVal(user.displayName || ''); }} className="ml-2 text-cyan-400 hover:text-cyan-300 text-xs"><i className="ph-bold ph-pencil-simple" /></button>
                            </div>
                            <div className="text-gray-400 text-xs">{user.email}</div>
                            {user.email && <div className="text-cyan-400 text-[10px] font-mono mt-0.5">@{user.email.split('@')[0]}</div>}
                            {isAdmin && <div className="text-red-400 text-[10px] font-bold uppercase mt-1">Administrator</div>}
                          </div>
                        </div>
                        <div className="bg-emerald-900/10 border border-emerald-500/20 p-2 rounded text-emerald-200 text-xs flex items-center gap-2">
                          <i className="ph-bold ph-cloud-check text-lg" />
                          <span>Your account is active.</span>
                        </div>
                        <button onClick={logout} className="w-full py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg font-bold hover:bg-red-500/20">Sign Out</button>

                        {/* User ID Creation Section */}
                        <div className="mt-4 border border-white/10 rounded-xl p-4 bg-white/5">
                          <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-cyan-400 mb-3 flex items-center gap-2">
                            <i className="ph-bold ph-identification-card" /> User ID & Password
                          </div>
                          {existingUserId ? (
                            <div className="flex flex-col gap-2">
                              <div className="theme-fixed flex items-center gap-2 bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg">
                                <i className="ph-bold ph-check-circle text-emerald-400 text-lg" />
                                <div>
                                  <div className="text-emerald-300 text-xs font-bold">User ID Active</div>
                                  <div className="text-white font-mono text-sm mt-0.5">@{existingUserId}</div>
                                </div>
                              </div>
                              <p className="text-gray-400 text-[10px]">Aap is User ID aur password se bhi login kar sakte ho. Google se bhi login hota rahega.</p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <p className="text-gray-400 text-[10px]">Apna unique User ID aur password banao. Isse aap Google ke alawa bhi login kar sakte ho.</p>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase text-gray-400 tracking-wider font-bold">User ID</label>
                                <div className="flex items-center gap-1 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                                  <span className="text-gray-500 text-xs pl-2.5">@</span>
                                  <input
                                    type="text"
                                    value={userIdInput}
                                    onChange={e => setUserIdInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    className="flex-1 bg-transparent text-sm text-white p-2 focus:outline-none font-mono"
                                    placeholder="my_username"
                                    maxLength={20}
                                    autoComplete="off"
                                  />
                                </div>
                                <span className="text-[9px] text-gray-500">Sirf a-z, 0-9, _ allowed. Min 3 characters.</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase text-gray-400 tracking-wider font-bold">Password</label>
                                <input
                                  type="password"
                                  value={userIdPassword}
                                  onChange={e => setUserIdPassword(e.target.value)}
                                  className="rounded-lg p-2 text-sm bg-black/40 text-white border border-white/10 focus:outline-none focus:border-cyan-400"
                                  placeholder="Min 6 characters"
                                  autoComplete="new-password"
                                />
                              </div>
                              {userIdMsg && (
                                <div className={`text-[10px] p-2 rounded-lg border ${userIdStatus === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                  : userIdStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                  }`}>{userIdMsg}</div>
                              )}
                              <button
                                onClick={async () => {
                                  setUserIdStatus('loading');
                                  setUserIdMsg('Creating User ID...');
                                  try {
                                    await createUserId(userIdInput, userIdPassword);
                                    setUserIdStatus('success');
                                    setUserIdMsg('✅ User ID ban gaya! Ab aap is ID se bhi login kar sakte ho.');
                                    setExistingUserId(userIdInput.trim().toLowerCase());
                                    setUserIdInput('');
                                    setUserIdPassword('');
                                  } catch (err: unknown) {
                                    setUserIdStatus('error');
                                    setUserIdMsg(err instanceof Error ? err.message : 'Error creating User ID');
                                  }
                                }}
                                disabled={userIdStatus === 'loading' || userIdInput.length < 3 || userIdPassword.length < 6}
                                className="w-full py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: '#fff' }}
                              >
                                {userIdStatus === 'loading' ? 'Creating...' : 'Create User ID'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Appearance Tab */}
                {activeSettingsTab === 'appearance' && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Wallpapers</div>
                    <div className="flex items-center gap-3 scroll-x-soft pt-1 pb-1">
                      {WALLPAPER_OPTIONS.map((wp) => (
                        <button key={wp.id} onClick={() => setWallpaper(wp.id)}
                          data-wallpaper-thumb
                          className={`relative flex-shrink-0 w-20 h-12 rounded-xl overflow-hidden border transition-all active-press ${wallpaper === wp.id ? 'border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.6)]' : ''}`}
                          style={{ background: wp.thumbBg, borderColor: wallpaper === wp.id ? undefined : 'rgba(255,255,255,0.1)' }}>
                          <span className="absolute bottom-1 left-1 text-[8px] font-semibold uppercase tracking-[0.16em] drop-shadow" style={{ color: 'rgba(255,255,255,0.9)' }}>{wp.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Choose wallpapers. They auto-adapt for light / dark theme.</p>
                  </div>
                )}

                {/* Apps Tab */}
                {activeSettingsTab === 'apps' && (
                  <div className="flex flex-col gap-4 h-full">
                    {/* Premium Header */}
                    <div className="shrink-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Manage Your Apps</h3>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">{allAppsList.filter(a => !hiddenAppsSet.has(a.id || a.name)).length} visible</span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-bold border border-slate-200">{allAppsList.filter(a => hiddenAppsSet.has(a.id || a.name)).length} hidden</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Control which apps appear on your dashboard.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scroll -mx-1 px-1">
                      {isAdmin && (
                        <div className="mb-5 p-4 rounded-2xl theme-fixed bg-gradient-to-r from-violet-700 to-indigo-700 text-white shadow-lg shadow-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            <span className="font-bold text-sm tracking-wide">Admin Panel</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {globalApps.map((app) => (
                              <div key={app.id} className="flex justify-between items-center bg-white/15 backdrop-blur-sm px-3 py-2 rounded-xl">
                                <span className="font-semibold text-sm text-white/95">{app.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grouped App Sections */}
                      {Object.entries(allApps).map(([category, apps]) => (
                        <div key={category} className="mb-6">
                          {/* Category Label */}
                          <div className="flex items-center gap-2 mb-3 px-1">
                            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />
                            <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-500">{category === 'OLevel' ? 'O-Level Modules' : category === 'CCC' ? 'CCC Course' : 'Main Apps'}</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                          </div>
                          
                          {/* App Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {(apps as typeof allAppsList).map((app) => {
                              const isHidden = hiddenAppsSet.has(app.id || app.name);
                              return (
                                <div key={'manage-' + (app.id || app.name)}
                                     className={`group relative flex flex-col items-center p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${isHidden ? 'bg-slate-50/80 border-slate-200/50 opacity-55 hover:opacity-85' : 'bg-white border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-slate-300'}`}
                                     onClick={() => toggleAppVisibility(app)}>
                                  
                                  {/* Icon — same style as real dashboard AppCard */}
                                  <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-black/40 shadow-inner border backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.08] app-icon-accent-cyan ${app.borderClass} ${isHidden ? 'grayscale opacity-50' : ''}`}>
                                    <i className={`${app.icon} devicon-fix ${app.color} text-2xl`} />
                                  </div>
                                  
                                  {/* App Name & Type */}
                                  <h4 className={`font-bold text-sm mt-3 truncate w-full text-center transition-colors ${isHidden ? 'text-slate-400' : 'text-slate-800'}`}>{app.name}</h4>
                                  <span className={`text-[11px] font-medium mt-0.5 transition-colors ${isHidden ? 'text-slate-300' : 'text-slate-400'}`}>{app.type}</span>
                                  
                                  {/* Toggle */}
                                  <div className={`mt-3 relative w-[44px] h-[26px] rounded-full shrink-0 transition-all duration-300 ${isHidden ? 'bg-slate-200' : 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_2px_10px_rgba(16,185,129,0.4)]'}`}>
                                    <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isHidden ? 'left-[3px]' : 'left-[19px]'}`} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── Stats Panel ── */}
        {activeNav === 'stats' && (
          <motion.section
            key="stats"
            initial={performanceMode ? { y: 16, opacity: 0.85 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1 mt-1 flex flex-col"
          >
            <div className="glass-panel rounded-2xl px-3 md:px-5 py-4 flex flex-col gap-4 border border-white/10 flex-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">System Stats</div>
                  <div className="text-xs md:text-sm text-gray-200">Overview of your Knobly Web usage</div>
                </div>
                <div className="text-right text-[10px] text-gray-400 uppercase tracking-[0.18em]">
                  Uptime<br />
                  <span className="text-cyan-400 text-[11px]">{uptimeString}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mt-1">
                <div className="glass-card rounded-2xl flex flex-col gap-1.5 px-3 py-3 md:px-4 md:py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Total Apps</span>
                    <i className="ph-bold ph-squares-four text-cyan-400 text-sm" />
                  </div>
                  <div className="text-xl font-bold text-white">{allAppsList.length}</div>
                </div>
                <div className="glass-card rounded-2xl flex flex-col gap-1.5 px-3 py-3 md:px-4 md:py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Favourites</span>
                    <i className="ph-bold ph-star text-yellow-400 text-sm" />
                  </div>
                  <div className="text-xl font-bold text-white">{favourites.length}</div>
                </div>
                <div className="glass-card rounded-2xl flex flex-col gap-1.5 px-3 py-3 md:px-4 md:py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Hidden</span>
                    <i className="ph-bold ph-eye-slash text-red-400 text-sm" />
                  </div>
                  <div className="text-xl font-bold text-white">{hiddenApps.length}</div>
                </div>
                <div className="glass-card rounded-2xl flex flex-col gap-1.5 px-3 py-3 md:px-4 md:py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Performance</span>
                    <i className="ph-bold ph-rocket-launch text-emerald-400 text-sm" />
                  </div>
                  <div className="text-xs font-semibold text-gray-200">{performanceMode ? 'High visuals' : 'Battery saver'}</div>
                </div>
                <div className="glass-card rounded-2xl flex flex-col gap-1.5 col-span-2 md:col-span-2 px-3 py-3 md:px-4 md:py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Theme</span>
                    <i className={`ph-bold ${isDark ? 'ph-moon-stars text-cyan-300' : 'ph-sun text-yellow-400'}`} />
                  </div>
                  <div className="text-xs font-semibold text-gray-200">{isDark ? 'Dark mode' : 'Light mode'} • Wallpaper: {wallpaper}</div>
                </div>
              </div>

              {/* Recent Apps */}
              <div className="stats-recent-list mt-2 overflow-y-auto custom-scroll pr-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-2">Recent Apps</div>
                {recentApps.length === 0 ? (
                  <div className="text-[11px] text-gray-500">Launch some apps to see them here.</div>
                ) : (
                  <div className="flex flex-col gap-1.5 text-[11px]">
                    {recentApps.map((app) => (
                      <div key={'recent-' + (app.id || app.name)} className="flex items-center justify-between py-1 px-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
                            <i className={`${app.icon} text-sm ${app.color}`} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-100">{app.name}</div>
                            <div className="text-[9px] uppercase tracking-[0.16em] text-gray-400">{app.type}</div>
                          </div>
                        </div>
                        <button className="text-[9px] px-2 py-1 rounded-full border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 active:scale-95 transition-all"
                          onClick={() => handleAppClick(app)}>
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── YouTube Panel ── */}
        {activeNav === 'youtube' && (
          <motion.section
            key="youtube"
            initial={performanceMode ? { y: 16, opacity: 0.85 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1 mt-1 flex flex-col overflow-hidden"
          >
            <div className="glass-panel w-full rounded-[28px] flex-1 p-0 flex flex-col min-h-0 overflow-hidden mb-3">
              <div className="p-4 pb-2 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-gaming)' }}>MY CONTENT</h3>
                <div className="flex items-center gap-2 bg-red-600/10 px-2 py-0.5 rounded border border-red-600/30">
                  <i className="ph-fill ph-youtube-logo text-red-500 text-xs" />
                  <span className="text-[9px] font-bold text-red-400 tracking-wider">PLAYER</span>
                </div>
              </div>
              <div className="w-full aspect-video bg-black">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0`}
                  title="YouTube video player" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="flex flex-col flex-1 custom-scroll p-2 gap-2 bg-black/20 overflow-y-auto">
                {myVideos.map((video) => (
                  <div key={video.id} onClick={() => setCurrentVideo(video)}
                    className={`video-item p-2 rounded-lg cursor-pointer flex items-start gap-3 active-press ${currentVideo.id === video.id ? 'video-active' : ''}`}>
                    <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden shrink-0 relative group">
                      <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center theme-fixed bg-black/70 group-hover:bg-black/50">
                        <i className="ph-fill ph-play text-white text-xs" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-semibold text-gray-200 leading-tight line-clamp-2">{video.title}</h4>
                      <p className="text-[9px] text-gray-500 mt-1">{video.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <a href="https://youtube.com/@knobly1" target="_blank" rel="noopener noreferrer"
              className="glass-panel w-full yt-cta rounded-[22px] p-3 flex items-center justify-between group transition-all shrink-0 hover:bg-red-500/5 active-press">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full theme-fixed bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <i className="ph-fill ph-youtube-logo text-lg" />
                </div>
                <div className="font-bold text-[11px] text-gray-200">Knobly Web</div>
              </div>
              <div className="yt-cta-join text-[9px] font-bold">JOIN</div>
            </a>
          </motion.section>
        )}

        {/* ── Home / Apps Content ── */}
        {(activeNav === 'home' || activeNav === 'apps') && (
          <motion.div
            key={`nav-${activeNav}`}
            initial={performanceMode ? { y: 16, opacity: 0.85 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Tabs (home only) */}
            {activeNav === 'home' && !searchQuery && (
              <nav className="flex gap-3 md:gap-4 shrink-0 justify-center pt-2">
                {TABS.map((tab) => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setShowITToolsChapters(false); setShowWebDesignChapters(false); }}
                    className={`tab-btn pb-1.5 text-[10px] md:text-[11px] font-bold tracking-wide uppercase transition-all relative px-3 md:px-5 active-press ${activeTab === tab ? 'tab-btn-active' : 'text-gray-500 hover:text-white'}`}>
                    {tab}
                  </button>
                ))}
              </nav>
            )}

            {/* Apps filter (apps nav only) */}
            {activeNav === 'apps' && (
              <nav className="flex gap-4 shrink-0 pt-2 border-b border-white/10 pb-1 justify-between items-center">
                <div className="flex gap-4">
                  <button onClick={() => setAppsFilter('all')}
                    className={`apps-filter-btn text-[10px] md:text-[11px] font-bold tracking-[0.18em] uppercase active-press ${appsFilter === 'all' ? 'apps-filter-btn-active' : 'text-gray-500 hover:text-white'}`}>
                    All Apps
                  </button>
                  <button onClick={() => setAppsFilter('hidden')}
                    className={`apps-filter-btn text-[10px] md:text-[11px] font-bold tracking-[0.18em] uppercase active-press ${appsFilter === 'hidden' ? 'apps-filter-btn-active' : 'text-gray-500 hover:text-white'}`}>
                    Hidden / Disabled
                  </button>
                </div>
                {user && (
                  <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <i className="ph-bold ph-plus-circle text-lg" /> Add
                  </button>
                )}
              </nav>
            )}

            {/* App Grid */}
            <div className="flex-1 pt-4 overflow-y-auto custom-scroll pr-1 relative overflow-x-hidden">
              {showITToolsChapters ? (
                /* ── IT Tools Chapters Sub-Grid ── */
                <motion.div
                  key="it-tools-chapters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Back header */}
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <button
                      onClick={() => setShowITToolsChapters(false)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-300 hover:bg-white/10 transition-all active-press"
                    >
                      <i className="ph-bold ph-arrow-left text-sm" />
                    </button>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <i className="ph-bold ph-desktop text-sky-400" /> IT Tools
                      </div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-[0.16em]">Module 1 · M1-R5 · 9 Chapters</div>
                    </div>
                  </div>
                  <AppGrid
                    apps={IT_TOOLS_CHAPTERS}
                    favourites={favourites}
                    activeNav={activeNav}
                    performanceMode={performanceMode}
                    onAppClick={handleAppClick}
                    onAppContextMenu={handleContextMenu}
                  />
                </motion.div>
              ) : showWebDesignChapters ? (
                /* ── Web Design Chapters Sub-Grid ── */
                <motion.div
                  key="web-design-chapters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Back header */}
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <button
                      onClick={() => setShowWebDesignChapters(false)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-300 hover:bg-white/10 transition-all active-press"
                    >
                      <i className="ph-bold ph-arrow-left text-sm" />
                    </button>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <i className="ph-bold ph-paint-brush text-pink-400" /> Web Design
                      </div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-[0.16em]">Module 2 · M2-R5 · Web Technologies</div>
                    </div>
                  </div>
                  <AppGrid
                    apps={WEB_DESIGN_CHAPTERS}
                    favourites={favourites}
                    activeNav={activeNav}
                    performanceMode={performanceMode}
                    onAppClick={handleAppClick}
                    onAppContextMenu={handleContextMenu}
                  />
                </motion.div>
              ) : (
                /* ── Normal App Grid ── */
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`tab-${activeTab}-${activeNav}`}
                      initial={performanceMode ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      exit={performanceMode ? { opacity: 0 } : undefined}
                      transition={{ duration: 0.15 }}
                    >
                      <AppGrid
                        apps={filteredApps}
                        favourites={favourites}
                        activeNav={activeNav}
                        performanceMode={performanceMode}
                        onAppClick={handleAppClick}
                        onAppContextMenu={handleContextMenu}
                      />
                    </motion.div>
                  </AnimatePresence>
                  {activeTab === 'Favourites' && !searchQuery && favourites.length === 0 && activeNav !== 'apps' && (
                    <div className="col-span-3 sm:col-span-4 lg:col-span-5 flex flex-col items-center justify-center py-6 text-center text-gray-500 text-xs">
                      <i className="ph-bold ph-push-pin text-2xl mb-2 text-cyan-400/70" />
                      <p className="uppercase tracking-[0.18em] text-[9px]">Right-click any app &amp; choose &quot;Add to favourites&quot;</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* ══════ RIGHT SIDEBAR (Desktop XL) ══════ */}
      <aside className="hidden xl:flex w-[320px] min-w-[320px] max-w-[320px] flex-col gap-4 h-full z-10 shrink-0">
        {/* Clock/Weather — Premium Card */}
        <div className="w-full rounded-[28px] overflow-hidden shrink-0 relative" style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0c4a6e 100%)'
            : 'linear-gradient(to right, #ffffff 0%, #e0f2fe 40%, #7dd3fc 100%)',
          boxShadow: isDark
            ? '0 8px 32px rgba(14,165,233,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 20px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}>
          {/* Decorative clouds */}
          <div className="absolute top-2 right-8 opacity-20"><i className="ph-fill ph-cloud text-5xl text-white" /></div>
          <div className="absolute bottom-4 left-4 opacity-10"><i className="ph-fill ph-cloud text-4xl text-white" /></div>
          <div className="absolute top-6 right-24 opacity-15"><i className="ph-fill ph-cloud text-3xl text-white" /></div>

          <div className="relative p-5 flex items-center justify-between">
            {/* Left: Clock */}
            <div>
              <div className="text-4xl font-black tracking-tight leading-none mb-1" style={{ color: isDark ? '#fff' : '#1e1b4b', textShadow: isDark ? '0 2px 12px rgba(99,102,241,0.4)' : 'none' }}>{currentTime}</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: isDark ? '#a5b4fc' : '#4338ca' }}>System Local</div>
            </div>

            {/* Right: Weather */}
            <div className="text-right flex flex-col items-end gap-1">
              <div className="relative">
                <i className={`ph-fill ${weatherIcon} text-4xl animate-float`} style={{ color: isDark ? '#fbbf24' : '#f59e0b', filter: 'drop-shadow(0 2px 8px rgba(251,191,36,0.4))' }} />
              </div>
              <div className="text-2xl font-black tracking-tight" style={{ color: isDark ? '#fff' : '#1e1b4b' }}>{weatherTemp || '--°C'}</div>
              {weatherCity && <div className="text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(30,27,75,0.1)', color: isDark ? '#c7d2fe' : '#4338ca' }}>{weatherCity}</div>}
            </div>
          </div>
        </div>

        {/* YouTube Player */}
        <div className="glass-panel w-full rounded-[28px] flex-1 p-0 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 pb-2 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-gaming)' }}>MY CONTENT</h3>
            <div className="flex items-center gap-2 bg-red-600/10 px-2 py-0.5 rounded border border-red-600/30">
              <i className="ph-fill ph-youtube-logo text-red-500 text-xs" />
              <span className="text-[9px] font-bold text-red-400 tracking-wider">PLAYER</span>
            </div>
          </div>
          <div className="w-full aspect-video bg-black">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0`}
              title="YouTube video" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="flex flex-col flex-1 custom-scroll p-2 gap-2 bg-black/20 overflow-y-auto">
            {myVideos.map((video) => (
              <div key={video.id} onClick={() => setCurrentVideo(video)}
                className={`video-item p-2 rounded-lg cursor-pointer flex items-start gap-3 active-press ${currentVideo.id === video.id ? 'video-active' : ''}`}>
                <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden shrink-0 relative group">
                  <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center theme-fixed bg-black/70 group-hover:bg-black/50">
                    <i className="ph-fill ph-play text-white text-xs" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-semibold text-gray-200 leading-tight line-clamp-2">{video.title}</h4>
                  <p className="text-[9px] text-gray-500 mt-1">{video.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KnoblyAI CTA */}
        <div
          onClick={() => {
            window.dispatchEvent(new Event('toggle-knobly-ai'));
          }}
          className="glass-panel w-full rounded-[22px] p-3 flex items-center justify-between group transition-all shrink-0 hover:bg-purple-500/5 active-press cursor-pointer"
          style={{ borderColor: 'rgba(139,92,246,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
              <svg viewBox="0 0 40 40" width="20" height="20">
                <defs>
                  <radialGradient id="sidebarOrb" cx="40%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
                <circle cx="20" cy="20" r="8" fill="url(#sidebarOrb)" />
                <circle cx="20" cy="20" r="3" fill="white" opacity="0.95" />
              </svg>
            </div>
            <div className="font-bold text-[11px] text-gray-200">KnoblyAI</div>
          </div>
          <div className="text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.15))', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
            ASK
          </div>
        </div>
      </aside>

      {/* ══════ MOBILE BOTTOM DOCK ══════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-30">
        <div className="mobile-dock flex items-center justify-around px-4 py-2.5">
          <button onClick={() => setActiveNav('home')}
            className={`nav-btn flex items-center justify-center w-9 h-9 rounded-2xl border border-transparent transition-all active-press ${activeNav === 'home' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70 is-active' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'}`}>
            <i className="ph-bold ph-house text-lg" />
          </button>
          <button onClick={() => setActiveNav('apps')}
            className={`nav-btn flex items-center justify-center w-9 h-9 rounded-2xl border border-transparent transition-all active-press ${activeNav === 'apps' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70 is-active' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'}`}>
            <i className="ph-bold ph-squares-four text-lg" />
          </button>
          <button onClick={() => setActiveNav('youtube')}
            className={`nav-btn flex items-center justify-center w-9 h-9 rounded-2xl border border-transparent transition-all active-press ${activeNav === 'youtube' ? 'bg-red-500/20 text-red-400 border-red-500/60 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'text-gray-400 hover:text-red-400 hover:bg-white/5 hover:border-white/20'}`}>
            <i className="ph-fill ph-youtube-logo text-lg" />
          </button>
          <button onClick={() => setActiveNav('stats')}
            className={`nav-btn flex items-center justify-center w-9 h-9 rounded-2xl border border-transparent transition-all active-press ${activeNav === 'stats' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70 is-active' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'}`}>
            <i className="ph-bold ph-chart-bar text-lg" />
          </button>
          <button onClick={() => setActiveNav('settings')}
            className={`nav-btn flex items-center justify-center w-9 h-9 rounded-2xl border border-transparent transition-all active-press ${activeNav === 'settings' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70 is-active' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'}`}>
            <i className="ph-bold ph-gear text-lg" />
          </button>
        </div>
      </nav>

      {/* ══════ MODALS ══════ */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* ══════ TOPIC EXPLAINER MODAL ══════ */}
      <AnimatePresence>
        {showTopicExplainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="theme-fixed absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowTopicExplainer(false)} />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="pointer-events-auto relative w-[92%] max-w-md z-50 rounded-3xl overflow-hidden"
              style={{
                background: isDark
                  ? 'linear-gradient(145deg, rgba(15,10,30,0.97), rgba(20,16,50,0.97))'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,243,255,0.98))',
                border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.15)'}`,
                boxShadow: isDark
                  ? '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 24px 60px rgba(0,0,0,0.15), 0 0 30px rgba(139,92,246,0.08)',
              }}
            >
              {/* Animated top bar */}
              <div style={{
                height: 3,
                background: 'linear-gradient(90deg, #8b5cf6, #38bdf8, #ec4899, #8b5cf6)',
                backgroundSize: '300% 100%',
                animation: 'gradientSlide 4s linear infinite',
              }} />

              {/* Header */}
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(217,70,239,0.2), rgba(168,85,247,0.15))'
                        : 'linear-gradient(135deg, rgba(217,70,239,0.1), rgba(168,85,247,0.08))',
                      border: `1px solid ${isDark ? 'rgba(217,70,239,0.3)' : 'rgba(217,70,239,0.2)'}`,
                      boxShadow: '0 0 20px rgba(217,70,239,0.15)',
                    }}
                  >
                    <i className="ph-duotone ph-magic-wand text-xl" style={{ color: '#e879f9' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                      Topic Explainer
                    </h3>
                    <p className="text-[10px] font-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                      AI-powered detailed explanation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTopicExplainer(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    color: isDark ? '#9ca3af' : '#6b7280',
                  }}
                >
                  <i className="ph-bold ph-x text-sm" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-6 flex flex-col gap-4">
                {/* Subject (Optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    Subject <span style={{ color: isDark ? '#94a3b8' : '#475569', fontWeight: 500, textTransform: 'none' }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={teSubject}
                    onChange={(e) => setTeSubject(e.target.value)}
                    placeholder="e.g. Python, Computer Science, Physics..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none transition-all"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      color: isDark ? '#e2e8f0' : '#1e293b',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                {/* Topic (Required) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    Topic <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={teTopic}
                    onChange={(e) => setTeTopic(e.target.value)}
                    placeholder="e.g. What is a Tuple, CPU Architecture..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none transition-all"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      color: isDark ? '#e2e8f0' : '#1e293b',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && teTopic.trim()) {
                        const fullTopic = teSubject.trim() ? `${teTopic.trim()} (${teSubject.trim()})` : teTopic.trim();
                        const slug = fullTopic.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').slice(0, 80);
                        setShowTopicExplainer(false);
                        router.push(`/ai/topic/${slug}?lang=${teLang}`);
                        setTeTopic('');
                        setTeSubject('');
                      }
                    }}
                  />
                </div>

                {/* Language Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    Language
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'hi' as const, label: 'हिंदी', sub: 'Hindi' },
                      { id: 'en' as const, label: 'English', sub: 'English' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setTeLang(l.id)}
                        className="flex-1 rounded-xl px-3 py-2.5 text-center transition-all"
                        style={{
                          background: teLang === l.id
                            ? (isDark ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.12))' : 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(56,189,248,0.08))')
                            : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                          border: `1.5px solid ${teLang === l.id ? '#8b5cf6' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')}`,
                          boxShadow: teLang === l.id ? '0 0 12px rgba(139,92,246,0.15)' : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="text-sm font-bold" style={{ color: teLang === l.id ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? '#94a3b8' : '#64748b') }}>
                          {l.label}
                        </div>
                        <div className="text-[9px] font-medium mt-0.5" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                          {l.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => {
                    if (!teTopic.trim()) return;
                    const fullTopic = teSubject.trim() ? `${teTopic.trim()} (${teSubject.trim()})` : teTopic.trim();
                    const slug = fullTopic.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').slice(0, 80);
                    setShowTopicExplainer(false);
                    router.push(`/ai/topic/${slug}?lang=${teLang}`);
                    setTeTopic('');
                    setTeSubject('');
                  }}
                  disabled={!teTopic.trim()}
                  className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all relative overflow-hidden group"
                  style={{
                    background: teTopic.trim()
                      ? 'linear-gradient(135deg, #8b5cf6, #6366f1, #38bdf8)'
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    color: teTopic.trim() ? '#fff' : (isDark ? '#94a3b8' : '#475569'),
                    cursor: teTopic.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: teTopic.trim() ? '0 8px 30px rgba(139,92,246,0.3), 0 0 20px rgba(56,189,248,0.15)' : 'none',
                    border: 'none',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <i className="ph-bold ph-sparkle" />
                    Explain with AI
                  </span>
                </button>

                {/* Privacy note */}
                <p className="text-[9px] text-center font-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                  Powered by KnoblyAI • Sarvam + Groq Engine
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ══════ NOTES MODAL ══════ */}
      {showNotesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="theme-fixed absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowNotesModal(false)} />
          <div className="theme-panel pointer-events-auto relative w-[90%] max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Quick Notes</h3>
              <button onClick={() => setShowNotesModal(false)} className="text-gray-400 hover:text-white"><i className="ph-bold ph-x text-xl" /></button>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => saveNotes(e.target.value)}
              className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-cyan-400 placeholder-gray-500"
              placeholder="Write your notes here..."
            />
            <div className="text-[9px] text-emerald-400 mt-2 uppercase tracking-[0.16em]">● Saved locally</div>
          </div>
        </div>
      )}
    </div>
  );
}
