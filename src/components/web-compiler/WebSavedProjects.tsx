'use client';

import { useState, useEffect } from 'react';
import {
  FolderOpen, Plus, Trash2, Search, X, Check, FileCode,
  Download, Clock, Calendar, Star, Tag, Folder
} from 'lucide-react';
import { SavedWebProject, WebEditorTab } from '@/types/web-compiler';

interface WebSavedProjectsProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: SavedWebProject) => void;
  onSaveCurrent: (title: string, folder?: string, description?: string) => void;
  currentTabs: WebEditorTab[];
}

const STORAGE_KEY = 'knobly_web_saved_projects';

export function WebSavedProjects({
  isOpen,
  onClose,
  onLoadProject,
  onSaveCurrent,
  currentTabs,
}: WebSavedProjectsProps) {
  const [projects, setProjects] = useState<SavedWebProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProjects(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load saved projects:', e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveToStorage = (updated: SavedWebProject[]) => {
    setProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage error:', e);
    }
  };

  const handleCreateSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const htmlTab = currentTabs.find((t) => t.language === 'html')?.code || '';
    const cssTab = currentTabs.find((t) => t.language === 'css')?.code || '';
    const jsTab = currentTabs.find((t) => t.language === 'javascript')?.code || '';

    const newProj: SavedWebProject = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      folder: newFolder.trim() || 'General',
      description: newDesc.trim(),
      html: htmlTab,
      css: cssTab,
      js: jsTab,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProj, ...projects];
    saveToStorage(updated);
    onSaveCurrent(newProj.title, newProj.folder, newProj.description);
    setIsSavingNew(false);
    setNewTitle('');
    setNewFolder('');
    setNewDesc('');
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveToStorage(updated);
  };

  const handleToggleImportant = (id: string) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, isImportant: !p.isImportant } : p
    );
    saveToStorage(updated);
  };

  const folders = Array.from(
    new Set(projects.map((p) => p.folder || 'General').filter(Boolean))
  );

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || (p.folder || 'General') === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <FolderOpen size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                My Saved Web Projects
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Manage, export, and load your custom HTML/CSS/JS websites
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSavingNew(!isSavingNew)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--action-bg)] text-white hover:opacity-90 shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>Save Current</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Save Current Project Drawer */}
        {isSavingNew && (
          <form
            onSubmit={handleCreateSave}
            className="p-4 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] space-y-3 animate-in slide-in-from-top-2"
          >
            <h3 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <FileCode size={14} className="text-[var(--accent-primary)]" />
              Save New Web Project
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Project Title (e.g. Portfolio Website)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                required
                autoFocus
              />
              <input
                type="text"
                placeholder="Folder / Category (e.g. O-Level, Practice)"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <textarea
              placeholder="Short Description / Notes (Optional)"
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSavingNew(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:opacity-90"
              >
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Search & Folder Filter Bar */}
        <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search saved projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {folders.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedFolder === 'all'
                    ? 'bg-[var(--action-bg)] text-white'
                    : 'text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--border-color)]'
                }`}
              >
                All ({projects.length})
              </button>
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    selectedFolder === f
                      ? 'bg-[var(--action-bg)] text-white'
                      : 'text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--border-color)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-[var(--text-muted)] text-center p-6">
              <FolderOpen size={36} className="opacity-30 mb-2" />
              <p className="text-xs font-semibold">No saved projects found</p>
              <p className="text-[11px] opacity-70 mt-1 max-w-xs">
                Click "Save Current" at the top to save your HTML/CSS/JS work to your browser!
              </p>
            </div>
          ) : (
            filtered.map((proj) => (
              <div
                key={proj.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleImportant(proj.id)}
                    className="mt-0.5 text-[var(--text-muted)] hover:text-amber-400 transition-colors"
                  >
                    <Star
                      size={16}
                      className={proj.isImportant ? 'text-amber-400 fill-amber-400' : ''}
                    />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {proj.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-[var(--glass-bg)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
                        {proj.folder || 'General'}
                      </span>
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                        {proj.description}
                      </p>
                    )}
                    <span className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onLoadProject(proj);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--action-bg)] text-white hover:opacity-90 shadow-sm transition-opacity"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--glass-bg)] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
