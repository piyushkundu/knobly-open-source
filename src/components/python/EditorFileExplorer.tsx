'use client';

import { useState, useMemo, useCallback } from 'react';
import { Folder, FileCode2, ChevronRight, ChevronDown, Plus, FolderPlus, Trash2, Pencil, X, Search, Star, MoreVertical, File, Code2, Info, Keyboard, Sparkles, FolderTree } from 'lucide-react';
import { SavedCodeItem } from '@/types/python';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorFileExplorerProps {
  codes: SavedCodeItem[];
  isLoggedIn: boolean;
  onSelectFile: (item: SavedCodeItem) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, updates: Partial<Pick<SavedCodeItem, 'title' | 'code' | 'description' | 'folder' | 'isImportant' | 'lastOutput'>>) => Promise<void>;
  onSave: (title: string, code: string, description?: string, folder?: string, lastOutput?: string) => Promise<SavedCodeItem | void | null>;
  onLoginRequired: () => void;
  activeFileId: string | null;
  onLanguageSwitch?: (lang: 'python' | 'c') => void;
}

interface TreeFolder {
  name: string;
  files: SavedCodeItem[];
}

export function EditorFileExplorer({
  codes, isLoggedIn, onSelectFile, onDelete, onUpdate, onSave, onLoginRequired, activeFileId, onLanguageSwitch,
}: EditorFileExplorerProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['__unfiled__']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [creatingIn, setCreatingIn] = useState<string | null>(null); // folder name or '__root__'
  const [newFileName, setNewFileName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null); // null = not creating, '' = root, 'folderName' = inside that folder
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number; item: SavedCodeItem } | null>(null);
  const [defaultLang, setDefaultLang] = useState<'python' | 'c'>('python');
  const [showInfo, setShowInfo] = useState(false);

  // Build tree structure from codes
  const tree = useMemo(() => {
    const folders: Record<string, SavedCodeItem[]> = {};
    const unfiled: SavedCodeItem[] = [];

    let filtered = codes;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }

    filtered.forEach(c => {
      if (c.folder && c.folder.trim()) {
        if (!folders[c.folder]) folders[c.folder] = [];
        folders[c.folder].push(c);
      } else {
        unfiled.push(c);
      }
    });

    const result: TreeFolder[] = [];
    Object.keys(folders).sort().forEach(name => {
      result.push({ name, files: folders[name].sort((a, b) => a.title.localeCompare(b.title)) });
    });
    if (unfiled.length > 0) {
      result.push({ name: '__unfiled__', files: unfiled.sort((a, b) => a.title.localeCompare(b.title)) });
    }
    return result;
  }, [codes, searchQuery]);

  const toggleFolder = useCallback((name: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleCreateFile = useCallback(async (folder: string) => {
    if (!isLoggedIn) { onLoginRequired(); return; }
    const name = newFileName.trim();
    if (!name) return;
    const fileName = name.endsWith('.py') || name.endsWith('.c') || name.endsWith('.h') ? name : name + (defaultLang === 'c' ? '.c' : '.py');
    const targetFolder = folder === '__unfiled__' || folder === '__root__' ? '' : folder;
    const isCLang = fileName.endsWith('.c') || fileName.endsWith('.h');
    const defaultCode = isCLang ? `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n` : `# ${fileName}\n\nprint("Hello, World!")\n`;
    await onSave(fileName, defaultCode, undefined, targetFolder, undefined);
    setNewFileName('');
    setCreatingIn(null);
  }, [isLoggedIn, newFileName, onLoginRequired, onSave, defaultLang]);

  const handleCreateFolder = useCallback(async (parentFolder?: string) => {
    if (!isLoggedIn) { onLoginRequired(); return; }
    const name = newFolderName.trim();
    if (!name) return;
    const fullPath = parentFolder ? `${parentFolder}/${name}` : name;
    // Create a placeholder file in the new folder
    const ext = defaultLang === 'c' ? '.c' : '.py';
    const isC = defaultLang === 'c';
    const defCode = isC ? `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n` : `# ${fullPath}/main.py\n\nprint("Hello, World!")\n`;
    await onSave('main' + ext, defCode, undefined, fullPath);
    setNewFolderName('');
    setCreatingFolder(null);
    setExpandedFolders(prev => { const next = new Set(prev); next.add(fullPath); if (parentFolder) next.add(parentFolder); return next; });
  }, [isLoggedIn, newFolderName, onLoginRequired, onSave, defaultLang]);

  const handleRename = useCallback(async (id: string) => {
    const val = renameValue.trim();
    if (!val || !onUpdate) return;
    await onUpdate(id, { title: val.endsWith('.py') ? val : val + '.py' });
    setRenamingId(null);
    setRenameValue('');
  }, [renameValue, onUpdate]);

  return (
    <>
      <style>{`
        .efe-tree-item { display:flex; align-items:center; gap:6px; padding:3px 8px 3px 0; cursor:pointer; border-radius:6px; transition:background 0.12s; user-select:none; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .efe-tree-item:hover { background: var(--efe-hover, #f1f5f9); }
        .efe-tree-item.active { background: var(--efe-active, #e0e7ff); color: var(--efe-active-text, #4338ca); }
        .efe-tree-item .efe-folder-add { opacity:0; transition:opacity 0.12s; }
        .efe-tree-item:hover .efe-folder-add { opacity:1; }
        .efe-scroll::-webkit-scrollbar { width:4px; }
        .efe-scroll::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:4px; }
        .efe-scroll::-webkit-scrollbar-track { background:transparent; }
        .efe-input { width:100%; padding:3px 8px; font-size:11px; border:1.5px solid #c7d2fe; border-radius:6px; outline:none; background:#fff; font-family:inherit; }
        .efe-input:focus { border-color:#818cf8; box-shadow:0 0 0 2px rgba(129,140,248,0.15); }
      `}</style>

      {/* ═══ Activity Bar ═══ */}
      <div style={{ width:48, minWidth:48, background:'var(--bg-secondary, #f0f1f4)', borderRight:'1px solid var(--border-color, #e2e8f0)', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:10, gap:2, flexShrink:0, zIndex:10 }}>
        <button
          onClick={() => setIsPanelOpen(p => !p)}
          title="Explorer"
          style={{ width:36, height:36, borderRadius:8, border:'none', background: isPanelOpen ? 'var(--card-bg, #fff)' : 'transparent', color: isPanelOpen ? 'var(--accent-primary, #4f46e5)' : 'var(--text-muted, #94a3b8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', boxShadow: isPanelOpen ? '0 1px 6px rgba(79,70,229,0.12)' : 'none' }}
        >
          <Folder size={20} />
        </button>
        <button
          onClick={() => { setShowSearch(s => !s); if (!isPanelOpen) setIsPanelOpen(true); }}
          title="Search Files"
          style={{ width:36, height:36, borderRadius:8, border:'none', background: showSearch && isPanelOpen ? 'var(--card-bg, #fff)' : 'transparent', color: showSearch && isPanelOpen ? 'var(--accent-primary, #4f46e5)' : 'var(--text-muted, #94a3b8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
        >
          <Search size={19} />
        </button>
        <div style={{ height:1, width:28, background:'var(--border-color, #e2e8f0)', margin:'6px 0' }} />
        {/* Python icon */}
        <button
          onClick={() => { setDefaultLang('python'); onLanguageSwitch?.('python'); if (!isPanelOpen) setIsPanelOpen(true); }}
          title="Python (.py)"
          style={{ width:36, height:36, borderRadius:8, border:'none', background: defaultLang === 'python' ? '#eef2ff' : 'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', boxShadow: defaultLang === 'python' ? '0 1px 4px rgba(59,130,246,0.12)' : 'none' }}
        >
          <img src="/sample-assets/placeholder.svg" alt="Py" style={{ width:20, height:20, opacity: defaultLang === 'python' ? 1 : 0.4 }} />
        </button>
        {/* C icon */}
        <button
          onClick={() => { setDefaultLang('c'); onLanguageSwitch?.('c'); if (!isPanelOpen) setIsPanelOpen(true); }}
          title="C Language (.c)"
          style={{ width:36, height:36, borderRadius:8, border:'none', background: defaultLang === 'c' ? '#ecfdf5' : 'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', boxShadow: defaultLang === 'c' ? '0 1px 4px rgba(16,185,129,0.12)' : 'none' }}
        >
          <img src="/sample-assets/placeholder.svg" alt="C" style={{ width:20, height:20, opacity: defaultLang === 'c' ? 1 : 0.4 }} />
        </button>
        <div style={{ flex:1 }} />
        <button
          onClick={() => { if (!isLoggedIn) { onLoginRequired(); return; } setCreatingFolder(''); if (!isPanelOpen) setIsPanelOpen(true); }}
          title="New Folder"
          style={{ width:36, height:36, borderRadius:8, border:'none', background:'transparent', color:'var(--text-muted, #94a3b8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8, transition:'all 0.15s' }}
        >
          <FolderPlus size={19} />
        </button>
        <button
          onClick={() => setShowInfo(true)}
          title="About & Shortcuts"
          style={{ width:36, height:36, borderRadius:8, border:'none', background:'transparent', color:'var(--text-muted, #94a3b8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8, transition:'all 0.15s' }}
        >
          <Info size={19} />
        </button>
      </div>

      {/* ═══ File Tree Panel ═══ */}
      <div style={{ width: isPanelOpen ? 220 : 0, minWidth: isPanelOpen ? 220 : 0, overflow:'hidden', transition:'all 0.22s cubic-bezier(0.4,0,0.2,1)', background:'var(--bg-secondary, #fafbfc)', borderRight: isPanelOpen ? '1px solid var(--border-color, #e2e8f0)' : 'none', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ width:220, height:'100%', display:'flex', flexDirection:'column' }}>

          {/* Panel Header */}
          <div style={{ padding:'10px 12px 8px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border-color, #f1f5f9)' }}>
            <span style={{ fontSize:10, fontWeight:800, color:'var(--text-muted, #94a3b8)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Explorer</span>
            <div style={{ display:'flex', gap:4 }}>
              <button onClick={() => { if (!isLoggedIn) { onLoginRequired(); return; } const firstRealFolder = tree.find(f => f.name !== '__unfiled__'); setCreatingIn(firstRealFolder ? firstRealFolder.name : '__root__'); if (firstRealFolder && !expandedFolders.has(firstRealFolder.name)) toggleFolder(firstRealFolder.name); }} title="New File" style={{ width:22, height:22, borderRadius:5, border:'none', background:'transparent', color:'var(--text-muted, #94a3b8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Plus size={13} />
              </button>
              <button onClick={() => { if (!isLoggedIn) { onLoginRequired(); return; } setCreatingFolder(''); }} title="New Folder" style={{ width:22, height:22, borderRadius:5, border:'none', background:'transparent', color:'var(--text-muted, #94a3b8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <FolderPlus size={13} />
              </button>
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div style={{ padding:'8px 10px', borderBottom:'1px solid var(--border-color, #f1f5f9)' }}>
              <input
                className="efe-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                autoFocus
              />
            </div>
          )}

          {/* Tree */}
          <div className="efe-scroll" style={{ flex:1, overflowY:'auto', padding:'6px 6px' }}>
            {/* Create Folder Input */}
            {creatingFolder === '' && (
            <div style={{ padding:'4px 8px' }}>
              <input
                className="efe-input"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="New folder name"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') { setCreatingFolder(null); setNewFolderName(''); } }}
                onBlur={() => { if (!newFolderName.trim()) { setCreatingFolder(null); setNewFolderName(''); } }}
              />
            </div>
          )}

            {/* Create File at Root */}
            {creatingIn === '__root__' && (
              <div style={{ padding:'4px 8px', marginBottom:4 }}>
                <input
                  className="efe-input"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  placeholder="filename.py"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateFile('__unfiled__'); if (e.key === 'Escape') { setCreatingIn(null); setNewFileName(''); } }}
                  onBlur={() => { if (!newFileName.trim()) { setCreatingIn(null); } }}
                />
              </div>
            )}

            {/* Folder → File Tree */}
            {tree.map(folder => {
              const isExpanded = expandedFolders.has(folder.name);
              const isUnfiled = folder.name === '__unfiled__';
              return (
                <div key={folder.name} style={{ marginBottom:2 }}>
                  {/* Folder Row */}
                  <div
                    className="efe-tree-item"
                    onClick={() => toggleFolder(folder.name)}
                    style={{ paddingLeft:8, fontWeight:700, color:'var(--text-primary, #334155)', fontSize:12 }}
                  >
                    {isExpanded ? <ChevronDown size={14} style={{ flexShrink:0, opacity:0.5 }} /> : <ChevronRight size={14} style={{ flexShrink:0, opacity:0.5 }} />}
                    <Folder size={15} style={{ flexShrink:0, color: isUnfiled ? '#f59e0b' : '#4f46e5' }} />
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{isUnfiled ? 'Files' : folder.name}</span>
                    <span style={{ fontSize:9, color:'var(--text-muted, #94a3b8)', marginLeft:'auto', flexShrink:0 }}>{folder.files.length}</span>
                    {!isUnfiled && (
                      <button
                        onClick={e => { e.stopPropagation(); setCreatingIn(folder.name); if (!isExpanded) toggleFolder(folder.name); }}
                        style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted, #94a3b8)', display:'flex', alignItems:'center', padding:0, flexShrink:0 }}
                        className="efe-folder-add"
                        title="New file in folder"
                      >
                        <Plus size={12} />
                      </button>
                    )}
                    {!isUnfiled && (
                      <button
                        onClick={e => { e.stopPropagation(); setCreatingFolder(folder.name); if (!isExpanded) toggleFolder(folder.name); }}
                        style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted, #94a3b8)', display:'flex', alignItems:'center', padding:0, flexShrink:0 }}
                        className="efe-folder-add"
                        title="New subfolder"
                      >
                        <FolderPlus size={12} />
                      </button>
                    )}
                  </div>

                  {/* Files inside folder */}
                  {isExpanded && (
                    <div style={{ paddingLeft:12 }}>
                      {/* Inline create subfolder in folder */}
                      {creatingFolder === folder.name && (
                        <div style={{ padding:'3px 8px 3px 26px' }}>
                          <input
                            className="efe-input"
                            value={newFolderName}
                            onChange={e => setNewFolderName(e.target.value)}
                            placeholder="Subfolder name"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(folder.name); if (e.key === 'Escape') { setCreatingFolder(null); setNewFolderName(''); } }}
                            onBlur={() => { if (!newFolderName.trim()) { setCreatingFolder(null); setNewFolderName(''); } }}
                          />
                        </div>
                      )}

                      {/* Inline create file in folder */}
                      {creatingIn === folder.name && (
                        <div style={{ padding:'3px 8px 3px 26px' }}>
                          <input
                            className="efe-input"
                            value={newFileName}
                            onChange={e => setNewFileName(e.target.value)}
                            placeholder="filename.py"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleCreateFile(folder.name); if (e.key === 'Escape') { setCreatingIn(null); setNewFileName(''); } }}
                            onBlur={() => { if (!newFileName.trim()) { setCreatingIn(null); } }}
                          />
                        </div>
                      )}

                      {folder.files.map(file => {
                        const isActive = file.id === activeFileId;
                        const isRenaming = renamingId === file.id;

                        if (isRenaming) {
                          return (
                            <div key={file.id} style={{ padding:'3px 8px 3px 26px' }}>
                              <input
                                className="efe-input"
                                value={renameValue}
                                onChange={e => setRenameValue(e.target.value)}
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Enter') handleRename(file.id); if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); } }}
                                onBlur={() => handleRename(file.id)}
                              />
                            </div>
                          );
                        }

                        const isCLangFile = file.title.endsWith('.c') || file.title.endsWith('.h');
                        return (
                          <div
                            key={file.id}
                            className={`efe-tree-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectFile(file)}
                            onContextMenu={e => { e.preventDefault(); setContextMenu({ id: file.id, x: e.clientX, y: e.clientY, item: file }); }}
                            style={{ paddingLeft:26 }}
                          >
                            {isCLangFile ? (
                              <img src="/sample-assets/placeholder.svg" alt="C" style={{ width:15, height:15, flexShrink:0 }} />
                            ) : (
                              <img src="/sample-assets/placeholder.svg" alt="Py" style={{ width:15, height:15, flexShrink:0 }} />
                            )}
                            <span style={{ overflow:'hidden', textOverflow:'ellipsis', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--accent-primary, #4338ca)' : 'var(--text-secondary, #475569)' }}>
                              {file.title}
                            </span>
                            {file.isImportant && <Star size={10} style={{ flexShrink:0, color:'#f59e0b', fill:'#f59e0b' }} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty State */}
            {tree.length === 0 && !creatingFolder && creatingIn === null && (
              <div style={{ padding:'30px 16px', textAlign:'center' }}>
                <Folder size={32} style={{ color:'var(--text-muted, #cbd5e1)', margin:'0 auto 12px' }} />
                <p style={{ fontSize:12, color:'var(--text-muted, #94a3b8)', fontWeight:600, marginBottom:8 }}>
                  {searchQuery ? 'No files found' : 'No files yet'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => { if (!isLoggedIn) { onLoginRequired(); return; } setCreatingIn('__root__'); }}
                    style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', fontSize:11, fontWeight:700, cursor:'pointer' }}
                  >
                    Create First File
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Count */}
          <div style={{ padding:'8px 12px', borderTop:'1px solid var(--border-color, #f1f5f9)', fontSize:10, color:'var(--text-muted, #94a3b8)', fontWeight:600, display:'flex', justifyContent:'space-between' }}>
            <span>{codes.length} files</span>
            <span>{tree.filter(f => f.name !== '__unfiled__').length} folders</span>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setContextMenu(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: 10, overflow: 'hidden', width: 170, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => { setRenamingId(contextMenu.id); setRenameValue(contextMenu.item.title); setContextMenu(null); }}
                style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', color: 'var(--text-primary, #334155)', fontSize: 12, fontWeight: 600, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Pencil size={13} /> Rename
              </button>
              <button
                onClick={() => { onDelete(contextMenu.id); setContextMenu(null); }}
                style={{ width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 600, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Info / About Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[var(--bg-primary)] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-[var(--border-color)] overflow-hidden flex flex-col max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-[var(--border-color)] bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/30 dark:to-[var(--bg-secondary)] shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/50 !text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 backdrop-blur-sm">
                    <Info size={22} strokeWidth={2.5} className="!text-white stroke-white" />
                  </div>
                  <div>
                    <h3 className="font-bold !text-white text-lg">AI Compiler & Editor Guide</h3>
                    <p className="text-xs !text-indigo-100 font-medium opacity-90">एडिटर की जानकारी और शॉर्टकट्स</p>
                  </div>
                </div>
                <button onClick={() => setShowInfo(false)} className="w-8 h-8 rounded-full bg-white dark:bg-[var(--glass-bg)] border border-gray-200 dark:border-[var(--border-color)] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-all shadow-sm">
                  <X size={16} />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto custom-scroll space-y-8">
                
                {/* Shortcuts Section */}
                <section>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center"><Keyboard size={14} /></div>
                    Keyboard Shortcuts (शॉर्टकट कीज़)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[var(--glass-bg)] border border-gray-100 dark:border-[var(--border-color)]">
                      <div>
                        <div className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Run Code</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">कोड रन करने के लिए</div>
                      </div>
                      <kbd className="px-2 py-1 text-xs font-bold text-indigo-600 bg-white dark:bg-[var(--bg-tertiary)] border border-indigo-200 dark:border-[var(--border-color)] rounded shadow-sm">F5</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[var(--glass-bg)] border border-gray-100 dark:border-[var(--border-color)]">
                      <div>
                        <div className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Clear Output</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">आउटपुट साफ़ करने के लिए</div>
                      </div>
                      <kbd className="px-2 py-1 text-xs font-bold text-purple-600 bg-white dark:bg-[var(--bg-tertiary)] border border-purple-200 dark:border-[var(--border-color)] rounded shadow-sm">Ctrl + L</kbd>
                    </div>
                  </div>
                </section>

                {/* Features Section */}
                <section>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><Star size={14} /></div>
                    Editor Features (मुख्य विशेषताएं)
                  </h4>
                  <div className="space-y-4">
                    
                    {/* Multi Language */}
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-[var(--border-color)] hover:border-indigo-500/30 transition-colors">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">Dual Compiler Support (Python & C)</h5>
                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                          The editor automatically detects the language based on your file extension. Create a <code className="text-xs text-blue-500">.py</code> file to run Python or a <code className="text-xs text-green-500">.c</code> file to use the C compiler. Click the Python or C icons in the sidebar to switch modes instantly.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">
                          यह एडिटर फ़ाइल के नाम के अनुसार अपने आप लैंग्वेज समझ लेता है। Python के लिए <code className="text-[10px] text-blue-500">.py</code> और C के लिए <code className="text-[10px] text-green-500">.c</code> का इस्तेमाल करें। आप साइडबार में आइकॉन पर क्लिक करके भी लैंग्वेज बदल सकते हैं।
                        </p>
                      </div>
                    </div>

                    {/* AI Error Fixes */}
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-[var(--border-color)] hover:border-purple-500/30 transition-colors">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">AI Error Explanations & Fixes</h5>
                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                          Whenever your code throws an error, the built-in AI will automatically explain what went wrong and provide the corrected code. You can switch the AI explanations between English and Hindi using the toggle in the output panel.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">
                          जब भी आपके कोड में कोई गलती (Error) होगी, AI तुरंत आपको समझाएगा कि क्या गलत है और सही कोड भी देगा। आप आउटपुट में EN/HI बटन से भाषा बदल सकते हैं।
                        </p>
                      </div>
                    </div>

                    {/* File System */}
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-[var(--border-color)] hover:border-orange-500/30 transition-colors">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                        <FolderTree className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">Nested File System</h5>
                        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                          Create folders and subfolders to organize your code. Click the <FolderPlus className="inline w-3 h-3 mx-1" /> icon on any folder to create a nested subfolder inside it, or create a file directly inside any folder.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">
                          अपने कोड्स को अच्छे से रखने के लिए फ़ोल्डर्स और सबफ़ोल्डर्स बनाएं। किसी भी फ़ोल्डर के अंदर नया फ़ोल्डर बनाने के लिए <FolderPlus className="inline w-3 h-3 mx-0.5" /> पर क्लिक करें।
                        </p>
                      </div>
                    </div>

                  </div>
                </section>
                
                {/* Footer Tip */}
                <div className="text-center pt-4 pb-2">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Press <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-[var(--border-color)] bg-gray-50 dark:bg-black/20">Esc</kbd> or click outside to close this window
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
