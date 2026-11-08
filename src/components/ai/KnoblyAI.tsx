'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowUp, X, Minus, ArrowUpRight, FileText, Download, Sparkles } from 'lucide-react';
import { SafeAIContent } from './SafeAIContent';
import { AI_LIMITS, buildAIChatHistory } from '@/lib/ai-limits';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
    role: 'user' | 'assistant';
    content: string;
    navOptions?: { path: string; label: string }[];
    explainAction?: { topic: string; slug: string; lang?: string };
    relatedTopics?: string[];
}
interface IntentResult {
    intent: 'navigate' | 'explain' | 'chat';
    path?: string;
    topic?: string;
    slug?: string;
    lang?: string;
}

function parseAIResponse(text: string): {
    clean: string;
    intent: IntentResult;
    navOptions: { path: string; label: string }[];
    relatedTopics: string[];
} {
    let clean = text;
    let intent: IntentResult = { intent: 'chat' };
    let navOptions: { path: string; label: string }[] = [];
    let relatedTopics: string[] = [];

    // Parse [INTENT]...[/INTENT]
    const intentMatch = clean.match(/\[INTENT\]([\s\S]*?)\[\/INTENT\]/);
    if (intentMatch) {
        try { intent = JSON.parse(intentMatch[1].trim()); } catch { }
        clean = clean.replace(/\[INTENT\][\s\S]*?\[\/INTENT\]/, '').trim();
    }

    // Fallback: old-style {"action":"navigate"}
    if (intent.intent === 'chat') {
        const oldNav = clean.match(/\{[\s\S]*?"action"\s*:\s*"navigate"[\s\S]*?\}/);
        if (oldNav) {
            try {
                const parsed = JSON.parse(oldNav[0]);
                intent = { intent: 'navigate', path: parsed.path };
            } catch { }
            clean = clean.replace(/\{[\s\S]*?"action"\s*:\s*"navigate"[\s\S]*?\}/, '').trim();
        }
    }

    // Parse [NAV_OPTIONS]...[/NAV_OPTIONS]
    const navMatch = clean.match(/\[NAV_OPTIONS\]([\s\S]*?)\[\/NAV_OPTIONS\]/);
    if (navMatch) {
        navOptions = navMatch[1].trim().split('\n').map(l => l.trim()).filter(l => l.includes('|'))
            .map(l => { const [path, label] = l.split('|').map(s => s.trim()); return { path, label }; });
        clean = clean.replace(/\[NAV_OPTIONS\][\s\S]*?\[\/NAV_OPTIONS\]/, '').trim();
    }

    // Parse [RELATED]...[/RELATED]
    const relMatch = clean.match(/\[RELATED\]([\s\S]*?)\[\/RELATED\]/);
    if (relMatch) {
        relatedTopics = relMatch[1].trim().split('|').map(s => s.trim()).filter(Boolean);
        clean = clean.replace(/\[RELATED\][\s\S]*?\[\/RELATED\]/, '').trim();
    }

    return { clean, intent, navOptions, relatedTopics };
}

// ─── Rive Baby AI Robot (Interactive State Machine) ───────────────────

// ─── Rive-Equivalent Smart Avatar (Advanced CSS State Machine) ───────────────────

// Provides the 5 states (Idle, Hover, Click, Talking, Thinking) via CSS natively without needing a binary .riv file
const ROBOT_STATES_CSS = `
    /* Enhanced Ultra-Futuristic CSS State Machine */
    @keyframes ro-float { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-18px) rotate(1deg)} }
    @keyframes ro-breath { 0%,100%{transform:scaleX(1) scaleY(1)} 50%{transform:scaleX(1.02) scaleY(0.98)} }
    @keyframes ro-blink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.02)} }
    @keyframes ro-click-bounce { 0%{transform:scale(1)} 30%{transform:translateY(-25px) scale(1.1) rotate(5deg)} 60%{transform:translateY(12px) scale(0.9) rotate(-3deg)} 100%{transform:translateY(0) scale(1) rotate(0)} }
    @keyframes ro-think-eye { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-16px)} 75%{transform:translateX(16px)} }
    @keyframes ro-talk-head { 0%,100%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-6px) rotate(-5deg)} 75%{transform:translateY(6px) rotate(5deg)} }
    @keyframes ro-talk-glow { 0%,100%{opacity:0.6;filter:drop-shadow(0 0 10px #00f5ff)} 50%{opacity:1;filter:drop-shadow(0 0 25px #00f5ff) drop-shadow(0 0 45px #ec4899)} }
    @keyframes ro-arm-left { 0%,100%{transform:rotate(10deg)} 50%{transform:rotate(20deg)} }
    @keyframes ro-arm-right { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(-20deg)} }
    @keyframes ro-wave-idle { 
        0%, 75%, 100% { transform: rotate(10deg); } 
        80% { transform: rotate(80deg); } 
        85% { transform: rotate(50deg); } 
        90% { transform: rotate(90deg); } 
        95% { transform: rotate(50deg); } 
    }
    @keyframes ro-wave-hover {
        0%, 100% { transform: rotate(85deg); }
        50% { transform: rotate(50deg); }
    }
    @keyframes ro-holo-ring { 0%{transform:rotateX(75deg) rotateZ(0deg)} 100%{transform:rotateX(75deg) rotateZ(360deg)} }
    @keyframes ro-scanline { 0%{transform:translateY(-80px)} 100%{transform:translateY(120px)} }
    
    .ro-wrap { transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1); transform-origin: center bottom; }
    
    /* Default / Idle */
    .state-idle .ro-body { animation: ro-breath 4s ease-in-out infinite; transform-origin: center bottom; }
    .state-idle .ro-eye { animation: ro-blink 5.5s infinite; transform-origin: center; }
    .state-idle .ro-arm-l { animation: ro-wave-idle 7s ease-in-out infinite; transform-origin: 45px 145px; }
    .state-idle .ro-arm-r { animation: ro-arm-right 4s ease-in-out infinite; transform-origin: 155px 145px; }
    .state-idle .ro-heart { opacity: 0.85; }
    .state-idle .ro-holo { animation: ro-holo-ring 8s linear infinite; }
    
    /* Hover */
    .state-hover { filter: drop-shadow(0 15px 35px rgba(0, 245, 255, 0.4)); }
    .state-hover .ro-eye { animation: ro-blink 0.4s infinite; fill: #fff; filter: drop-shadow(0 0 25px #00f5ff); transform-origin: center; transition: all 0.3s; }
    .state-hover .ro-heart { filter: drop-shadow(0 0 30px #ec4899) drop-shadow(0 0 50px #00f5ff); opacity: 1; transition: all 0.3s; }
    .state-hover .ro-arm-l { animation: ro-wave-hover 0.5s ease-in-out infinite; transform-origin: 45px 145px; }
    .state-hover .ro-arm-r { transform: rotate(-30deg); transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); transform-origin: 155px 145px; }
    .state-hover .ro-holo { animation: ro-holo-ring 3s linear infinite; opacity: 1; stroke: #00f5ff; }
    
    /* Click */
    .state-click { animation: ro-click-bounce 0.6s cubic-bezier(0.36,0.07,0.19,0.97) forwards !important; }
    .state-click .ro-eye { transform: scaleY(1.5) scaleX(1.4); fill: #fff; filter: drop-shadow(0 0 35px #ec4899); }
    .state-click .ro-heart { filter: drop-shadow(0 0 50px #ec4899) drop-shadow(0 0 80px #fff); transform: scale(1.4); }
    
    /* Thinking */
    .state-thinking .ro-eye-wrapper { animation: ro-think-eye 1.2s ease-in-out infinite; }
    .state-thinking .ro-heart { animation: ro-talk-glow 0.8s infinite alternate; }
    .state-thinking .ro-arm-r { transform: rotate(-140deg) translate(-15px, -25px); transition: all 0.4s; transform-origin: top center; }
    .state-thinking .ro-holo { animation: ro-holo-ring 2s linear infinite; stroke: #ec4899; }
    
    /* Talking */
    .state-talking .ro-head { animation: ro-talk-head 0.35s ease-in-out infinite; transform-origin: center bottom; }
    .state-talking .ro-eye { animation: ro-blink 1.5s infinite; transform-origin: center; filter: drop-shadow(0 0 15px #00f5ff); }
    .state-talking .ro-heart { animation: ro-talk-glow 0.3s infinite alternate; }
    .state-talking .ro-arm-l { transform: rotate(70deg); transition: all 0.2s; transform-origin: top center; animation: ro-talk-head 0.35s infinite; }
    .state-talking .ro-holo { animation: ro-holo-ring 3s linear infinite; stroke: #a855f7; }
`;

