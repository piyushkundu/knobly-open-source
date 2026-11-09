'use client';

import Link from 'next/link';
import { useState } from 'react';

const SHORTCUT_GROUPS = [
    {
        title: 'Windows Shortcuts',
        icon: 'ph-bold ph-windows-logo',
        color: 'text-blue-400',
        gradient: 'from-blue-500 to-cyan-500',
        shortcuts: [
            { keys: 'Ctrl + C', desc: 'Copy selected text or item' },
            { keys: 'Ctrl + V', desc: 'Paste copied text or item' },
            { keys: 'Ctrl + X', desc: 'Cut selected text or item' },
            { keys: 'Ctrl + Z', desc: 'Undo last action' },
            { keys: 'Ctrl + Y', desc: 'Redo last undone action' },
            { keys: 'Ctrl + A', desc: 'Select all items/text' },
            { keys: 'Ctrl + S', desc: 'Save current file' },
            { keys: 'Ctrl + P', desc: 'Print current document' },
            { keys: 'Ctrl + F', desc: 'Find/Search in document' },
            { keys: 'Alt + Tab', desc: 'Switch between open apps' },
            { keys: 'Win + D', desc: 'Show/hide desktop' },
            { keys: 'Win + E', desc: 'Open File Explorer' },
            { keys: 'Win + L', desc: 'Lock computer' },
            { keys: 'Win + R', desc: 'Open Run dialog' },
            { keys: 'Ctrl + Shift + Esc', desc: 'Open Task Manager' },
            { keys: 'Alt + F4', desc: 'Close active window' },
            { keys: 'F2', desc: 'Rename selected item' },
            { keys: 'F5', desc: 'Refresh active window' },
            { keys: 'PrtSc', desc: 'Take screenshot' },
            { keys: 'Win + Shift + S', desc: 'Snipping tool screenshot' },
        ],
    },
    {
        title: 'MS Word Shortcuts',
        icon: 'ph-bold ph-file-doc',
        color: 'text-indigo-400',
        gradient: 'from-indigo-500 to-purple-500',
        shortcuts: [
            { keys: 'Ctrl + B', desc: 'Bold text' },
            { keys: 'Ctrl + I', desc: 'Italic text' },
            { keys: 'Ctrl + U', desc: 'Underline text' },
            { keys: 'Ctrl + E', desc: 'Center align text' },
            { keys: 'Ctrl + L', desc: 'Left align text' },
            { keys: 'Ctrl + R', desc: 'Right align text' },
            { keys: 'Ctrl + J', desc: 'Justify text' },
            { keys: 'Ctrl + N', desc: 'New document' },
            { keys: 'Ctrl + O', desc: 'Open document' },
            { keys: 'Ctrl + H', desc: 'Find and Replace' },
            { keys: 'Ctrl + D', desc: 'Font dialog box' },
            { keys: 'Ctrl + K', desc: 'Insert hyperlink' },
        ],
    },
    {
        title: 'MS Excel Shortcuts',
        icon: 'ph-bold ph-table',
        color: 'text-emerald-400',
        gradient: 'from-emerald-500 to-green-500',
        shortcuts: [
            { keys: 'Ctrl + ;', desc: 'Insert today\'s date' },
            { keys: 'Ctrl + Shift + ;', desc: 'Insert current time' },
            { keys: 'F2', desc: 'Edit active cell' },
            { keys: 'Tab', desc: 'Move to next cell' },
            { keys: 'Ctrl + Home', desc: 'Go to cell A1' },
            { keys: 'Ctrl + End', desc: 'Go to last used cell' },
            { keys: 'Alt + =', desc: 'Auto SUM formula' },
            { keys: 'Ctrl + Shift + L', desc: 'Toggle AutoFilter' },
            { keys: 'Ctrl + Space', desc: 'Select entire column' },
            { keys: 'Shift + Space', desc: 'Select entire row' },
            { keys: 'F11', desc: 'Create chart from selection' },
            { keys: 'Ctrl + `', desc: 'Show/hide formulas' },
        ],
    },
    {
        title: 'MS PowerPoint Shortcuts',
        icon: 'ph-bold ph-presentation-chart',
        color: 'text-red-400',
        gradient: 'from-red-500 to-orange-500',
        shortcuts: [
            { keys: 'F5', desc: 'Start slideshow from beginning' },
            { keys: 'Shift + F5', desc: 'Start from current slide' },
            { keys: 'Ctrl + M', desc: 'Insert new slide' },
            { keys: 'Esc', desc: 'End slideshow' },
            { keys: 'B', desc: 'Black screen during show' },
            { keys: 'W', desc: 'White screen during show' },
            { keys: 'Ctrl + D', desc: 'Duplicate slide' },
            { keys: 'Ctrl + G', desc: 'Group selected objects' },
        ],
    },
    {
        title: 'Browser Shortcuts',
        icon: 'ph-bold ph-globe',
        color: 'text-sky-400',
        gradient: 'from-sky-500 to-blue-500',
        shortcuts: [
            { keys: 'Ctrl + T', desc: 'Open new tab' },
            { keys: 'Ctrl + W', desc: 'Close current tab' },
            { keys: 'Ctrl + Shift + T', desc: 'Reopen closed tab' },
            { keys: 'Ctrl + L', desc: 'Focus address bar' },
            { keys: 'Ctrl + Tab', desc: 'Switch to next tab' },
            { keys: 'Ctrl + Shift + N', desc: 'Open incognito window' },
            { keys: 'F12', desc: 'Open Developer Tools' },
            { keys: 'Ctrl + D', desc: 'Bookmark current page' },
        ],
    },
    {
        title: 'LibreOffice Writer',
        icon: 'ph-bold ph-file-text',
        color: 'text-amber-400',
        gradient: 'from-amber-500 to-yellow-500',
        shortcuts: [
            { keys: 'Ctrl + B', desc: 'Bold text' },
            { keys: 'Ctrl + I', desc: 'Italic text' },
            { keys: 'Ctrl + U', desc: 'Underline text' },
            { keys: 'Ctrl + Shift + P', desc: 'Superscript' },
            { keys: 'Ctrl + Shift + B', desc: 'Subscript' },
            { keys: 'Ctrl + Enter', desc: 'Page break' },
            { keys: 'F7', desc: 'Spell check' },
            { keys: 'Ctrl + F5', desc: 'Open Navigator' },
        ],
    },
];

