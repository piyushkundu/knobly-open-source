"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NewsLoader from "./NewsLoader";

interface NewsItem {
  title_en: string;
  title_hi: string;
  category: string;
  explanation_en: string;
  explanation_hi: string;
  source: string;
  url: string;
  image: string | null;
  publishedAt: string;
}

interface NewsData {
  date: string;
  daily_summary_en?: string;
  daily_summary_hi?: string;
  newsList: NewsItem[];
}

const CAT: Record<string, { color: string; bg: string; border: string; accent: string; icon: string; label: string }> = {
  tech:   { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", accent: "#2563eb", icon: "◈", label: "Tech"   },
  india:  { color: "#b45309", bg: "#fffbeb", border: "#fde68a", accent: "#d97706", icon: "◉", label: "India"  },
  world:  { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", accent: "#8b5cf6", icon: "◎", label: "World"  },
  sports: { color: "#047857", bg: "#ecfdf5", border: "#a7f3d0", accent: "#059669", icon: "◆", label: "Sports" },
};
const getCat = (c: string) =>
  CAT[c?.trim().toLowerCase()] ?? { color: "#374151", bg: "#f9fafb", border: "#e5e7eb", accent: "#6b7280", icon: "◇", label: c };

export default function TechNewsCard() {
  const [data,    setData]    = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [lang,    setLang]    = useState<"en" | "hi">("en");
  const [modal,   setModal]   = useState<number | null>(null);

  const fetchNews = async () => {
    setLoading(true); setError(null);
    try {
      const res    = await fetch(`/api/tech-news?t=${Date.now()}`);
      const result = await res.json();
      if (!result.success || !result.data) throw new Error(result.error || "Failed to load news");
      setData(result.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  /* LOADING */
  if (loading && !data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf8" }}>
      <NewsLoader />
    </div>
  );

  /* ERROR */
  if (error && !data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf8", fontFamily: "'Playfair Display', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');`}</style>
      <div style={{ textAlign: "center", maxWidth: 420, padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#e63946" }}>✦</div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: ".5rem", color: "#111" }}>Something went wrong</h2>
        <p style={{ color: "#888", marginBottom: "2rem" }}>{error}</p>
        <button onClick={fetchNews} style={{ padding: ".8rem 2.5rem", background: "#111", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: ".08em", fontSize: ".9rem" }}>
          RETRY
        </button>
      </div>
    </div>
  );

  if (!data?.newsList) return null;

  const featured = data.newsList[0];
  const rest     = data.newsList.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .kw-root {
          background: #fafaf8;
          min-height: 100vh;
          font-family: 'Newsreader', 'Noto Sans Devanagari', Georgia, serif;
          color: #111;
        }

        /* ─── HEADER ─────────────────────────────── */
        .kw-header {
          background: #fff;
          border-bottom: 3px solid #111;
          z-index: 200;
        }
        .kw-header-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: .65rem 2.5rem;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .kw-home-btn {
          display: flex; align-items: center; justify-content: center; gap: .4rem;
          padding: .4rem .9rem; border-radius: 4px; border: 1.5px solid #111;
          background: transparent; color: #111; text-decoration: none;
          font-family: 'Newsreader', serif; font-size: .65rem; font-weight: 800;
          letter-spacing: .15em; text-transform: uppercase; cursor: pointer;
          transition: all .2s ease;
        }
        .kw-home-btn:hover {
          background: #111; color: #fff;
          transform: translateY(-2px);
          box-shadow: 2px 2px 0 #e63946;
        }

        .kw-meta { font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; color: #888; display: flex; align-items: center; gap: 1.5rem; }

        .kw-header-brand {
          display: flex; flex-direction: column; align-items: center;
          padding: .9rem 2.5rem .75rem; gap: .25rem;
        }
        .kw-brand-eyebrow {
          font-family: 'Newsreader', serif;
          font-size: .6rem; letter-spacing: .35em; text-transform: uppercase; color: #bbb;
        }
        .kw-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5.5vw, 3.6rem);
          font-weight: 900; letter-spacing: -.01em; color: #111; line-height: 1;
          display: flex; align-items: center; gap: .1em;
        }
        .kw-logo-dot {
          display: inline-block; width: 10px; height: 10px; border-radius: 50%;
          background: #e63946; flex-shrink: 0; margin: 0 1px 6px;
        }
        .kw-logo-sub {
          font-size: .6rem; letter-spacing: .3em; text-transform: uppercase; color: #ccc;
        }

        .kw-header-nav {
          display: flex; align-items: center; justify-content: center;
          padding: .5rem 2.5rem;
          border-top: 1px solid #e5e5e5;
          gap: 0; flex-wrap: wrap;
        }
        .kw-nav-btn {
          font-family: 'Newsreader', serif;
          font-size: .67rem; font-weight: 500; letter-spacing: .2em; text-transform: uppercase;
          color: #555; padding: .35rem 1.1rem; border: none; background: transparent; cursor: pointer;
          transition: color .2s;
        }
        .kw-nav-btn:hover { color: #111; }
        .kw-nav-sep { color: #ddd; line-height: 1; font-size: .9rem; }

        .kw-controls { display: flex; align-items: center; gap: .6rem; }
        .kw-lang-btn {
          padding: .3rem .9rem; font-size: .65rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          cursor: pointer; transition: all .2s; font-family: 'Newsreader', serif;
          border: 1.5px solid #ddd; background: transparent; color: #777;
          border-radius: 2px;
        }
        .kw-lang-btn.active { background: #111; color: #fff; border-color: #111; }
        .kw-refresh {
          width: 34px; height: 34px; border-radius: 2px;
          border: 1.5px solid #ddd; background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center; color: #777;
          transition: all .2s;
        }
        .kw-refresh:hover { background: #111; color: #fff; border-color: #111; }
        .spin { animation: _spin 1s linear infinite; }
        @keyframes _spin { to { transform: rotate(360deg); } }

        /* ─── DATELINE ───────────────────────────── */
        .kw-dateline {
          text-align: center; padding: .8rem 1rem;
          font-size: .67rem; letter-spacing: .22em; text-transform: uppercase; color: #555;
          border-bottom: 1px solid #d0d0cc; background: #f7f5f0;
          font-weight: 500;
        }

        /* ─── MAIN ───────────────────────────────── */
        .kw-main { max-width: 1300px; margin: 0 auto; padding: 3rem 2.5rem 6rem; }

        /* ─── SECTION HEADER ─────────────────────── */
        .kw-sh {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
        }
        .kw-sh-line { flex: 1; height: 2px; background: #111; }
        .kw-sh-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .12em; color: #111; white-space: nowrap;
        }
        .kw-sh-count {
          font-size: .65rem; letter-spacing: .18em; color: #666; text-transform: uppercase;
          white-space: nowrap; font-weight: 600;
        }

        /* ─── FEATURED ───────────────────────────── */
        .kw-featured {
          display: grid; grid-template-columns: 1fr 1fr;
          border: 2px solid #111; margin-bottom: 4rem;
          background: #fff; overflow: hidden; cursor: pointer;
          transition: box-shadow .35s, transform .3s;
        }
        .kw-featured:hover { box-shadow: 10px 10px 0 #111; transform: translate(-3px,-3px); }
        @media (max-width: 768px) { .kw-featured { grid-template-columns: 1fr; } }

        .kw-feat-img {
          position: relative; overflow: hidden; min-height: 440px;
        }
        .kw-feat-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 2s ease; }
        .kw-featured:hover .kw-feat-img img { transform: scale(1.04); }
        .kw-feat-no-img {
          width: 100%; height: 100%; min-height: 440px;
          background: #f5f5f0; display: flex; align-items: center; justify-content: center;
          font-size: 6rem; color: #ccc;
        }

        .kw-feat-body {
          padding: 2.75rem 3rem;
          display: flex; flex-direction: column; justify-content: space-between;
          border-left: 2px solid #111;
          background: #fff;
        }

        .kw-issue-row { display: flex; align-items: flex-start; gap: .85rem; margin-bottom: 1.6rem; }
        .kw-issue-num {
          font-family: 'Playfair Display', serif;
          font-size: 5.5rem; font-weight: 900; line-height: .85;
          color: #f0f0ec; -webkit-text-stroke: 2.5px #222; flex-shrink: 0;
        }
        .kw-issue-stack { display: flex; flex-direction: column; gap: .35rem; padding-top: .5rem; }

        .kw-cat-pill {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .3rem .85rem; border-radius: 3px;
          font-size: .62rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase;
          font-family: 'Newsreader', serif;
        }
        .kw-cat-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .kw-feat-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.55rem, 3vw, 2.35rem); font-weight: 700; line-height: 1.22;
          color: #0a0a0a; margin-bottom: 1.15rem;
          letter-spacing: -.01em;
        }
        .kw-feat-title.hi { font-family: 'Noto Sans Devanagari', serif; }

        .kw-rule { width: 40px; height: 3px; background: #111; margin-bottom: 1.15rem; }

        .kw-feat-desc {
          font-size: 1.05rem; line-height: 1.85; color: #2a2a2a; font-style: italic; flex: 1;
          font-weight: 400;
        }
        .kw-feat-desc.hi { font-family: 'Noto Sans Devanagari', sans-serif; font-style: normal; font-size: 1rem; color: #1a1a1a; }

        .kw-feat-foot {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 2rem; padding-top: 1.35rem;
          border-top: 1.5px solid #ddd; gap: 1rem; flex-wrap: wrap;
        }

        /* ─── GRID ───────────────────────────────── */
        .kw-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) { .kw-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  { .kw-grid { grid-template-columns: 1fr; } }

        /* ─── CARD ───────────────────────────────── */
        .kw-card {
          background: #fff;
          border: 2px solid #ddd;
          cursor: pointer; position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          transition: border-color .25s, transform .3s, box-shadow .3s;
          border-radius: 4px;
        }
        .kw-card:hover {
          border-color: #111;
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,.1), 6px 6px 0 #111;
        }

        .kw-rank-badge {
          position: absolute; top: 0; right: 0; z-index: 5;
          width: 46px; height: 46px; background: #111;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 900; color: #fff;
          border-bottom-left-radius: 4px;
        }

        .kw-card-img {
          width: 100%; aspect-ratio: 16/9; overflow: hidden; position: relative;
          border-bottom: 2px solid #eee; flex-shrink: 0;
        }
        .kw-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1.5s ease; }
        .kw-card:hover .kw-card-img img { transform: scale(1.06); }
        .kw-card:hover .kw-card-img { border-color: #111; }
        .kw-card-no-img {
          width: 100%; height: 100%; background: #f5f5f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.8rem; color: #ccc;
        }
        .kw-img-shade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
          background: linear-gradient(to top, rgba(0,0,0,.12), transparent);
        }

        .kw-card-body { padding: 1.5rem 1.6rem 1.6rem; flex: 1; display: flex; flex-direction: column; }
        .kw-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: .9rem; }

        .kw-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.08rem; font-weight: 700; line-height: 1.35; color: #0a0a0a;
          margin-bottom: .8rem; flex: 1; letter-spacing: -.005em;
        }
        .kw-card-title.hi { font-family: 'Noto Sans Devanagari', serif; font-size: 1.05rem; }

        .kw-card-hr { height: 1.5px; background: #e8e8e4; margin-bottom: .8rem; }

        .kw-card-desc {
          font-size: .9rem; line-height: 1.75; color: #333; flex: 1; margin-bottom: 1rem;
          font-weight: 400;
        }
        .kw-card-desc.hi { font-family: 'Noto Sans Devanagari', sans-serif; font-size: .88rem; color: #222; }

        .kw-card-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: .9rem; border-top: 1px solid #eee; gap: .5rem; flex-wrap: wrap;
        }
        .kw-src {
          font-size: .65rem; letter-spacing: .1em; text-transform: uppercase;
          color: #666; display: flex; align-items: center; gap: .4rem;
          font-family: 'Newsreader', serif; font-weight: 600;
        }
        .kw-src-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* ─── READ BTN ───────────────────────────── */
        .kw-btn {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .45rem 1.1rem; border-radius: 3px;
          font-family: 'Newsreader', serif;
          font-size: .65rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase;
          border: 2px solid #111; background: transparent; color: #111;
          text-decoration: none; cursor: pointer; transition: all .2s;
        }
        .kw-btn:hover { background: #111; color: #fff; }
        .kw-btn svg { transition: transform .2s; }
        .kw-btn:hover svg { transform: translateX(3px); }

        /* ─── MODAL ──────────────────────────────── */
        .kw-modal-bg {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(250,250,248,.88);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: _mfade .2s ease;
        }
        @keyframes _mfade { from { opacity: 0 } to { opacity: 1 } }

        .kw-modal {
          background: #fff; border: 2px solid #111;
          max-width: 700px; width: 100%; max-height: 88vh; overflow-y: auto;
          position: relative;
          animation: _mslide .25s cubic-bezier(.25,.8,.25,1);
          box-shadow: 10px 10px 0 #111;
        }
        @keyframes _mslide { from { transform: translateY(18px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        .kw-modal-img { width: 100%; aspect-ratio: 16/7; object-fit: cover; display: block; border-bottom: 2px solid #111; }
        .kw-modal-body { padding: 2.25rem 2.5rem; }
        .kw-modal-close {
          position: absolute; top: 1rem; right: 1rem; z-index: 2;
          width: 36px; height: 36px; border: 1.5px solid #111; border-radius: 2px;
          background: #fff; cursor: pointer; font-size: 1rem; color: #111;
          display: flex; align-items: center; justify-content: center; transition: all .2s;
        }
        .kw-modal-close:hover { background: #111; color: #fff; }
        .kw-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.35rem, 2.8vw, 1.9rem); font-weight: 700; line-height: 1.25;
          color: #111; margin: 1rem 0 1.2rem;
        }
        .kw-modal-title.hi { font-family: 'Noto Sans Devanagari', serif; }
        .kw-modal-desc {
          font-size: .98rem; line-height: 1.88; color: #444; font-style: italic; margin-bottom: 2rem;
        }
        .kw-modal-desc.hi { font-family: 'Noto Sans Devanagari', sans-serif; font-style: normal; }

        /* ─── FOOTER ─────────────────────────────── */
        .kw-footer {
          text-align: center; padding: 2.5rem 1rem 2rem;
          border-top: 3px double #111; background: #fff;
        }
        .kw-footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 900; color: #111; letter-spacing: -.01em;
          display: inline-flex; align-items: center; gap: .08em; margin-bottom: .4rem;
        }
        .kw-footer-dot { width: 7px; height: 7px; border-radius: 50%; background: #e63946; margin-bottom: 4px; }
        .kw-footer-sub { font-size: .6rem; letter-spacing: .28em; text-transform: uppercase; color: #ccc; }

        @media (max-width: 640px) {
          .kw-header-top { padding: .55rem 1rem; }
          .kw-header-brand { padding: .75rem 1rem .6rem; }
          .kw-header-nav { padding: .4rem .75rem; }
          .kw-main { padding: 1.5rem 1rem 4rem; }
          .kw-feat-body { padding: 1.5rem 1.25rem; border-left: none; border-top: 2px solid #111; }
          .kw-modal-body { padding: 1.5rem 1.25rem; }
          .kw-grid { gap: 1rem; }
        }
      `}</style>

      <div className="kw-root">

        {/* ══ HEADER ══ */}
        <header className="kw-header">
          {/* Top bar */}
          <div className="kw-header-top">
            <div className="kw-meta">
              <Link href="/" style={{ textDecoration: 'none' }}>
                <button className="kw-home-btn" title="Back to Home">
                  <i className="ph-bold ph-house-line text-lg" style={{ fontSize: '1rem' }} />
                  Home
                </button>
              </Link>
              <span>
                {data?.date
                  ? new Date(data.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                  : new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            <div className="kw-controls">
              <button className={`kw-lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
              <button className={`kw-lang-btn ${lang === "hi" ? "active" : ""}`} onClick={() => setLang("hi")}>हिं</button>
              <button className="kw-refresh" onClick={fetchNews} disabled={loading} title="Refresh">
                <svg className={loading ? "spin" : ""} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Brand */}
          <div className="kw-header-brand">
            <div className="kw-brand-eyebrow">AI-Curated Daily Digest</div>
            <div className="kw-logo">
              Knobly<span className="kw-logo-dot" />Web
            </div>
            <div className="kw-logo-sub">Top 10 Stories · Tech · India · World · Sports</div>
          </div>

          {/* Nav */}
          <nav className="kw-header-nav">
            {["Tech", "India", "World", "Sports", "Breaking", "Trending"].map((item, i, arr) => (
              <span key={item} style={{ display: "contents" }}>
                <button className="kw-nav-btn">{item}</button>
                {i < arr.length - 1 && <span className="kw-nav-sep">·</span>}
              </span>
            ))}
          </nav>
        </header>

        {/* ══ DATELINE ══ */}
        <div className="kw-dateline">
          ✦ &nbsp; AI selects Top 10 from 30 stories &nbsp; ✦ &nbsp; English & हिंदी &nbsp; ✦ &nbsp; KnoblyWeb NewsFlash &nbsp; ✦
        </div>

        {/* ══ MAIN ══ */}
        <main className="kw-main">

          {/* DAILY SUMMARY */}
          {(data.daily_summary_en || data.daily_summary_hi) && (
            <div style={{ marginBottom: '3.5rem', padding: '1.75rem 2.25rem', border: '2px solid #ddd', backgroundColor: '#fff', borderLeft: '5px solid #111', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '0.8rem', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="#f59e0b">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {lang === "en" ? "Today's Briefing" : "आज की प्रमुख खबरें"}
              </h3>
              <p className={lang === "hi" ? "hi" : ""} style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit", fontSize: lang === "hi" ? '1rem' : '1.05rem', lineHeight: 1.8, color: '#333' }}>
                {lang === "en" ? data.daily_summary_en : data.daily_summary_hi}
              </p>
            </div>
          )}

          {/* FEATURED */}
          {featured && (() => {
            const cfg = getCat(featured.category);
            return (
              <>
                <div className="kw-sh">
                  <div className="kw-sh-line" />
                  <div className="kw-sh-title">Lead Story</div>
                  <div className="kw-sh-line" />
                </div>

                <div className="kw-featured" onClick={() => setModal(0)}>
                  <div className="kw-feat-img">
                    {featured.image
                      ? <img src={featured.image} alt={featured.title_en} loading="lazy" />
                      : <div className="kw-feat-no-img">{cfg.icon}</div>
                    }
                  </div>

                  <div className="kw-feat-body">
                    <div>
                      <div className="kw-issue-row">
                        <div className="kw-issue-num">01</div>
                        <div className="kw-issue-stack">
                          <span className="kw-cat-pill" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                            <span className="kw-cat-dot" style={{ background: cfg.accent }} />{cfg.label}
                          </span>
                          <span style={{ fontSize: ".6rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#ccc", fontFamily: "'Newsreader',serif" }}>Lead Story</span>
                        </div>
                      </div>

                      <h2 className={`kw-feat-title ${lang === "hi" ? "hi" : ""}`}>
                        {lang === "en" ? featured.title_en : featured.title_hi}
                      </h2>
                      <div className="kw-rule" />
                      <p className={`kw-feat-desc ${lang === "hi" ? "hi" : ""}`}>
                        {lang === "en" ? featured.explanation_en : featured.explanation_hi}
                      </p>
                    </div>

                    <div className="kw-feat-foot">
                      <div className="kw-src">
                        <span className="kw-src-dot" style={{ background: cfg.accent }} />
                        {featured.source}
                      </div>
                      <a href={featured.url} target="_blank" rel="noopener noreferrer" className="kw-btn"
                        onClick={e => e.stopPropagation()}>
                        {lang === "en" ? "Read Full Story" : "पूरी खबर पढ़ें"}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* REST GRID */}
          <div className="kw-sh" style={{ marginTop: "3rem" }}>
            <div className="kw-sh-line" />
            <div className="kw-sh-title">More Stories</div>
            <span className="kw-sh-count">{rest.length} articles</span>
            <div className="kw-sh-line" />
          </div>

          <div className="kw-grid">
            {rest.map((news, i) => {
              const cfg = getCat(news.category);
              return (
                <div key={i} className="kw-card" onClick={() => setModal(i + 1)}>
                  {/* Rank badge */}
                  <div className="kw-rank-badge">{String(i + 2).padStart(2, "0")}</div>

                  {/* Image */}
                  <div className="kw-card-img">
                    {news.image
                      ? <><img src={news.image} alt={news.title_en} loading="lazy" /><div className="kw-img-shade" /></>
                      : <div className="kw-card-no-img">{cfg.icon}</div>
                    }
                  </div>

                  {/* Body */}
                  <div className="kw-card-body">
                    <div className="kw-card-meta">
                      <span className="kw-cat-pill" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: ".57rem" }}>
                        <span className="kw-cat-dot" style={{ background: cfg.accent }} />{cfg.label}
                      </span>
                    </div>

                    <div className={`kw-card-title ${lang === "hi" ? "hi" : ""}`}>
                      {lang === "en" ? news.title_en : news.title_hi}
                    </div>
                    <div className="kw-card-hr" />
                    <div className={`kw-card-desc ${lang === "hi" ? "hi" : ""}`}>
                      {lang === "en" ? news.explanation_en : news.explanation_hi}
                    </div>

                    <div className="kw-card-foot">
                      <div className="kw-src">
                        <span className="kw-src-dot" style={{ background: cfg.accent }} />
                        {news.source}
                      </div>
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="kw-btn"
                        onClick={e => e.stopPropagation()} style={{ padding: ".3rem .8rem", fontSize: ".58rem" }}>
                        {lang === "en" ? "Read" : "पढ़ें"}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* ══ FOOTER ══ */}
        <footer className="kw-footer">
          <div className="kw-footer-logo">
            Knobly<span className="kw-footer-dot" />Web
          </div>
          <div className="kw-footer-sub">AI-Curated News · Top 10 Daily · © {new Date().getFullYear()} KnoblyWeb</div>
        </footer>

        {/* ══ MODAL ══ */}
        {modal !== null && data?.newsList[modal] && (() => {
          const news = data.newsList[modal];
          const cfg  = getCat(news.category);
          return (
            <div className="kw-modal-bg" onClick={() => setModal(null)}>
              <div className="kw-modal" onClick={e => e.stopPropagation()}>
                <button className="kw-modal-close" onClick={() => setModal(null)}>✕</button>
                {news.image && <img src={news.image} alt={news.title_en} className="kw-modal-img" />}

                <div className="kw-modal-body">
                  <span className="kw-cat-pill" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                    <span className="kw-cat-dot" style={{ background: cfg.accent }} />
                    {cfg.label} — Story #{modal + 1}
                  </span>

                  <h2 className={`kw-modal-title ${lang === "hi" ? "hi" : ""}`}>
                    {lang === "en" ? news.title_en : news.title_hi}
                  </h2>
                  <div className="kw-rule" />

                  <p className={`kw-modal-desc ${lang === "hi" ? "hi" : ""}`}>
                    {lang === "en" ? news.explanation_en : news.explanation_hi}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div className="kw-src">
                      <span className="kw-src-dot" style={{ background: cfg.accent }} />
                      {news.source}
                    </div>
                    <a href={news.url} target="_blank" rel="noopener noreferrer" className="kw-btn"
                      style={{ borderColor: cfg.accent, color: cfg.color }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = cfg.accent; el.style.color = "#fff"; el.style.borderColor = cfg.accent; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = cfg.color; el.style.borderColor = cfg.accent; }}>
                      {lang === "en" ? "Read Full Article" : "पूरी खबर पढ़ें"}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