function BabyRobot({ size = 95, onClick, isTalking = false, isThinking = false }: { size?: number; onClick?: () => void; isTalking?: boolean; isThinking?: boolean }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 500);
        onClick?.();
    };

    let activeState = 'state-idle';
    if (isClicked) activeState = 'state-click';
    else if (isThinking) activeState = 'state-thinking';
    else if (isTalking) activeState = 'state-talking';
    else if (isHovered) activeState = 'state-hover';

    return (
        <div 
            className="group relative cursor-pointer" 
            style={{ width: size, height: size * 1.4, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style dangerouslySetInnerHTML={{ __html: ROBOT_STATES_CSS }} />
            
            {/* Holographic Ground Projection */}
            <div style={{
                position: 'absolute', bottom: -5, width: '110%', height: 30,
                background: 'radial-gradient(ellipse, rgba(0,245,255,0.4) 0%, rgba(236,72,153,0.1) 40%, transparent 80%)',
                borderRadius: '50%', filter: 'blur(4px)', transition: 'all 0.4s',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)', 
                opacity: isHovered ? 0.8 : 0.5,
                border: '1px solid rgba(0,245,255,0.2)',
                boxShadow: '0 0 20px rgba(0,245,255,0.2) inset'
            }} />

            {/* AI Character Container */}
            <div className={`ro-wrap ${activeState}`} style={{ width: '100%', height: '95%', position: 'relative', zIndex: 1 }}>
                <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                        {/* Ultra-Realistic 3D Metal/Glass Gradients */}
                        <radialGradient id="roBase" cx="35%" cy="20%" r="85%" fx="30%" fy="20%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="20%" stopColor="#f1f5f9" />
                            <stop offset="60%" stopColor="#cbd5e1" />
                            <stop offset="90%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#64748b" />
                        </radialGradient>
                        <radialGradient id="roDarkMetal" cx="50%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#475569" />
                            <stop offset="70%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </radialGradient>
                        <linearGradient id="roVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#020617" />
                            <stop offset="40%" stopColor="#0f172a" />
                            <stop offset="100%" stopColor="#082f49" />
                        </linearGradient>
                        <linearGradient id="roVisorGlass" x1="10%" y1="0%" x2="90%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="25%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                            <stop offset="80%" stopColor="rgba(0,245,255,0.05)" />
                            <stop offset="100%" stopColor="rgba(0,245,255,0.2)" />
                        </linearGradient>
                        <radialGradient id="roEyeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="30%" stopColor="#00f5ff" />
                            <stop offset="70%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="roHeartGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="30%" stopColor="#ec4899" />
                            <stop offset="70%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <linearGradient id="roHoloEnergy" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="rgba(0,245,255,0)" />
                            <stop offset="50%" stopColor="rgba(0,245,255,0.8)" />
                            <stop offset="100%" stopColor="rgba(0,245,255,0)" />
                        </linearGradient>
                        <filter id="roDepth" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="15" stdDeviation="12" floodColor="rgba(15,23,42,0.4)" />
                            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="rgba(0,245,255,0.15)" />
                        </filter>
                        <filter id="roInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feComponentTransfer in="SourceAlpha"><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feOffset dy="8" dx="4" />
                            <feComposite operator="in" in2="SourceAlpha" />
                            <feComposite operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                            <feFlood floodColor="#ffffff" floodOpacity="0.8" />
                            <feComposite operator="in" in2="shadowDiff" />
                            <feComposite operator="over" in2="SourceGraphic" />
                        </filter>
                        <filter id="roGlowCore" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Holographic Orbit Rings */}
                    <g className="ro-holo" style={{ transformOrigin: '100px 145px', opacity: 0.6, transition: 'all 0.3s' }}>
                        <ellipse cx="100" cy="145" rx="85" ry="85" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="1" strokeDasharray="4 8" />
                        <ellipse cx="100" cy="145" rx="95" ry="95" fill="none" stroke="rgba(236,72,153,0.2)" strokeWidth="2" strokeDasharray="15 30" />
                        {/* Orbiting particles */}
                        <circle cx="15" cy="145" r="3" fill="#00f5ff" filter="blur(1px)" />
                        <circle cx="185" cy="145" r="2" fill="#ec4899" filter="blur(1px)" />
                    </g>

                    {/* Mechanical Joints / Antennas */}
                    <g className="ro-head">
                        <path d="M15 90 Q 25 70 30 90" fill="url(#roDarkMetal)" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="20" cy="72" r="4" fill="#00f5ff" filter="url(#roGlowCore)" />
                        
                        <path d="M185 90 Q 175 70 170 90" fill="url(#roDarkMetal)" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="180" cy="72" r="4" fill="#ec4899" filter="url(#roGlowCore)" />
                        
                        {/* Audio / Sensor pods */}
                        <rect x="18" y="80" width="12" height="30" rx="6" fill="url(#roBase)" filter="drop-shadow(3px 5px 5px rgba(0,0,0,0.2))" transform="rotate(-15 24 95)" />
                        <rect x="170" y="80" width="12" height="30" rx="6" fill="url(#roBase)" filter="drop-shadow(-3px 5px 5px rgba(0,0,0,0.2))" transform="rotate(15 176 95)" />
                    </g>
                    
                    <g className="ro-body">
                        {/* Cybernetic Neck */}
                        <rect x="85" y="115" width="30" height="20" rx="4" fill="url(#roDarkMetal)" />
                        <line x1="88" y1="120" x2="112" y2="120" stroke="#0f172a" strokeWidth="2" />
                        <line x1="88" y1="125" x2="112" y2="125" stroke="#0f172a" strokeWidth="2" />
                        <line x1="88" y1="130" x2="112" y2="130" stroke="#0f172a" strokeWidth="2" />

                        {/* High-Tech Torso Sphere */}
                        <path d="M45 130 C45 130, 20 210, 100 220 C180 210, 155 130, 155 130 Z" fill="url(#roBase)" filter="url(#roDepth)" />
                        <path d="M45 130 C45 130, 20 210, 100 220 C180 210, 155 130, 155 130 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" filter="url(#roInnerShadow)" />
                        
                        {/* Torso Panel Seams */}
                        <path d="M70 130 C70 160, 80 215, 100 220" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
                        <path d="M130 130 C130 160, 120 215, 100 220" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
                        <path d="M55 175 Q 100 190 145 175" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />

                        {/* Power Core Receptacle */}
                        <ellipse cx="100" cy="160" rx="22" ry="22" fill="url(#roDarkMetal)" />
                        <ellipse cx="100" cy="160" rx="18" ry="18" fill="#020617" stroke="rgba(0,245,255,0.3)" strokeWidth="2" />
                        
                        {/* Glowing Energy Heart Core */}
                        <circle cx="100" cy="160" r="10" fill="url(#roHeartGlow)" className="ro-heart" style={{ transition: 'all 0.3s' }} filter="url(#roGlowCore)" />
                        <circle cx="100" cy="160" r="4" fill="#ffffff" />
                        
                        {/* Core Energy Ring */}
                        <circle cx="100" cy="160" r="14" fill="none" stroke="rgba(236,72,153,0.5)" strokeWidth="1" strokeDasharray="2 4" className="ro-heart" style={{ animation: 'ro-holo-ring 3s linear infinite' }} />

                        {/* Floating Cyber Arms */}
                        <g className="ro-arm-l">
                            {/* Shoulder joint */}
                            <circle cx="45" cy="145" r="9" fill="url(#roDarkMetal)" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx="45" cy="145" r="3" fill="#0f172a" />
                            {/* Arm body */}
                            <path d="M42 145 C 10 160, -5 200, 20 205 C 35 205, 52 165, 48 145 Z" fill="url(#roBase)" filter="drop-shadow(-4px 6px 8px rgba(0,0,0,0.35))" />
                            <path d="M42 145 C 10 160, -5 200, 20 205 C 35 205, 52 165, 48 145 Z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                            {/* Glowing palm node */}
                            <ellipse cx="25" cy="170" rx="4" ry="12" fill="url(#roDarkMetal)" transform="rotate(-20 25 170)" />
                            <circle cx="20" cy="195" r="8" fill="url(#roDarkMetal)" stroke="#cbd5e1" strokeWidth="1" />
                            <circle cx="20" cy="195" r="4" fill="#00f5ff" filter="url(#roGlowCore)" />
                        </g>

                        <g className="ro-arm-r">
                            {/* Shoulder joint */}
                            <circle cx="155" cy="145" r="9" fill="url(#roDarkMetal)" stroke="#94a3b8" strokeWidth="1.5" />
                            <circle cx="155" cy="145" r="3" fill="#0f172a" />
                            {/* Arm body */}
                            <path d="M158 145 C 190 160, 205 200, 180 205 C 165 205, 148 165, 152 145 Z" fill="url(#roBase)" filter="drop-shadow(4px 6px 8px rgba(0,0,0,0.35))" />
                            <path d="M158 145 C 190 160, 205 200, 180 205 C 165 205, 148 165, 152 145 Z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                            {/* Glowing palm node */}
                            <ellipse cx="175" cy="170" rx="4" ry="12" fill="url(#roDarkMetal)" transform="rotate(20 175 170)" />
                            <circle cx="180" cy="195" r="8" fill="url(#roDarkMetal)" stroke="#cbd5e1" strokeWidth="1" />
                            <circle cx="180" cy="195" r="4" fill="#ec4899" filter="url(#roGlowCore)" />
                            {/* Holographic lines bursting from waving hand */}
                            <path d="M185 180 Q 200 170 205 180" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" style={{ animation: 'ro-blink 0.5s infinite' }} />
                            <path d="M190 195 Q 210 195 210 205" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" style={{ animation: 'ro-blink 0.6s infinite' }} />
                        </g>
                    </g>

                    <g className="ro-head">
                        {/* 3D Glass Head with Inner Shadow */}
                        <rect x="25" y="25" width="150" height="105" rx="52.5" fill="url(#roBase)" filter="url(#roDepth)" />
                        <rect x="25" y="25" width="150" height="105" rx="52.5" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" filter="url(#roInnerShadow)" />
                        
                        {/* Head Seams */}
                        <path d="M25 75 Q 100 90 175 75" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
                        <path d="M100 25 L 100 40" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="2" />

                        {/* Futuristic Visor Screen */}
                        <rect x="35" y="42" width="130" height="70" rx="35" fill="url(#roVisor)" stroke="#1e293b" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
                        
                        {/* Visor Scanline Effect */}
                        <g style={{ clipPath: 'inset(42px 35px 43px 35px round 35px)' }}>
                            <rect x="35" y="42" width="130" height="10" fill="url(#roHoloEnergy)" style={{ animation: 'ro-scanline 3s linear infinite' }} />
                            <line x1="35" y1="55" x2="165" y2="55" stroke="rgba(0,245,255,0.1)" strokeWidth="1" />
                            <line x1="35" y1="65" x2="165" y2="65" stroke="rgba(0,245,255,0.1)" strokeWidth="1" />
                            <line x1="35" y1="75" x2="165" y2="75" stroke="rgba(0,245,255,0.1)" strokeWidth="1" />
                            <line x1="35" y1="85" x2="165" y2="85" stroke="rgba(0,245,255,0.1)" strokeWidth="1" />
                            <line x1="35" y1="95" x2="165" y2="95" stroke="rgba(0,245,255,0.1)" strokeWidth="1" />
                        </g>

                        {/* Visor Glossy Reflection */}
                        <rect x="35" y="42" width="130" height="70" rx="35" fill="url(#roVisorGlass)" />
                        <ellipse cx="100" cy="52" rx="45" ry="8" fill="rgba(255,255,255,0.2)" filter="blur(1px)" />

                        {/* Hyper-Expressive Matrix Eyes */}
                        <g className="ro-eye-wrapper">
                            <g className="ro-eye">
                                <path d="M55 70 Q 75 50 95 70" stroke="url(#roEyeGlow)" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#roGlowCore)" />
                                <circle cx="75" cy="64" r="5" fill="#ffffff" />
                                <circle cx="82" cy="62" r="2" fill="#ffffff" opacity="0.6" />
                            </g>
                            <g className="ro-eye">
                                <path d="M105 70 Q 125 50 145 70" stroke="url(#roEyeGlow)" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#roGlowCore)" />
                                <circle cx="125" cy="64" r="5" fill="#ffffff" />
                                <circle cx="118" cy="62" r="2" fill="#ffffff" opacity="0.6" />
                            </g>
                        </g>
                        
                        {/* Cyber Blush / Status Nodes */}
                        <ellipse cx="50" cy="90" rx="8" ry="4" fill="rgba(236, 72, 153, 0.6)" filter="blur(3px)" />
                        <circle cx="50" cy="90" r="1.5" fill="#fff" opacity="0.5" />
                        
                        <ellipse cx="150" cy="90" rx="8" ry="4" fill="rgba(236, 72, 153, 0.6)" filter="blur(3px)" />
                        <circle cx="150" cy="90" r="1.5" fill="#fff" opacity="0.5" />
                    </g>
                </svg>
            </div>
        </div>
    );
}