export default function ShortcutsPage() {
    const [search, setSearch] = useState('');

    const filteredGroups = SHORTCUT_GROUPS.map(group => ({
        ...group,
        shortcuts: group.shortcuts.filter(s =>
            s.keys.toLowerCase().includes(search.toLowerCase()) ||
            s.desc.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter(g => g.shortcuts.length > 0);

    return (
        <div className="min-h-screen text-slate-100 bg-gradient-to-b from-[#0a0a1a] to-[#0f172a] overflow-y-auto">
            <header className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent">
                            Keyboard Shortcuts
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Quick Reference Guide</p>
                    </div>
                    <Link href="/" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all">
                        ← Home
                    </Link>
                </div>
            </header>

            {/* Search */}
            <div className="max-w-6xl mx-auto px-4 pt-6">
                <div className="relative">
                    <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search shortcuts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredGroups.map((group) => (
                        <div key={group.title} className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                            <div className={`theme-fixed bg-gradient-to-r ${group.gradient} px-5 py-3 flex items-center gap-2`}>
                                <i className={`${group.icon} text-white text-lg`} />
                                <h2 className="text-sm font-bold text-white">{group.title}</h2>
                                <span className="ml-auto text-[10px] text-white/70 font-bold">{group.shortcuts.length} shortcuts</span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {group.shortcuts.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between px-5 py-2.5 hover:bg-white/[0.02] transition-colors">
                                        <span className="text-sm text-gray-300">{s.desc}</span>
                                        <kbd className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 whitespace-nowrap">
                                            {s.keys}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
