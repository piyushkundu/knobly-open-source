'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { X, Trash2, Star, Download, Save, Search, Code2, Play, Copy, Pencil, Check, FolderOpen, FolderPlus, Plus, MoreVertical, Menu, Tag, Folder, Settings, FileCode2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SavedCodeItem } from '@/types/python';
import { formatTimestamp, truncateCode } from '@/lib/python-utils';

  
const DEFAULT_FOLDERS = [
  { name: 'Practice', color: '#3b82f6', icon: '📘' },
];

const PRESET_COLORS = ['#ef4444','#f97316','#f59e0b','#84cc16','#10b981','#14b8a6','#06b6d4','#3b82f6','#6366f1','#8b5cf6','#d946ef','#ec4899'];

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function highlightPython(code: string): string {
  let h = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  
  const pattern = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#.*$)|(\b(?:def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|yield|lambda|and|or|not|in|is|True|False|None|pass|break|continue|raise|global|nonlocal|print|input|range|len|int|str|float|list|dict|self|super|enumerate|sorted|reversed|zip|map|filter)\b)|(\b\d+\.?\d*\b)/gm;

  h = h.replace(pattern, (match, pStr, pCm, pKw, pNm) => {
    if (pStr) return `<span style="color:#059669">${pStr}</span>`;
    if (pCm) return `<span style="color:#9ca3af;font-style:italic">${pCm}</span>`;
    if (pKw) return `<span style="color:#7c3aed;font-weight:700">${pKw}</span>`;
    if (pNm) return `<span style="color:#b45309">${pNm}</span>`;
    return match;
  });

  return h.split('\n').map((line, i) =>
    `<span style="color:#d1d5db;font-size:9px;margin-right:10px;user-select:none;display:inline-block;width:18px;text-align:right;border-right:1.5px solid #e5e7eb;padding-right:6px">${i+1}</span>${line}`
  ).join('\n');
}

interface SavedCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  codes: SavedCodeItem[];
  isLoading: boolean;
  onSave: (title: string, code: string, description?: string, folder?: string, lastOutput?: string) => Promise<SavedCodeItem | void | null>;
  onDelete: (id: string) => Promise<void>;
  onToggleImportant: (id: string) => Promise<void>;
  onUpdate?: (id: string, updates: Partial<Pick<SavedCodeItem, 'title' | 'code' | 'description' | 'folder' | 'isImportant' | 'lastOutput'>>) => Promise<void>;
  onSelect: (item: SavedCodeItem) => void;
  onRun?: (code: string) => void;
  onExplain?: (code: string) => void;
  currentCode: string;
  initialShowSaveInput?: boolean;
}