// Small version for chat header/messages (matching realistic style)
const SmallRobot = ({ size = 20 }: { size?: number }) => (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 1.25} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,245,255,0.2))' }}>
        <defs>
            <radialGradient id="srBase" cx="35%" cy="20%" r="85%" fx="30%" fy="20%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
            <linearGradient id="srVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <radialGradient id="srEye" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#00f5ff" />
                <stop offset="100%" stopColor="transparent" />
            </radialGradient>
        </defs>
        {/* Head Base */}
        <rect x="24" y="20" width="112" height="86" rx="43" fill="url(#srBase)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        
        {/* Visor Screen */}
        <rect x="35" y="40" width="90" height="50" rx="25" fill="url(#srVisor)" stroke="#1e293b" strokeWidth="2" />
        
        {/* Visor Gloss */}
        <rect x="35" y="40" width="90" height="25" rx="12.5" fill="rgba(255,255,255,0.15)" />
        
        {/* Eyes */}
        <circle cx="60" cy="65" r="10" fill="url(#srEye)" />
        <circle cx="60" cy="65" r="3" fill="#ffffff" />
        <circle cx="100" cy="65" r="10" fill="url(#srEye)" />
        <circle cx="100" cy="65" r="3" fill="#ffffff" />
        
        {/* Body Base */}
        <path d="M45 120 C45 120, 30 180, 80 190 C130 180, 115 120, 115 120 Z" fill="url(#srBase)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <circle cx="80" cy="145" r="12" fill="#0f172a" />
        <circle cx="80" cy="145" r="6" fill="#ec4899" filter="blur(2px)" />
        <circle cx="80" cy="145" r="3" fill="#ffffff" />
    </svg>
);


