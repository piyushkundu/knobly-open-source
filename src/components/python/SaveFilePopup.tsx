'use client';
import { useState, useEffect, useRef, useMemo, useSyncExternalStore } from 'react';

import { X, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { createPythonFolderStore } from '@/lib/python-folders';

interface SaveFilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onSave: (name: string, description: string, folder: string) => void;
  existingFolders?: string[];
}

export function SaveFilePopup(props: SaveFilePopupProps) {
  if (!props.isOpen) return null;
  return <SaveFileDialog key={props.initialName} {...props} />;
}

function SaveFileDialog({ isOpen, onClose, initialName, onSave, existingFolders = [] }: SaveFilePopupProps) {
  const [fileName, setFileName] = useState(initialName.replace(/\.py$/, '') || 'Untitled');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [folderStore] = useState(createPythonFolderStore);
  const customFolders = useSyncExternalStore(folderStore.subscribe, folderStore.getSnapshot, folderStore.getServerSnapshot);

  const allFolders = useMemo(() => {
    const s = new Set<string>();
    customFolders.forEach(f => s.add(f.name));
    existingFolders.forEach(f => { if (f) s.add(f); });
    return Array.from(s);
  }, [customFolders, existingFolders]);

  useEffect(() => {
    const timer = setTimeout(() => nameInputRef.current?.select(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    let name = fileName.trim() || 'Untitled';
    if (!name.endsWith('.py')) name += '.py';
    onSave(name, description, selectedFolder);
    onClose();
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const updated = [...customFolders, { name: newFolderName.trim(), color: '#6366f1', icon: '📁' }];
    folderStore.replace(updated);
    setSelectedFolder(newFolderName.trim());
    setNewFolderName('');
    setShowNewFolder(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-visible"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-400/30 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                  <img src="/sample-assets/placeholder.svg" alt="Save" className="w-5 h-5 drop-shadow-sm" />
                </div>
                <div>
                  <h2 className="text-sm font-bold !text-white tracking-wide">Save File</h2>
                  <p className="text-[10px] text-indigo-100">Name your file and choose a folder</p>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* File Name */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">File Name</label>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <img src="/sample-assets/placeholder.svg" alt="" className="w-4 h-4 flex-shrink-0" />
                  <input
                    ref={nameInputRef}
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                    placeholder="Enter file name..."
                    className="flex-1 bg-transparent text-sm font-mono text-gray-900 outline-none placeholder:text-gray-500"
                  />
                  <span className="text-xs text-gray-600 font-mono">.py</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Description <span className="font-normal text-gray-600">(optional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this code do?"
                  rows={2}
                  className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                />
              </div>

              {/* Folder Selector (Horizontal Scroll) */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Folder</label>
                
                <div className="flex flex-col gap-3">
                  {/* Row 1: Horizontal Scrollable Folders */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button 
                      onClick={() => setSelectedFolder('')} 
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all border ${!selectedFolder ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <span>📂</span> Unfiled
                    </button>

                    {allFolders.map(f => {
                      const cfg = customFolders.find(cf => cf.name === f);
                      return (
                        <button 
                          key={f} 
                          onClick={() => setSelectedFolder(f)} 
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all border ${selectedFolder === f ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span>{cfg?.icon || '📁'}</span> {f}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: Add New Folder */}
                  <div className="flex items-center">
                    {showNewFolder ? (
                      <div className="flex items-center gap-2 w-full mt-1">
                        <input
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); }}
                          placeholder="New folder name..."
                          autoFocus
                          className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <button onClick={handleCreateFolder} className="px-3 py-1.5 bg-indigo-500 !text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">
                          Add
                        </button>
                        <button onClick={() => { setShowNewFolder(false); setNewFolderName(''); }} className="px-2 py-1.5 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setShowNewFolder(true)} className="flex items-center justify-center gap-1.5 px-3 py-2 mt-1 bg-indigo-500 hover:bg-indigo-600 !text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm">
                        <FolderPlus className="w-3.5 h-3.5" /> Create New Folder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-5 py-2 rounded-xl text-sm font-bold !text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                Save File
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