export function SavedCodesModal({
  isOpen, onClose, codes, isLoading, onSave, onDelete, onToggleImportant, onUpdate, onSelect, onRun, onExplain, currentCode, initialShowSaveInput,
}: SavedCodesModalProps) {
  const [activeFolder, setActiveFolder] = useState('all');
  const [saveTitle, setSaveTitle] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [saveFolder, setSaveFolder] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(initialShowSaveInput || false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [customFolders, setCustomFolders] = useState<{ name: string; color: string; icon: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('knobly-custom-folders');
      if (saved) { 
        try { 
          const parsed = JSON.parse(saved); 
          const version = localStorage.getItem('kb-folder-v');
          if (!version) {
            localStorage.setItem('kb-folder-v', '1');
            const newFolders = parsed.filter((f: any) => !['Projects', 'School', 'Experiments'].includes(f.name));
            localStorage.setItem('knobly-custom-folders', JSON.stringify(newFolders));
            return newFolders.length > 0 ? newFolders : [...DEFAULT_FOLDERS];
          }
          return parsed;
        } catch { 
          return [...DEFAULT_FOLDERS]; 
        } 
      }
      localStorage.setItem('knobly-custom-folders', JSON.stringify(DEFAULT_FOLDERS));
    }
    return [...DEFAULT_FOLDERS];
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<{ id: string; item: SavedCodeItem; x: number; y: number } | null>(null);
  const [folderCtxMenu, setFolderCtxMenu] = useState<{ name: string; x: number; y: number } | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderInput, setEditFolderInput] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const toastRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToastMsg(''), 2500);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowSaveInput(initialShowSaveInput || false);
      setSaveTitle(''); setSaveDescription(''); setExpandedId(null); setEditingId(null); setActiveMenu(null); setFolderCtxMenu(null); setEditingFolder(null);
    }
  }, [isOpen, initialShowSaveInput]);

  const saveCustomFolders = (updated: { name: string; color: string; icon: string }[]) => {
    setCustomFolders(updated);
    localStorage.setItem('knobly-custom-folders', JSON.stringify(updated));
  };

  const allFolders = useMemo(() => {
    const s = new Set<string>();
    customFolders.forEach(f => s.add(f.name));
    codes.forEach(c => { if (c.folder) s.add(c.folder); });
    return Array.from(s);
  }, [codes, customFolders]);

  const folderConfig = useMemo(() => {
    const m: Record<string, { color: string; icon: string }> = {};
    customFolders.forEach(f => { m[f.name] = { color: f.color, icon: f.icon }; });
    codes.forEach(c => { if (c.folder && !m[c.folder]) m[c.folder] = { color: '#6b7280', icon: '📁' }; });
    return m;
  }, [codes, customFolders]);

  const folderCounts = useMemo(() => {
    const c: Record<string, number> = { all: codes.length };
    allFolders.forEach(f => { c[f] = codes.filter(x => x.folder === f).length; });
    c.unfiled = codes.filter(x => !x.folder || x.folder === '').length;
    return c;
  }, [codes, allFolders]);

  const filteredCodes = useMemo(() => {
    let r = codes;
    if (activeFolder === 'starred') r = r.filter(c => c.isImportant);
    else if (activeFolder === 'unfiled') r = r.filter(c => !c.folder || c.folder === '');
    else if (activeFolder !== 'all') r = r.filter(c => c.folder === activeFolder);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
    }
    return [...r].sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [codes, activeFolder, searchQuery]);

  const lastSaved = codes.length > 0
    ? relativeTime(codes.reduce((l, c) => c.createdAt > l ? c.createdAt : l, codes[0].createdAt))
    : 'Never';

  const handleSave = async () => {
    if (!currentCode.trim()) return;
    setIsSaving(true);
    await onSave(saveTitle || `Code ${new Date().toLocaleString()}`, currentCode, saveDescription, saveFolder);
    setSaveTitle(''); setSaveDescription(''); setSaveFolder(''); setShowSaveInput(false); setIsSaving(false);
    showToast('✔ Snippet saved!');
  };

  const handleCopy = useCallback(async (id: string, code: string) => {
    try { await navigator.clipboard.writeText(code); } catch {
      const ta = document.createElement('textarea'); ta.value = code; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
    showToast('📋 Copied!');
  }, [showToast]);

  const handleUpdate = async (id: string, updates: any) => {
    if (onUpdate) await onUpdate(id, updates);
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    showToast('🗑 Deleted');
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name || allFolders.includes(name)) return;
    const idx = customFolders.length % PRESET_COLORS.length;
    const icons = ['📁','📂','💼','🗂️','📦','🎯','💡','🌟','🔮','🧩'];
    const nf = { name, color: PRESET_COLORS[idx], icon: icons[idx % icons.length] };
    saveCustomFolders([...customFolders, nf]);
    setNewFolderName(''); setShowCreateFolder(false); setActiveFolder(name);
    showToast(`📁 "${name}" created`);
  };

  const handleDuplicate = async (item: SavedCodeItem) => {
    await onSave(item.title + ' (copy)', item.code, item.description, item.folder, item.lastOutput);
    setActiveMenu(null);
    showToast('📄 Duplicated!');
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap');
        .fm2 * { box-sizing: border-box; margin: 0; padding: 0; }
        .fm2 { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fm2-mono { font-family: 'IBM Plex Mono', monospace; }
        .fm2-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .fm2-scroll::-webkit-scrollbar-track { background: #f8fafc; border-radius: 8px; }
        .fm2-scroll::-webkit-scrollbar-thumb { background: #dde1e7; border-radius: 8px; }
        .fm2-scroll::-webkit-scrollbar-thumb:hover { background: #b8bfca; }
        .fm2-noscroll { scrollbar-width: none; -ms-overflow-style: none; }
        .fm2-noscroll::-webkit-scrollbar { display: none; }
        .fm2-card { background: #ffffff; border: 1.5px solid #edf0f5; border-radius: 16px; overflow: hidden; transition: all 0.2s cubic-bezier(0.4,0,0.2,1); cursor: pointer; position: relative; }
        .fm2-card:hover { border-color: #c7d2fe; box-shadow: 0 6px 24px rgba(99,102,241,0.09), 0 2px 6px rgba(0,0,0,0.04); transform: translateY(-2px); }
        .fm2-card:hover .fm2-reveal { opacity: 1; }
        .fm2-reveal { opacity: 0; transition: opacity 0.18s; }
        .fm2-sb-row { display: flex; align-items: center; gap: 9px; padding: 7px 10px; border-radius: 10px; cursor: pointer; transition: all 0.14s; position: relative; user-select: none; margin-bottom: 2px; }
        .fm2-sb-row:hover { background: #f1f5f9; }
        .fm2-input { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; padding: 8px 12px; outline: none; transition: all 0.18s; width: 100%; }
        .fm2-input:focus { border-color: #818cf8; box-shadow: 0 0 0 3px rgba(129,140,248,0.1); background: #fff; }
        .fm2-input::placeholder { color: #94a3b8; }
        .fm2-list-row { background: #ffffff; border: 1.5px solid #f1f5f9; border-radius: 12px; overflow: hidden; transition: all 0.18s; cursor: pointer; }
        .fm2-list-row:hover { border-color: #c7d2fe; box-shadow: 0 2px 12px rgba(99,102,241,0.07); }
        @keyframes fm2up { from { opacity:0; transform:translateY(10px) scale(0.98); } to { opacity:1; transform:none; } }
        @keyframes fm2in { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.4)', backdropFilter:'blur(6px)', zIndex:200 }} />

      {/* ═══ FULL SCREEN WINDOW ═══ */}
      <div className="fm2" style={{
        position:'fixed', inset:0, zIndex:201,
        display:'flex', flexDirection:'column',
        background:'#ffffff',
      }} onClick={() => { setActiveMenu(null); setFolderCtxMenu(null); }}>

        {/* ── Title Bar ── */}
        <div style={{ height:50, display:'flex', alignItems:'center', padding:'0 18px', gap:12, flexShrink:0, background:'#fafbfc', borderBottom:'1.5px solid #f1f5f9', userSelect:'none' }}>
          <div style={{ display:'flex', gap:7, alignItems:'center' }}>
            {([['#ff5f57','Close'],['#ffbd2e','Min'],['#28ca41','Max']] as [string,string][]).map(([c,label],i) => (
              <div key={i} onClick={i===0?onClose:undefined} title={label} style={{ width:13, height:13, borderRadius:'50%', background:c, cursor:i===0?'pointer':'default', boxShadow:`0 0 0 0.5px ${c}90, 0 1px 2px rgba(0,0,0,0.1)` }} />
            ))}
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:16 }}>🗂</span>
            <span style={{ fontWeight:800, fontSize:13, color:'#475569', letterSpacing:'0.01em' }}>Code Library</span>
            <span style={{ fontSize:10, color:'#94a3b8', fontWeight:600, background:'#f1f5f9', border:'1px solid #e2e8f0', padding:'1px 9px', borderRadius:20 }}>{codes.length} snippets</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ display:'flex', background:'#f1f5f9', borderRadius:9, padding:3, border:'1px solid #e2e8f0', gap:2 }}>
              {([['grid','⊞ Grid'],['list','≡ List']] as [string,string][]).map(([m,lbl]) => (
                <button key={m} onClick={() => setViewMode(m as 'grid'|'list')} style={{ padding:'4px 10px', borderRadius:6, border:'none', cursor:'pointer', fontSize:10, fontWeight:800, background:viewMode===m?'#fff':'transparent', color:viewMode===m?'#4f46e5':'#94a3b8', boxShadow:viewMode===m?'0 1px 4px rgba(0,0,0,0.07)':'none', transition:'all 0.14s' }}>{lbl}</button>
              ))}
            </div>
            <button onClick={() => setShowSaveInput(s => !s)} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:9, background:'linear-gradient(135deg, #4f46e5, #7c3aed)', color:'white', fontSize:11, fontWeight:800, border:'none', cursor:'pointer', boxShadow:'0 3px 12px rgba(79,70,229,0.25)' }}>
              <Plus size={12} strokeWidth={3}/> Save Snippet
            </button>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e2e8f0', background:'white', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={14}/>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ display:'flex', flex:1, overflow:'hidden', minHeight:0 }}>

          {/* ═══ VS Code Style Activity Bar (far left icons) ═══ */}
          <div style={{ width:48, minWidth:48, background:'#f0f1f4', borderRight:'1.5px solid #e2e8f0', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:12, gap:4, flexShrink:0, userSelect:'none' }}>
            <button onClick={() => setIsSidebarCollapsed(s => !s)} title="Explorer" style={{ width:38, height:38, borderRadius:10, border:'none', background: !isSidebarCollapsed ? '#ffffff' : 'transparent', color: !isSidebarCollapsed ? '#4f46e5' : '#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s', boxShadow: !isSidebarCollapsed ? '0 2px 8px rgba(79,70,229,0.10)' : 'none' }}
              onMouseEnter={e => { if(isSidebarCollapsed) e.currentTarget.style.background='#e8eaef'; }} onMouseLeave={e => { if(isSidebarCollapsed) e.currentTarget.style.background='transparent'; }}>
              <Folder size={20} />
            </button>
            <button onClick={() => { setActiveFolder('all'); if(isSidebarCollapsed) setIsSidebarCollapsed(false); }} title="All Snippets" style={{ width:38, height:38, borderRadius:10, border:'none', background: activeFolder==='all' && !isSidebarCollapsed ? '#eef2ff' : 'transparent', color: activeFolder==='all' ? '#4f46e5' : '#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = activeFolder==='all' && !isSidebarCollapsed ? '#eef2ff' : '#e8eaef'} onMouseLeave={e => e.currentTarget.style.background = activeFolder==='all' && !isSidebarCollapsed ? '#eef2ff' : 'transparent'}>
              <FileCode2 size={19} />
            </button>
            <button onClick={() => setActiveFolder('starred')} title={`Starred (${codes.filter(c=>c.isImportant).length})`} style={{ width:38, height:38, borderRadius:10, border:'none', background: activeFolder==='starred' ? '#fef3c7' : 'transparent', color:'#f59e0b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s', opacity: activeFolder==='starred' ? 1 : 0.6, boxShadow: activeFolder==='starred' ? '0 2px 8px rgba(245,158,11,0.12)' : 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = activeFolder==='starred' ? '#fef3c7' : '#e8eaef'; e.currentTarget.style.opacity='1'; }} onMouseLeave={e => { e.currentTarget.style.background = activeFolder==='starred' ? '#fef3c7' : 'transparent'; e.currentTarget.style.opacity = activeFolder==='starred' ? '1' : '0.6'; }}>
              <Star size={19} />
            </button>
            <div style={{ flex:1 }} />
            <button onClick={() => { setShowCreateFolder(true); if(isSidebarCollapsed) setIsSidebarCollapsed(false); }} title="New Folder" style={{ width:38, height:38, borderRadius:10, border:'none', background:'transparent', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, transition:'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#e8eaef'; e.currentTarget.style.color='#4f46e5'; }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#94a3b8'; }}>
              <FolderPlus size={19} />
            </button>
          </div>

          {/* ═══ Sidebar Panel (togglable like VS Code) ═══ */}
          <div style={{ width: isSidebarCollapsed ? 0 : 210, minWidth: isSidebarCollapsed ? 0 : 210, overflow:'hidden', transition:'all 0.24s cubic-bezier(0.4,0,0.2,1)', background:'#fafbfc', borderRight: isSidebarCollapsed ? 'none' : '1.5px solid #f1f5f9', display:'flex', flexDirection:'column', flexShrink:0 }}>
            <div style={{ width:210, height:'100%', display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'15px 14px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:9, fontWeight:900, color:'#b8c0cc', letterSpacing:'0.15em', textTransform:'uppercase' }}>📁 Folders</span>
                <button onClick={() => setShowCreateFolder(true)} style={{ width:24, height:24, borderRadius:7, border:'1.5px solid #e2e8f0', background:'#fff', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }} title="New Folder"><Plus size={11} strokeWidth={2.5}/></button>
              </div>
              <div className="fm2-scroll" style={{ flex:1, overflowY:'auto', padding:'2px 8px 12px' }}>
                <FM2SidebarItem id="all" label="All Snippets" icon="◈" color="#4f46e5" count={folderCounts.all} isActive={activeFolder==='all'} onClick={() => setActiveFolder('all')} onDrop={(cid: string) => handleUpdate(cid,{folder:''})} />
                <FM2SidebarItem id="unfiled" label="Unfiled" icon="◎" color="#f97316" count={folderCounts.unfiled||0} isActive={activeFolder==='unfiled'} onClick={() => setActiveFolder('unfiled')} onDrop={(cid: string) => handleUpdate(cid,{folder:''})} />
                {allFolders.length>0 && <div style={{ height:1, background:'#f1f5f9', margin:'8px 4px' }}/>}
                {allFolders.map(name => {
                  const cfg = folderConfig[name];
                  return editingFolder===name ? (
                    <div key={name} style={{ display:'flex', gap:4, alignItems:'center', padding:'5px 8px', background:'#eef2ff', border:'1.5px solid #c7d2fe', borderRadius:9, marginBottom:2 }}>
                      <input className="fm2-input" value={editFolderInput} onChange={e => setEditFolderInput(e.target.value)} autoFocus style={{ padding:'3px 8px', fontSize:11, height:26 }}
                        onKeyDown={e => {
                          if (e.key==='Enter') {
                            const t = editFolderInput.trim();
                            if (t && t!==name) {
                              saveCustomFolders(customFolders.map(f => f.name===name?{...f,name:t}:f));
                              codes.filter(c => c.folder===name).forEach(c => { if(onUpdate) onUpdate(c.id, {folder:t}); });
                              if (activeFolder===name) setActiveFolder(t);
                            }
                            setEditingFolder(null);
                          }
                          if (e.key==='Escape') setEditingFolder(null);
                        }} />
                      <button onClick={() => setEditingFolder(null)} style={{color:'#94a3b8',background:'none',border:'none',cursor:'pointer'}}><X size={12}/></button>
                    </div>
                  ) : (
                    <FM2SidebarItem key={name} id={name} label={name} icon={cfg.icon} color={cfg.color} count={folderCounts[name]||0} isActive={activeFolder===name} onClick={() => setActiveFolder(name)} onDrop={(cid: string) => handleUpdate(cid,{folder:name})}
                      onContextMenu={(e: React.MouseEvent) => { e.preventDefault(); setFolderCtxMenu({name,x:e.clientX,y:e.clientY}); }} />
                  );
                })}
                {showCreateFolder && (
                  <div style={{ margin:'8px 2px 4px', padding:11, background:'#fafafe', border:'1.5px solid #c7d2fe', borderRadius:12 }}>
                    <input className="fm2-input" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name…" autoFocus style={{ padding:'5px 10px', fontSize:11, marginBottom:7 }}
                      onKeyDown={e => { if(e.key==='Enter') handleCreateFolder(); if(e.key==='Escape') setShowCreateFolder(false); }} />
                    <div style={{ display:'flex', gap:5 }}>
                      <button onClick={handleCreateFolder} style={{ flex:1, padding:'5px 0', borderRadius:7, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', fontSize:10, fontWeight:800 }}>Create</button>
                      <button onClick={() => setShowCreateFolder(false)} style={{ padding:'5px 9px', borderRadius:7, border:'1.5px solid #e2e8f0', background:'white', color:'#94a3b8', fontSize:10, fontWeight:700, cursor:'pointer' }}>✕</button>
                    </div>
                  </div>
                )}
                {!showCreateFolder && (
                  <button onClick={() => setShowCreateFolder(true)} style={{ width:'100%', marginTop:10, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'7px 0', borderRadius:10, border:'1.5px dashed #c7d2fe', background:'transparent', color:'#818cf8', fontSize:10, fontWeight:800, cursor:'pointer' }}>
                    <FolderPlus size={12}/> New Folder
                  </button>
                )}
                <div style={{ marginTop:18, padding:'12px 10px', background:'#ffffff', border:'1.5px solid #f1f5f9', borderRadius:12 }}>
                  <div style={{ fontSize:9, fontWeight:900, color:'#d1d5db', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:9 }}>Overview</div>
                  {[
                    { label:'Total', val:codes.length, color:'#4f46e5', sym:'◈' },
                    { label:'Starred', val:codes.filter(c => c.isImportant).length, color:'#f59e0b', sym:'★' },
                    { label:'Folders', val:allFolders.length, color:'#10b981', sym:'◉' },
                  ].map(s => (
                    <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'3px 2px' }}>
                      <span style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}><span style={{ color:s.color, marginRight:5, fontSize:11 }}>{s.sym}</span>{s.label}</span>
                      <span className="fm2-mono" style={{ fontSize:12, color:s.color, fontWeight:700 }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, background:'#f8fafc' }}>
            {/* Toolbar */}
            <div style={{ padding:'11px 16px', borderBottom:'1.5px solid #f1f5f9', background:'#ffffff', flexShrink:0 }}>
              <AnimatePresence>
                {showSaveInput && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{ overflow:'hidden' }}>
                    <div style={{ padding:14, marginBottom:11, background:'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)', border:'1.5px solid #c7d2fe', borderRadius:14 }}>
                      <div style={{ display:'flex', gap:8, marginBottom:9 }}>
                        <input className="fm2-input" value={saveTitle} onChange={e => setSaveTitle(e.target.value)} placeholder="Snippet title…" autoFocus onKeyDown={e => e.key==='Enter'&&handleSave()} style={{ flex:1 }} />
                        <select value={saveFolder} onChange={e => setSaveFolder(e.target.value)} className="fm2-input" style={{ width:'auto', paddingLeft:10, paddingRight:10, cursor:'pointer' }}>
                          <option value="">📄 Unfiled</option>
                          {allFolders.map(f => <option key={f} value={f}>{folderConfig[f]?.icon} {f}</option>)}
                        </select>
                        <button onClick={handleSave} disabled={isSaving} style={{ padding:'0 18px', borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', fontSize:12, fontWeight:800, whiteSpace:'nowrap', boxShadow:'0 4px 14px rgba(79,70,229,0.28)', minWidth:90 }}>{isSaving?'…':'💾 Save'}</button>
                        <button onClick={() => { setShowSaveInput(false); setSaveTitle(''); setSaveDescription(''); }} style={{ width:36, borderRadius:10, border:'1.5px solid #e2e8f0', background:'white', color:'#94a3b8', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
                      </div>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <textarea className="fm2-input" value={saveDescription} onChange={e => setSaveDescription(e.target.value)} placeholder="Description (optional)…" style={{ flex:1, height:40, resize:'none', padding:'8px 12px' }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); } }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                <button onClick={() => setSidebarOpen(p => !p)} style={{ width:34, height:34, borderRadius:9, flexShrink:0, border:'1.5px solid #e2e8f0', background:'white', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Menu size={14}/></button>
                <div style={{ position:'relative', flex:1 }}>
                  <Search size={13} color="#94a3b8" style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input className="fm2-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search snippets, tags, code…" style={{ paddingLeft:32, height:34, fontSize:12 }} />
                </div>
                <div className="fm2-noscroll" style={{ display:'flex', gap:5, overflowX:'auto' }}>
                  {/* Tag filters removed */}
                </div>
              </div>
            </div>

            {/* ── Code Grid / List ── */}
            <div className="fm2-scroll" style={{ flex:1, overflowY:'auto', padding:16 }}>
              {isLoading ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:300, gap:14 }}>
                  <div style={{ width:40, height:40, border:'3px solid #4f46e5', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600 }}>Loading snippets...</span>
                </div>
              ) : filteredCodes.length === 0 ? (
                <FM2EmptyState codesLength={codes.length} onNew={() => setShowSaveInput(true)} />
              ) : viewMode === 'grid' ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(268px,1fr))', gap:13 }}>
                  {filteredCodes.map((item, idx) => (
                    <FM2CodeCard key={item.id} item={item} idx={idx} folderConfig={folderConfig} expandedId={expandedId} setExpandedId={setExpandedId} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} setEditingId={setEditingId} copiedId={copiedId} onCopy={handleCopy} onStar={onToggleImportant}
                      onDelete={(id: string) => setConfirmAction({message:'Delete this snippet?',onConfirm:() => handleDelete(id)})}
                      onRename={(it: SavedCodeItem) => { setEditingId(it.id); setEditTitle(it.title); }}
                      onSaveRename={(id: string) => { if(editTitle.trim()) handleUpdate(id,{title:editTitle.trim()}); setEditingId(null); }}
                      onRun={onRun ? (code: string) => { onSelect(item); onRun(code); onClose(); } : undefined}
                      onMenu={(e: React.MouseEvent, it: SavedCodeItem) => { e.stopPropagation(); const r=(e.target as HTMLElement).getBoundingClientRect(); setActiveMenu({id:it.id,item:it,x:r.right,y:r.bottom+4}); setFolderCtxMenu(null); }}
                      activeMenuId={activeMenu?.id || null} />
                  ))}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {filteredCodes.map((item, idx) => (
                    <FM2ListRow key={item.id} item={item} idx={idx} folderConfig={folderConfig} copiedId={copiedId} onCopy={handleCopy} onStar={onToggleImportant}
                      onDelete={(id: string) => setConfirmAction({message:'Delete this snippet?',onConfirm:() => handleDelete(id)})}
                      onRun={onRun ? (code: string) => { onSelect(item); onRun(code); onClose(); } : undefined}
                      expandedId={expandedId} setExpandedId={setExpandedId} />
                  ))}
                </div>
              )}
              {filteredCodes.length > 0 && (
                <div style={{ textAlign:'center', padding:'28px 0 10px', color:'#94a3b8' }}>
                  <div style={{ fontSize:18, marginBottom:4, opacity:0.4 }}>· · ·</div>
                  <div style={{ fontSize:9, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', color:'#cbd5e1' }}>{filteredCodes.length} snippet{filteredCodes.length!==1?'s':''} · end of results</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Status Bar ── */}
        <div style={{ height:28, display:'flex', alignItems:'center', padding:'0 16px', gap:18, flexShrink:0, background:'#fafbfc', borderTop:'1.5px solid #f1f5f9' }}>
          {[
            { label:'🐍 Python', color:'#10b981' },
            { label:`${filteredCodes.length} visible`, color:'#94a3b8' },
            { label:`Saved: ${lastSaved}`, color:'#94a3b8' },
            { label:`${codes.filter(c => c.isImportant).length} starred ★`, color:'#f59e0b' },
          ].map((s,i) => (
            <span key={i} className="fm2-mono" style={{ fontSize:9, color:s.color, fontWeight:700 }}>{s.label}</span>
          ))}
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div key="toast" initial={{opacity:0,y:16,scale:0.92}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8}}
              style={{ position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)', background:'#1e293b', color:'#f8fafc', borderRadius:30, padding:'7px 18px', fontSize:11, fontWeight:700, boxShadow:'0 8px 24px rgba(15,23,42,0.14)', pointerEvents:'none', zIndex:999, whiteSpace:'nowrap' }}>
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Confirm Modal ── */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.3)', backdropFilter:'blur(4px)' }} onClick={() => setConfirmAction(null)}>
            <motion.div initial={{scale:0.93,y:8}} animate={{scale:1,y:0}} exit={{scale:0.93,y:8}} onClick={e => e.stopPropagation()} style={{ background:'#fff', border:'1.5px solid #fecdd3', borderRadius:18, padding:28, width:310, textAlign:'center', boxShadow:'0 30px 60px rgba(15,23,42,0.12)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'#fff1f2', border:'1.5px solid #fecdd3', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><Trash2 size={22} color="#ef4444"/></div>
              <div style={{ fontSize:16, fontWeight:800, color:'#1e293b', marginBottom:6 }}>Delete Snippet?</div>
              <p style={{ fontSize:12, color:'#64748b', marginBottom:20, lineHeight:1.6 }}>{confirmAction.message}</p>
              <div style={{ display:'flex', gap:9 }}>
                <button onClick={() => setConfirmAction(null)} style={{ flex:1, padding:'9px 0', borderRadius:10, border:'1.5px solid #e2e8f0', background:'white', color:'#64748b', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancel</button>
                <button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} style={{ flex:1, padding:'9px 0', borderRadius:10, border:'none', background:'#ef4444', color:'white', fontSize:12, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 14px rgba(239,68,68,0.28)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Folder Context Menu ── */}
      <AnimatePresence>
        {folderCtxMenu && (
          <motion.div initial={{opacity:0,scale:0.95,y:5}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:5}} onClick={e => e.stopPropagation()} 
            style={{ position:'fixed', top:folderCtxMenu.y, left:folderCtxMenu.x, zIndex:9999, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(16px)', border:'1px solid rgba(226,232,240,0.9)', borderRadius:16, boxShadow:'0 20px 40px -8px rgba(15,23,42,0.15), 0 0 0 1px rgba(15,23,42,0.02)', width:196, padding: 6, display:'flex', flexDirection:'column', gap:2 }}>
            
            <button
              onClick={() => { setEditingFolder(folderCtxMenu.name); setEditFolderInput(folderCtxMenu.name); setFolderCtxMenu(null); }} 
              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', border:'none', background:'transparent', color:'#334155', fontSize:12, fontWeight:600, borderRadius:10, cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
            >
              <Pencil size={14} color="#64748b" /> Rename Folder
            </button>
            
            <button 
              onClick={() => { const name=folderCtxMenu.name; setFolderCtxMenu(null); setConfirmAction({message:`Delete folder "${name}"?`, onConfirm:() => { saveCustomFolders(customFolders.filter(f => f.name!==name)); codes.filter(c => c.folder===name).forEach(c => { if(onUpdate) onUpdate(c.id, {folder:''}); }); if(activeFolder===name) setActiveFolder('all'); }}); }} 
              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', border:'none', background:'transparent', color:'#ef4444', fontSize:12, fontWeight:600, borderRadius:10, cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 size={14} color="#ef4444" /> Delete Folder
            </button>

            <div style={{ height:1, background:'rgba(226,232,240,0.8)', margin:'4px 2px' }} />
            
            <div style={{ padding:'6px 6px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8, paddingLeft:4 }}>Folder Color</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center' }}>
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => { saveCustomFolders(customFolders.map(f => f.name===folderCtxMenu.name?{...f,color:c}:f)); setFolderCtxMenu(null); }} 
                  style={{ width:18, height:18, borderRadius:'50%', border:'1px solid rgba(0,0,0,0.05)', cursor:'pointer', background:c, transition:'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow:'inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.1)'; }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3-dot Menu ── */}
      <AnimatePresence>
        {activeMenu && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setActiveMenu(null)} style={{ position:'fixed', inset:0, zIndex:9997 }}/>
            <motion.div initial={{opacity:0,scale:0.95,y:-5}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:-5}} onClick={e => e.stopPropagation()}
              style={{ position:'fixed', top:activeMenu.y, left:Math.min(activeMenu.x-200, (typeof window!=='undefined'?window.innerWidth:800)-220), zIndex:9998, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:12, overflow:'hidden', width:200, boxShadow:'0 12px 40px rgba(15,23,42,0.12)' }}>
              {[
                {label:'✏️ Rename', action:() => { setEditingId(activeMenu.id); setEditTitle(activeMenu.item.title); setActiveMenu(null); }},
                {label:'📋 Copy Code', action:() => { handleCopy(activeMenu.id, activeMenu.item.code); setActiveMenu(null); }},
                {label:'📄 Duplicate', action:() => { handleDuplicate(activeMenu.item); }},
                {label:'🗑 Delete', danger:true, action:() => { setConfirmAction({message:'Delete this snippet?',onConfirm:() => handleDelete(activeMenu.id)}); setActiveMenu(null); }},
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{ width:'100%', padding:'9px 14px', border:'none', background:'transparent', color:(item as any).danger?'#ef4444':'#475569', fontSize:11, fontWeight:700, textAlign:'left', cursor:'pointer', display:'block' }}>{item.label}</button>
              ))}
              <div style={{ padding:'6px 12px', borderTop:'1px solid #f1f5f9' }}>
                <div style={{ fontSize:9, fontWeight:800, color:'#cbd5e1', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Move to</div>
                {[{name:'unfiled',icon:'📄',label:'Unfiled'},...allFolders.map(f => ({name:f,icon:folderConfig[f]?.icon||'📁',label:f}))].map(f => (
                  <button key={f.name} onClick={() => { handleUpdate(activeMenu.id,{folder:f.name==='unfiled'?'':f.name}); setActiveMenu(null); showToast(`📁 Moved to ${f.label}`); }}
                    style={{ padding:'5px 8px', borderRadius:7, border:'none', background:'transparent', color:'#64748b', fontSize:11, fontWeight:600, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:6, width:'100%' }}>
                    <span style={{ fontSize:13 }}>{f.icon}</span> {f.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sub-Components ───

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  color: string;
  onClick: () => void;
  onDrop: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
}

function FM2SidebarItem({ id, label, icon, count, isActive, color, onClick, onDrop, onContextMenu, isCollapsed }: SidebarItemProps) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div onClick={onClick} onContextMenu={onContextMenu}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); const cid = e.dataTransfer.getData('code_id'); if (cid && onDrop) onDrop(cid); }}
      className="fm2-sb-row group"
      style={{
        background: isActive ? `${color}10` : dragOver ? '#f1f5f9' : 'transparent',
        borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
        paddingLeft: isCollapsed ? 0 : 10,
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        padding: isCollapsed ? '9px 0' : '7px 10px',
      }}
      title={isCollapsed ? label : undefined}
    >
      <span style={{ fontSize: 16, flexShrink: 0, opacity: isActive ? 1 : 0.6, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>
      {!isCollapsed && (
        <>
          <span style={{ flex: 1, fontSize: 11, fontWeight: isActive ? 800 : 600, color: isActive ? color : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.14s' }}>{label}</span>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 7px', borderRadius: 20, minWidth: 20, textAlign: 'center', background: isActive ? `${color}14` : '#f1f5f9', color: isActive ? color : '#94a3b8', border: `1px solid ${isActive ? color + '28' : '#e2e8f0'}` }}>{count}</span>
          {onContextMenu && (
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onContextMenu(e); }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? color : '#94a3b8', opacity: 0.6, padding: 2, borderRadius: 4, marginLeft: 2 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
              <MoreVertical size={13} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface CodeCardProps {
  item: SavedCodeItem;
  idx: number;
  folderConfig: Record<string, { color: string; icon: string }>;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (t: string) => void;
  setEditingId: (id: string | null) => void;
  copiedId: string | null;
  onCopy: (id: string, code: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (item: SavedCodeItem) => void;
  onSaveRename: (id: string) => void;
  onRun?: (code: string) => void;
  onMenu: (e: React.MouseEvent, item: SavedCodeItem) => void;
  activeMenuId: string | null;
}

function FM2CodeCard({ item, idx, folderConfig, expandedId, setExpandedId, editingId, editTitle, setEditTitle, setEditingId, copiedId, onCopy, onStar, onDelete, onRename, onSaveRename, onRun, onMenu, activeMenuId }: CodeCardProps) {
  const isExpanded = expandedId === item.id;
  const cfg = item.folder ? folderConfig[item.folder] : null;
  const lines = item.code.split('\n').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(idx * 0.04, 0.3), ease: [0.4, 0, 0.2, 1] }}
      className="fm2-card"
      draggable
      {...{ onDragStart: (e: any) => e.dataTransfer?.setData('code_id', item.id) } as any}
      onClick={() => setExpandedId(isExpanded ? null : item.id)}
    >
      <div style={{ height: 3, background: cfg ? `linear-gradient(90deg, ${cfg.color}, ${cfg.color}55)` : `linear-gradient(90deg, #4f46e5, #7c3aed)` }} />
      <div style={{ padding: '12px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingId === item.id ? (
              <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
                <input style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #818cf8', borderRadius: 7, color: '#1e293b', fontSize: 11, fontWeight: 700, padding: '3px 8px', outline: 'none', boxShadow: '0 0 0 3px rgba(129,140,248,0.1)' }} value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus onKeyDown={e => { if (e.key === 'Enter') onSaveRename(item.id); if (e.key === 'Escape') setEditingId(null); }} />
                <button onClick={() => onSaveRename(item.id)} style={{ padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#4f46e5', color: 'white', fontSize: 11 }}><Check size={11} /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {item.isImportant && <Star size={11} color="#f59e0b" fill="#f59e0b" style={{ flexShrink: 0 }} />}
                <h3 style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</h3>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <button onClick={e => { e.stopPropagation(); onStar(item.id); }} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.isImportant ? '#f59e0b' : '#dde1e7', transition: 'all 0.14s' }}>
              <Star size={12} fill={item.isImportant ? '#f59e0b' : 'none'} />
            </button>
            <button onClick={e => { e.stopPropagation(); onMenu(e, item); }} className="fm2-reveal" style={{ width: 24, height: 24, borderRadius: 6, cursor: 'pointer', border: '1px solid #f1f5f9', background: activeMenuId === item.id ? '#eef2ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.14s' }}>
              <MoreVertical size={12} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 9 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1px 7px', borderRadius: 20 }}>🕒 {relativeTime(item.createdAt)}</span>
          {cfg && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: `${cfg.color}10`, border: `1px solid ${cfg.color}22`, color: cfg.color }}>{cfg.icon} {item.folder}</span>}
          <span className="fm2-mono" style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1px 7px', borderRadius: 20, marginLeft: 'auto' }}>{lines}L</span>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 10, border: '1.5px solid #edf0f5', overflow: 'hidden', marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', background: '#f1f5f9', borderBottom: '1px solid #e8ecf0', gap: 5 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['#ff5f57', '#ffbd2e', '#28ca41'].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.6 }} />)}
            </div>
            <span style={{ fontSize: 8, fontWeight: 900, color: '#c4cbd4', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, textAlign: 'center' }}>python</span>
            <button onClick={e => { e.stopPropagation(); onCopy(item.id, item.code); }} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: copiedId === item.id ? '#10b981' : '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: '2px 6px', borderRadius: 5, transition: 'color 0.14s' }}>
              {copiedId === item.id ? <><Check size={9} /> Copied</> : <><Copy size={9} /> Copy</>}
            </button>
          </div>
          <pre className="fm2-mono" style={{ margin: 0, padding: '8px 12px', fontSize: 10.5, lineHeight: 1.65, color: '#374151', overflow: 'hidden', maxHeight: isExpanded ? 'none' : 78, transition: 'max-height 0.28s ease', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#fafbfc' }} dangerouslySetInnerHTML={{ __html: highlightPython(item.code) }} />
          {!isExpanded && lines > 4 && (
            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textAlign: 'center', padding: '3px', borderTop: '1px solid #f1f5f9', background: 'linear-gradient(to bottom, #fafbfc, #f4f6f9)' }}>▾ {lines - 4} more lines</div>
          )}
        </div>

        {item.description && (
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </div>
        )}

        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
          {onRun && (
            <button onClick={() => onRun(item.code)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 11px', borderRadius: 8, border: '1.5px solid #bbf7d0', background: '#f0fdf4', color: '#16a34a', fontSize: 10, fontWeight: 800, cursor: 'pointer', transition: 'all 0.14s' }}><Play size={9} fill="#16a34a" /> Run</button>
          )}
          <button onClick={() => onRename(item)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 11px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.14s' }}><Pencil size={9} /> Edit</button>
          <button onClick={() => onDelete(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 11px', borderRadius: 8, border: '1.5px solid #fecdd3', background: '#fff1f2', color: '#ef4444', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.14s', marginLeft: 'auto' }}><Trash2 size={9} /></button>
        </div>
      </div>
    </motion.div>
  );
}

interface ListRowProps {
  item: SavedCodeItem;
  idx: number;
  folderConfig: Record<string, { color: string; icon: string }>;
  copiedId: string | null;
  onCopy: (id: string, code: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onRun?: (code: string) => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

function FM2ListRow({ item, idx, folderConfig, copiedId, onCopy, onStar, onDelete, onRun, expandedId, setExpandedId }: ListRowProps) {
  const cfg = item.folder ? folderConfig[item.folder] : null;
  const isExpanded = expandedId === item.id;
  return (
    <div className="fm2-list-row" style={{ animation: `fm2in 0.22s ${Math.min(idx * 0.03, 0.2)}s ease both` }} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '9px 14px', gap: 10 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg?.icon || '🐍'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            {item.isImportant && <Star size={10} color="#f59e0b" fill="#f59e0b" />}
            <span style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{item.title}</span>
            {item.description && <span style={{ fontSize: 10, color: '#94a3b8', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>- {item.description}</span>}
          </div>
          <div className="fm2-mono" style={{ fontSize: 10, color: '#94a3b8' }}>
            {item.code.split('\n')[0].slice(0, 70)}{item.code.split('\n')[0].length > 70 ? '…' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 600 }}>{relativeTime(item.createdAt)}</span>
          {cfg && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 9, background: `${cfg.color}10`, color: cfg.color, border: `1px solid ${cfg.color}20` }}>{cfg.icon} {item.folder}</span>}
          <button onClick={e => { e.stopPropagation(); onCopy(item.id, item.code); }} style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid #e2e8f0', background: 'white', color: copiedId === item.id ? '#10b981' : '#94a3b8', cursor: 'pointer', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>{copiedId === item.id ? <><Check size={9} />✓</> : <Copy size={9} />}</button>
          <button onClick={e => { e.stopPropagation(); onStar(item.id); }} style={{ padding: '4px', borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer' }}><Star size={12} color={item.isImportant ? '#f59e0b' : '#e2e8f0'} fill={item.isImportant ? '#f59e0b' : 'none'} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(item.id); }} style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid #fecdd3', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', fontSize: 9, display: 'flex', alignItems: 'center' }}><Trash2 size={10} /></button>
        </div>
      </div>
      {isExpanded && (
        <div style={{ borderTop: '1.5px solid #f1f5f9', background: '#f8fafc', padding: '10px 14px' }}>
          <pre className="fm2-mono" style={{ margin: 0, fontSize: 11, lineHeight: 1.7, color: '#374151', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: highlightPython(item.code) }} />
        </div>
      )}
    </div>
  );
}

function FM2EmptyState({ codesLength, onNew }: { codesLength: number, onNew: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300, textAlign: 'center', gap: 14 }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 4px 20px rgba(79,70,229,0.07)' }}>{codesLength === 0 ? '🚀' : '🔍'}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#334155', marginBottom: 5, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{codesLength === 0 ? 'No snippets yet' : 'No results found'}</div>
        <p style={{ fontSize: 12, color: '#94a3b8', maxWidth: 210, lineHeight: 1.6 }}>{codesLength === 0 ? 'Save your first Python snippet to get started' : 'Try adjusting your search or filters'}</p>
      </div>
      {codesLength === 0 && (
        <button onClick={onNew} style={{ padding: '10px 22px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', fontSize: 12, fontWeight: 800, boxShadow: '0 4px 18px rgba(79,70,229,0.25)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
          <Plus size={13} strokeWidth={3} /> Save First Snippet
        </button>
      )}
    </div>
  );
}