// ─── Rotating bubble messages ─────────────────────────────────────────────────
const BUBBLES = [
    'Hi! 👋',
    'Ask me anything! ✨'
];

// ─── Theme helpers ────────────────────────────────────────────────────────────
const DARK = {
    panel: 'rgba(8, 6, 24, 0.88)',
    header: 'linear-gradient(135deg, rgba(79,46,220,0.3) 0%, rgba(8,80,110,0.2) 100%)',
    headerBorder: 'rgba(139,92,246,0.25)',
    msg: '#c4b5fd',
    msgUser: 'linear-gradient(135deg,rgba(109,40,217,0.55),rgba(14,116,144,0.4))',
    msgUserBorder: 'rgba(139,92,246,0.3)',
    msgUserColor: '#f5f3ff',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBorder: 'rgba(139,92,246,0.28)',
    inputColor: '#f5f3ff',
    footerText: '#4b5563',
    promptBg: 'rgba(139,92,246,0.07)',
    promptBorder: 'rgba(139,92,246,0.2)',
    promptColor: '#ddd6fe',
    tagBg: 'rgba(139,92,246,0.1)',
    tagBorder: 'rgba(139,92,246,0.25)',
    tagColor: '#c4b5fd',
    navBg: 'rgba(139,92,246,0.1)',
    navBorder: 'rgba(139,92,246,0.3)',
    navColor: '#c4b5fd',
    welcomeText: '#f5f3ff',
    welcomeSub: '#8b5cf6',
    headerNameGrad: 'linear-gradient(90deg,#67e8f9,#a78bfa,#f0abfc)',
    panelShadow: '0 0 0 1px rgba(139,92,246,0.4), 0 0 0 2px rgba(34,211,238,0.08), 0 20px 60px rgba(0,0,0,0.65), 0 0 60px rgba(109,40,217,0.12)',
    headerCloseHover: 'rgba(239,68,68,0.15)',
    headerMinHover: 'rgba(251,191,36,0.15)',
    gradientTopBar: 'linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)',
    scrollbarThumb: 'rgba(139,92,246,0.35)',
    sendActive: 'linear-gradient(135deg,#7c3aed,#0e7490)',
    sendGlow: 'rgba(124,58,237,0.5)',
};
const LIGHT = {
    panel: 'rgba(255, 255, 255, 0.97)',
    header: 'linear-gradient(135deg, rgba(237,233,254,0.9) 0%, rgba(207,250,254,0.5) 100%)',
    headerBorder: 'rgba(139,92,246,0.15)',
    msg: '#374151',
    msgUser: 'linear-gradient(135deg,rgba(109,40,217,0.12),rgba(14,116,144,0.1))',
    msgUserBorder: 'rgba(139,92,246,0.2)',
    msgUserColor: '#1e1b4b',
    inputBg: 'rgba(249,247,255,1)',
    inputBorder: 'rgba(139,92,246,0.2)',
    inputColor: '#111827',
    footerText: '#9ca3af',
    promptBg: 'rgba(139,92,246,0.05)',
    promptBorder: 'rgba(139,92,246,0.15)',
    promptColor: '#4c1d95',
    tagBg: 'rgba(139,92,246,0.07)',
    tagBorder: 'rgba(139,92,246,0.18)',
    tagColor: '#5b21b6',
    navBg: 'rgba(139,92,246,0.06)',
    navBorder: 'rgba(139,92,246,0.2)',
    navColor: '#5b21b6',
    welcomeText: '#111827',
    welcomeSub: '#7c3aed',
    headerNameGrad: 'linear-gradient(90deg,#0891b2,#7c3aed,#be185d)',
    panelShadow: '0 0 0 1px rgba(139,92,246,0.18), 0 16px 48px rgba(0,0,0,0.12), 0 0 30px rgba(109,40,217,0.06)',
    headerCloseHover: 'rgba(239,68,68,0.1)',
    headerMinHover: 'rgba(251,191,36,0.1)',
    gradientTopBar: 'linear-gradient(90deg,#0891b2,#7c3aed,#be185d)',
    scrollbarThumb: 'rgba(139,92,246,0.25)',
    sendActive: 'linear-gradient(135deg,#7c3aed,#0891b2)',
    sendGlow: 'rgba(124,58,237,0.35)',
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KnoblyAI() {
    const router = useRouter();
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isTestPage = pathname?.startsWith('/test/');
    const isPythonLabPage = pathname === '/python-lab' || pathname === '/c-lab';
    const isCompilerPage = pathname?.includes('/compiler') || pathname?.startsWith('/html/tasks');
    const isHiddenPage = Boolean(isTestPage || isPythonLabPage || isCompilerPage);

    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDark, setIsDark] = useState(true);

    // Peek Mode
    const [isPeekMode, setIsPeekMode] = useState(true);
    const [hoverPeek, setHoverPeek] = useState(false);

    // Bubble
    const [bubbleIdx, setBubbleIdx] = useState(0);
    const [bubbleVis, setBubbleVis] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const aiBoxRef = useRef<HTMLDivElement>(null);
    const triggerWrapRef = useRef<HTMLDivElement>(null);
    const triggerBtnRef = useRef<HTMLButtonElement>(null);

    // ── Optional Synthesized Click Sound ──
    const playClickSound = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
    }, []);

    // ── Theme detection ──
    useEffect(() => {
        const check = () => setIsDark(document.documentElement.classList.contains('dark'));
        if (isHiddenPage) return;
        check();
        const obs = new MutationObserver(check);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, [isHiddenPage]);
    const T = isDark ? DARK : LIGHT;

    // ── Click outside ──
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (open && aiBoxRef.current && triggerWrapRef.current &&
                !aiBoxRef.current.contains(e.target as Node) &&
                !triggerWrapRef.current.contains(e.target as Node))
                setOpen(false);
        };
        if (isHiddenPage) return;
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, isHiddenPage]);

    // ── Focus input ──
    useEffect(() => {
        if (isHiddenPage || !open || minimized) return;
        const timeout = setTimeout(() => inputRef.current?.focus(), 320);
        return () => clearTimeout(timeout);
    }, [open, minimized, isHiddenPage]);

    // ── Scroll to bottom ──
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (isHiddenPage) return;
        if (loading || (lastMsg && lastMsg.role === 'user')) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, isHiddenPage]);

    // ── External toggle ──
    useEffect(() => {
        const h = () => setOpen(p => !p);
        if (isHiddenPage) return;
        window.addEventListener('toggle-knobly-ai', h);
        return () => window.removeEventListener('toggle-knobly-ai', h);
    }, [isHiddenPage]);

    // Peak Behavior & Bubble Cycle
    useEffect(() => {
        if (open || isHiddenPage) return;
        
        let msgTimeout: NodeJS.Timeout;
        let swapTimeout: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;
        let fadeTimeout: NodeJS.Timeout;
        let peekTimeout: NodeJS.Timeout;

        const cycle = () => {
            setIsPeekMode(false); // Pop out completely
            setBubbleIdx(0); // Set to "Hi! 👋"
            
            // Wait 0.5s for robot to settle, then show "Hi"
            msgTimeout = setTimeout(() => {
                setBubbleVis(true);
            }, 500);
            
            // 2 seconds AFTER "Hi" is visible (2.5s total), swap to Ask me anything
            swapTimeout = setTimeout(() => {
                setBubbleVis(false); // Fade out briefly
                fadeTimeout = setTimeout(() => {
                    setBubbleIdx(1); // Set to "Ask me anything"
                    setBubbleVis(true);
                }, 300); // 300ms fade duration
            }, 2500);
            
            // Stay fully out for 10 seconds total, then hide again
            hideTimeout = setTimeout(() => {
                setBubbleVis(false); // Hide message bubble completely
                peekTimeout = setTimeout(() => setIsPeekMode(true), 400); // Slide robot fully out of view
            }, 10000);
        };

        // Initial pop-out shortly after page load
        const initTimeout = setTimeout(() => cycle(), 1000);

        // Repeat the entire cycle every 20 seconds (10s active + 10s hiding)
        const iv = setInterval(() => cycle(), 20000);

        return () => { 
            clearInterval(iv); 
            clearTimeout(initTimeout); 
            clearTimeout(msgTimeout); 
            clearTimeout(swapTimeout);
            clearTimeout(hideTimeout); 
            clearTimeout(fadeTimeout);
            clearTimeout(peekTimeout);
        };
    }, [open, isHiddenPage]);

    const handleClick = useCallback(() => {
        playClickSound();
        setOpen(true); setMinimized(false);
        setIsPeekMode(false);
        setBubbleVis(false);
    }, [playClickSound]);

    // ── Navigate ──
    const navigateTo = useCallback((path: string) => {
        playClickSound();
        setOpen(false); router.push(path);
    }, [router, playClickSound]);

    // ── Send ──
    const send = useCallback(async (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || loading) return;
        if (msg.length > AI_LIMITS.chatMessage) {
            setMessages(p => [...p, { role: 'assistant', content: `Message is too long (maximum ${AI_LIMITS.chatMessage} characters).` }]);
            return;
        }
        setInput('');
        const userMsg: Message = { role: 'user', content: msg };
        setMessages(p => [...p, userMsg]);
        setLoading(true);
        try {
            const history = buildAIChatHistory([...messages, userMsg]);
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessages(p => [...p, {
                    role: 'assistant',
                    content: typeof data.error === 'string' ? data.error : 'AI service is temporarily unavailable. Please try again.',
                }]);
                return;
            }
            const reply: string = data.reply ?? 'Kuch galat hua. Dobara try karo.';
            const { clean, intent, navOptions, relatedTopics } = parseAIResponse(reply);

            if (intent.intent === 'navigate' && intent.path) {
                setMessages(p => [...p, {
                    role: 'assistant',
                    content: clean || `✅ **${intent.path}** page par le ja raha hoon...`,
                    navOptions: navOptions.length > 0 ? navOptions : undefined,
                    relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined,
                }]);
                setTimeout(() => navigateTo(intent.path!), 800);
            } else if (intent.intent === 'explain' && intent.slug) {
                setMessages(p => [...p, {
                    role: 'assistant' as const,
                    content: clean,
                    navOptions: navOptions.length > 0 ? navOptions : undefined,
                    explainAction: { topic: intent.topic || '', slug: intent.slug!, lang: intent.lang },
                    relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined,
                }]);
            } else {
                setMessages(p => [...p, {
                    role: 'assistant',
                    content: clean,
                    navOptions: navOptions.length > 0 ? navOptions : undefined,
                    relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined,
                }]);
            }
        } catch {
            setMessages(p => [...p, { role: 'assistant', content: '⚠️ Network error. Internet check karo aur dobara try karo.' }]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, navigateTo]);

    // Every render must call the same Hooks, including routes that hide the AI.
    if (isHiddenPage) return null;

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const PROMPTS = ['I want to learn Python programming', 'I need handwritten notes for O-Level', 'I want to practice MCQ questions'];
    const TAGS = ['Python', 'HTML', 'Notes', 'MCQ'];

    // ── Positions ──
    const wrapStyle: React.CSSProperties = { position: 'fixed', bottom: 88, right: 0, zIndex: 9999 };

    const panelRight = 16;
    const panelBottom = 88;
    const panelTop = 'auto';

    return (
        <>
            {/* ═══════ CSS ═══════ */}
            <style>{`
                @keyframes kai-float {
                    0%,100%{transform:translateY(0) rotate(-0.5deg);}
                    50%{transform:translateY(-10px) rotate(0.5deg);}
                }
                @keyframes kai-pulse {
                    0%{transform:scale(1);opacity:.55;}
                    60%{transform:scale(1.6);opacity:0;}
                    100%{transform:scale(1.6);opacity:0;}
                }
                @keyframes kai-pulse2 {
                    0%{transform:scale(1);opacity:.35;}
                    60%{transform:scale(2);opacity:0;}
                    100%{transform:scale(2);opacity:0;}
                }
                @keyframes kai-blink {
                    0%,90%,100%{transform:scaleY(1);}
                    93%{transform:scaleY(0.08);}
                }
                @keyframes kai-bubble {
                    from{opacity:0;transform:translateY(8px) scale(.93);}
                    to{opacity:1;transform:translateY(0) scale(1);}
                }
                @keyframes kai-dot {
                    0%,80%,100%{transform:translateY(0);opacity:.35;}
                    40%{transform:translateY(-7px);opacity:1;}
                }
                @keyframes kai-border {
                    0%{background-position:0% 50%;}
                    50%{background-position:100% 50%;}
                    100%{background-position:0% 50%;}
                }
                @keyframes kai-glow-eye {
                    0%,100%{filter:drop-shadow(0 0 3px #67e8f9);}
                    50%{filter:drop-shadow(0 0 8px #67e8f9) drop-shadow(0 0 14px #0891b2);}
                }
                @keyframes kai-shadow-pulse {
                    0%,100%{box-shadow:0 16px 40px rgba(109,40,217,0.4);}
                    50%{box-shadow:0 20px 50px rgba(109,40,217,0.7),0 0 40px rgba(34,211,238,0.2);}
                }
                .kai-float { animation: kai-float 3.5s ease-in-out infinite; }
                .kai-blink { animation: kai-blink 4.5s ease-in-out infinite; transform-origin:center; }
                .kai-eye-glow { animation: kai-glow-eye 2.5s ease-in-out infinite; }
                .kai-btn-shadow { animation: kai-shadow-pulse 2.5s ease-in-out infinite; }
                .kai-d1{animation:kai-dot 1.4s ease-in-out infinite;animation-delay:0ms;}
                .kai-d2{animation:kai-dot 1.4s ease-in-out infinite;animation-delay:200ms;}
                .kai-d3{animation:kai-dot 1.4s ease-in-out infinite;animation-delay:400ms;}
                .kai-scroll::-webkit-scrollbar{width:4px;}
                .kai-scroll::-webkit-scrollbar-track{background:transparent;}
                .kai-scroll::-webkit-scrollbar-thumb{border-radius:4px;background:${T.scrollbarThumb};}
                .kai-noscroll::-webkit-scrollbar{display:none;}
                .kai-noscroll{-ms-overflow-style:none;scrollbar-width:none;}
                .kai-grad-text{background:${T.headerNameGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
                .kai-top-bar{background:${T.gradientTopBar};background-size:300% 100%;animation:kai-border 4s ease infinite;}
            `}</style>

            {/* ═══════ FLOATING TRIGGER ═══════ */}
            <div
                ref={triggerWrapRef}
                className={`select-none flex flex-col items-end gap-1 ${isHomePage ? 'hidden md:flex xl:hidden' : 'flex'}`}
                style={{
                    ...wrapStyle,
                    opacity: open ? 0 : 1,
                    transform: open ? 'scale(0.88)' : (isPeekMode && !hoverPeek ? 'translateX(120px)' : 'translateX(-16px)'),
                    pointerEvents: open ? 'none' : 'auto',
                    transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onMouseEnter={() => setHoverPeek(true)}
                onMouseLeave={() => setHoverPeek(false)}
            >
                {/* Free-standing Robot Character with side Bubble */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {/* Speech Bubble attached to mouth/head */}
                    {!open && (
                        <div style={{
                            position: 'absolute',
                            right: '100%',
                            top: '5px',
                            marginRight: '12px',
                            opacity: bubbleVis ? 1 : 0,
                            transform: bubbleVis ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.95)',
                            transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                            background: isDark 
                                ? 'linear-gradient(135deg, rgba(30,20,50,0.65) 0%, rgba(10,5,25,0.85) 100%)' 
                                : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,255,0.45) 100%)',
                            backdropFilter: 'blur(20px) saturate(160%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                            border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.8)'}`,
                            borderRadius: '20px 20px 0px 20px',
                            padding: '10px 18px',
                            fontSize: 13,
                            fontWeight: 600,
                            color: isDark ? '#e9d5ff' : '#4c1d95',
                            whiteSpace: 'nowrap',
                            boxShadow: isDark 
                                ? 'inset 0 1px 1px rgba(255,255,255,0.05), inset 0 0 20px rgba(139,92,246,0.15), 0 8px 32px rgba(0,0,0,0.3)' 
                                : 'inset 0 1px 1px rgba(255,255,255,1), 0 8px 32px rgba(31,38,135,0.12)',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            zIndex: 2,
                        }}>
                            {BUBBLES[bubbleIdx]}
                            
                            {/* Pointer pointing right to the robot's head */}
                            <div style={{
                                position: 'absolute',
                                right: '-6px',
                                bottom: '6px',
                                width: '12px',
                                height: '12px',
                                background: isDark 
                                    ? 'linear-gradient(135deg, rgba(20,10,35,0.8) 0%, rgba(10,5,25,0.9) 100%)' 
                                    : 'linear-gradient(135deg, rgba(250,250,255,0.5) 0%, rgba(255,255,255,0.8) 100%)',
                                backdropFilter: 'blur(20px)',
                                borderRight: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.8)'}`,
                                borderBottom: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.8)'}`,
                                transform: 'rotate(-45deg)',
                                borderRadius: '2px',
                                boxShadow: isDark ? '4px 4px 10px rgba(0,0,0,0.2)' : '4px 4px 10px rgba(31,38,135,0.05)',
                                zIndex: -1,
                            }} />
                        </div>
                    )}

                    <button
                        ref={triggerBtnRef}
                        onClick={handleClick}
                        style={{
                            width: 65, height: 65,
                            background: 'transparent',
                            border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            position: 'relative',
                            zIndex: 1,
                            outline: 'none',
                        }}
                    >
                        <div style={{ width: '100%', height: '100%' }}>
                            <BabyRobot size={75} isThinking={loading} />
                        </div>
                    </button>
                </div>


            </div>


            {/* ═══════ CHAT PANEL ═══════ */}
            <div
                ref={aiBoxRef}
                style={{
                    position: 'fixed',
                    right: panelRight,
                    bottom: panelBottom,
                    top: panelTop,
                    zIndex: 9998,
                    width: 'min(320px, calc(100vw - 20px))',
                    height: minimized ? 58 : 'min(440px, calc(100vh - 56px))',
                    borderRadius: 22,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: T.panel,
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    boxShadow: T.panelShadow,
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.95)',
                    pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity .28s cubic-bezier(.4,0,.2,1), transform .28s cubic-bezier(.4,0,.2,1), height .28s ease',
                    transformOrigin: 'bottom right',
                }}
            >
                {/* Top gradient accent line */}
                <div className="kai-top-bar" style={{ height: 2, flexShrink: 0 }} />

                {/* ── Header ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 14px', flexShrink: 0,
                    background: T.header,
                    borderBottom: `1px solid ${T.headerBorder}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: '50%', overflow: 'hidden',
                            background: isDark
                                ? 'linear-gradient(145deg,#1e3a6e,#0f172a)'
                                : 'linear-gradient(145deg,#ede9fe,#dbeafe)',
                            border: `1.5px solid ${isDark ? 'rgba(103,232,249,.35)' : 'rgba(139,92,246,.3)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(139,92,246,.4)',
                        }}>
                            <SmallRobot size={24} />
                        </div>
                        <div>
                            <div className="kai-grad-text" style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>KnoblyAI</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: '#10b981' }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 5px #34d399' }} />
                                Online
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                        {/* Minimize */}
                        <button onClick={() => setMinimized(p => !p)} title="Minimize"
                            style={{
                                width: 26, height: 26, borderRadius: '50%', border: `1px solid ${isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'}`,
                                background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)',
                                color: isDark ? '#9ca3af' : '#6b7280',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                transition: 'background .2s, color .2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = T.headerMinHover; e.currentTarget.style.color = '#fbbf24'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280'; }}>
                            <Minus size={13} />
                        </button>
                        {/* Close */}
                        <button onClick={() => { playClickSound(); setOpen(false); }} title="Close"
                            style={{
                                width: 26, height: 26, borderRadius: '50%', border: `1px solid ${isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'}`,
                                background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)',
                                color: isDark ? '#9ca3af' : '#6b7280',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                transition: 'background .2s, color .2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = T.headerCloseHover; e.currentTarget.style.color = '#f87171'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280'; }}>
                            <X size={13} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                {!minimized && (
                    <>
                        {/* Messages */}
                        <div className="kai-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                            {messages.length === 0 ? (
                                /* Welcome state */
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '18px 16px 12px' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 18 }}>
                                        <div style={{
                                            width: 68, height: 68, borderRadius: '50%', margin: '0 auto 12px',
                                            background: isDark ? 'linear-gradient(145deg,#1e3a6e,#0f172a)' : 'linear-gradient(145deg,#ede9fe,#dbeafe)',
                                            border: `2px solid ${isDark ? 'rgba(103,232,249,.35)' : 'rgba(139,92,246,.3)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 0 0 8px rgba(139,92,246,.08), 0 0 24px rgba(109,40,217,.3)',
                                        }}>
                                            <BabyRobot size={48} />
                                        </div>
                                        <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 4, color: T.welcomeText }}>Hello! 👋</h2>
                                        <p style={{ fontSize: 12, color: T.welcomeSub, fontWeight: 500 }}>Your futuristic AI learning companion</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                                        {PROMPTS.map((p, i) => (
                                            <button key={i} onClick={() => send(p)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                    width: '100%', textAlign: 'left', padding: '10px 13px',
                                                    borderRadius: 13, background: T.promptBg,
                                                    border: `1px solid ${T.promptBorder}`,
                                                    color: T.promptColor, fontSize: 13, fontWeight: 500,
                                                    cursor: 'pointer', transition: 'all .2s',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = isDark ? 'rgba(139,92,246,.15)' : 'rgba(139,92,246,.1)';
                                                    e.currentTarget.style.borderColor = isDark ? 'rgba(167,139,250,.5)' : 'rgba(109,40,217,.3)';
                                                    e.currentTarget.style.transform = 'translateX(4px)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = T.promptBg;
                                                    e.currentTarget.style.borderColor = T.promptBorder;
                                                    e.currentTarget.style.transform = '';
                                                }}>
                                                <ArrowUpRight size={14} style={{ color: isDark ? '#a78bfa' : '#7c3aed', flexShrink: 0 }} />
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Messages list */
                                <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {messages.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                            {m.role === 'assistant' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                                                    <div style={{
                                                        width: 20, height: 20, borderRadius: '50%', overflow: 'hidden',
                                                        background: isDark ? 'linear-gradient(145deg,#1e3a6e,#0f172a)' : 'linear-gradient(145deg,#ede9fe,#dbeafe)',
                                                        border: `1px solid ${isDark ? 'rgba(103,232,249,.3)' : 'rgba(139,92,246,.25)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: '0 0 6px rgba(139,92,246,.4)',
                                                    }}><SmallRobot size={14} /></div>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#a78bfa' : '#6d28d9' }}>KnoblyAI</span>
                                                </div>
                                            )}
                                            <div style={m.role === 'user' ? {
                                                background: T.msgUser,
                                                border: `1px solid ${T.msgUserBorder}`,
                                                color: T.msgUserColor,
                                                padding: '9px 14px', borderRadius: 16, borderBottomRightRadius: 4,
                                                maxWidth: '88%', fontSize: 13, lineHeight: 1.55,
                                                boxShadow: isDark ? '0 3px 14px rgba(109,40,217,.2)' : '0 2px 10px rgba(109,40,217,.08)',
                                            } : {
                                                color: T.msg, maxWidth: '100%', fontSize: 13, lineHeight: 1.65, background: 'transparent',
                                            }}>
                                                <SafeAIContent content={m.content} isDark={isDark} />
                                            </div>
                                            {m.navOptions && m.navOptions.length > 0 && (
                                                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {m.navOptions.map((opt, j) => (
                                                        <button key={j} onClick={() => navigateTo(opt.path)}
                                                            style={{
                                                                fontSize: 11, padding: '5px 12px', borderRadius: 999, fontWeight: 600,
                                                                background: T.navBg, border: `1px solid ${T.navBorder}`,
                                                                color: T.navColor, cursor: 'pointer', transition: 'all .2s',
                                                            }}
                                                            onMouseEnter={e => {
                                                                e.currentTarget.style.background = isDark ? 'rgba(139,92,246,.25)' : 'rgba(139,92,246,.15)';
                                                                e.currentTarget.style.boxShadow = '0 0 10px rgba(139,92,246,.3)';
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = T.navBg;
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}>
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Explain Action Buttons */}
                                            {m.explainAction && (
                                                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    <button onClick={() => navigateTo(`/ai/topic/${m.explainAction!.slug}${m.explainAction!.lang ? `?lang=${m.explainAction!.lang}` : ''}`)}
                                                        style={{
                                                            fontSize: 11, padding: '6px 14px', borderRadius: 999, fontWeight: 700,
                                                            background: isDark ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(14,116,144,0.15))' : 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(14,116,144,0.08))',
                                                            border: `1px solid ${isDark ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.25)'}`,
                                                            color: isDark ? '#c4b5fd' : '#6d28d9', cursor: 'pointer', transition: 'all .2s',
                                                            display: 'flex', alignItems: 'center', gap: 5,
                                                            boxShadow: isDark ? '0 2px 10px rgba(139,92,246,0.15)' : '0 2px 8px rgba(139,92,246,0.08)',
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.25)';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.transform = '';
                                                            e.currentTarget.style.boxShadow = isDark ? '0 2px 10px rgba(139,92,246,0.15)' : '0 2px 8px rgba(139,92,246,0.08)';
                                                        }}>
                                                        <FileText size={12} /> View Full Explanation
                                                    </button>
                                                </div>
                                            )}
                                            {/* Related Topics */}
                                            {m.relatedTopics && m.relatedTopics.length > 0 && (
                                                <div style={{ marginTop: 10 }}>
                                                    <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Sparkles size={10} /> Related Topics
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                                        {m.relatedTopics.map((rt, j) => (
                                                            <button key={j} onClick={() => send(rt)}
                                                                style={{
                                                                    fontSize: 10, padding: '4px 10px', borderRadius: 999, fontWeight: 600,
                                                                    background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
                                                                    border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.12)'}`,
                                                                    color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer', transition: 'all .2s',
                                                                }}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)';
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)';
                                                                }}>
                                                                {rt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Typing dots */}
                                    {loading && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                                                <div style={{
                                                    width: 20, height: 20, borderRadius: '50%', overflow: 'hidden',
                                                    background: isDark ? 'linear-gradient(145deg,#1e3a6e,#0f172a)' : 'linear-gradient(145deg,#ede9fe,#dbeafe)',
                                                    border: `1px solid ${isDark ? 'rgba(103,232,249,.3)' : 'rgba(139,92,246,.25)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: '0 0 6px rgba(139,92,246,.4)',
                                                }}><SmallRobot size={14} /></div>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#a78bfa' : '#6d28d9' }}>KnoblyAI</span>
                                            </div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px',
                                                borderRadius: 16, borderBottomLeftRadius: 4,
                                                background: isDark ? 'rgba(139,92,246,.08)' : 'rgba(139,92,246,.06)',
                                                border: `1px solid ${isDark ? 'rgba(139,92,246,.2)' : 'rgba(139,92,246,.15)'}`,
                                            }}>
                                                {(['#67e8f9,#a855f7', '#a855f7,#ec4899', '#ec4899,#67e8f9'] as const).map((c, i) => (
                                                    <span key={i} className={`kai-d${i + 1}`} style={{
                                                        width: 6, height: 6, borderRadius: '50%',
                                                        background: `linear-gradient(135deg,${c})`, display: 'inline-block',
                                                    }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* ── Input ── */}
                        <div style={{
                            flexShrink: 0, padding: '10px 13px 13px',
                            background: isDark ? 'rgba(8,6,24,.55)' : 'rgba(255,255,255,.7)',
                            borderTop: `1px solid ${T.headerBorder}`,
                            backdropFilter: 'blur(12px)',
                        }}>
                            {/* Tags */}
                            {messages.length === 0 && (
                                <div className="kai-noscroll" style={{ display: 'flex', gap: 6, marginBottom: 9, overflowX: 'auto' }}>
                                    {TAGS.map((tag, i) => (
                                        <button key={i} onClick={() => setInput(tag)}
                                            style={{
                                                flexShrink: 0, fontSize: 10, padding: '3px 10px', borderRadius: 999,
                                                fontWeight: 700, letterSpacing: '0.04em',
                                                background: T.tagBg, border: `1px solid ${T.tagBorder}`,
                                                color: T.tagColor, cursor: 'pointer', transition: 'all .2s',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = isDark ? 'rgba(139,92,246,.22)' : 'rgba(139,92,246,.14)';
                                                e.currentTarget.style.boxShadow = '0 0 8px rgba(139,92,246,.3)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = T.tagBg;
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input box */}
                            <div style={{
                                display: 'flex', alignItems: 'center', borderRadius: 16,
                                background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                                overflow: 'hidden', position: 'relative',
                                transition: 'border-color .2s, box-shadow .2s',
                            }}
                                onFocusCapture={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#a855f7';
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px rgba(168,85,247,${isDark ? '.18' : '.13'}), 0 0 16px rgba(168,85,247,${isDark ? '.1' : '.07'})`;
                                }}
                                onBlurCapture={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = T.inputBorder;
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                }}>
                                <textarea
                                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                    value={input}
                                    maxLength={AI_LIMITS.chatMessage}
                                    onChange={e => {
                                        setInput(e.target.value);
                                        e.target.style.height = '46px';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 108) + 'px';
                                    }}
                                    onKeyDown={onKeyDown}
                                    placeholder="Ask Knobly anything..."
                                    style={{
                                        background: 'transparent', outline: 'none', border: 'none',
                                        resize: 'none', flex: 1, color: T.inputColor, fontSize: 13,
                                        lineHeight: input.includes('\n') || input.length > 32 ? '1.5' : '46px',
                                        padding: input.includes('\n') || input.length > 32 ? '12px 42px 12px 14px' : '0 42px 0 14px',
                                        height: 46, minHeight: 46, maxHeight: 108, fontFamily: 'inherit',
                                    }}
                                />
                                <button onClick={() => send()} disabled={!input.trim() || loading}
                                    style={{
                                        position: 'absolute', right: 7, bottom: 7,
                                        width: 30, height: 30, borderRadius: '50%', border: 'none',
                                        background: input.trim() && !loading ? T.sendActive : (isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'),
                                        color: input.trim() && !loading ? '#fff' : (isDark ? '#6b7280' : '#9ca3af'),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: input.trim() && !loading ? 'pointer' : 'default',
                                        transition: 'all .2s', flexShrink: 0,
                                        boxShadow: input.trim() && !loading ? `0 0 10px ${T.sendGlow}` : 'none',
                                        transform: input.trim() && !loading ? 'scale(1)' : 'scale(.92)',
                                    }}
                                    onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = `0 0 18px ${T.sendGlow}`; } }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = input.trim() && !loading ? 'scale(1)' : 'scale(.92)';
                                        e.currentTarget.style.boxShadow = input.trim() && !loading ? `0 0 10px ${T.sendGlow}` : 'none';
                                    }}>
                                    <ArrowUp size={15} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 9.5, color: T.footerText, fontWeight: 500 }}>
                                KnoblyAI can make mistakes. Double-check important replies.
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
