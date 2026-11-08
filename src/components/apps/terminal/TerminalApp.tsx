'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { Folder, FileText, ChevronRight, ChevronDown, Terminal as TerminalIcon, Plus, Minus, Moon, Sun } from 'lucide-react';
import { INITIAL_VFS, VFSNode, resolvePath, writeToFile } from '@/lib/terminal/vfs';
import { executeCommand } from '@/lib/terminal/commands';
import { useRouter } from 'next/navigation';

const PROMPT = '\x1b[1;32mguest\x1b[0m\x1b[1;36m@\x1b[0m\x1b[1;35mknobly\x1b[0m:\x1b[1;34m{cwd}\x1b[0m$ ';

const FileTreeItem = ({ node, name, depth = 0, isDarkMode }: { node: VFSNode; name: string; depth?: number; isDarkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(depth <= 2);

  if (node.type === 'file') {
    return (
      <div 
        className={`flex items-center gap-2 py-1.5 px-3 mx-2 my-0.5 rounded-lg cursor-default transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50'}`} 
        style={{ paddingLeft: `${depth * 16 + 12}px`, color: isDarkMode ? '#e2e8f0' : '#334155' }}
      >
        <FileText size={14} style={{ color: isDarkMode ? '#06b6d4' : '#3b82f6', opacity: 0.8 }} />
        <span className="text-sm truncate font-medium tracking-wide">{name}</span>
      </div>
    );
  }

  return (
    <div>
      <div 
        className={`flex items-center gap-1.5 py-1.5 px-3 mx-2 my-0.5 rounded-lg cursor-pointer select-none transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50'}`}
        style={{ paddingLeft: `${depth * 16 + 8}px`, color: isDarkMode ? '#f8fafc' : '#1e293b' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-4 flex justify-center transition-transform duration-200" style={{ color: isDarkMode ? '#94a3b8' : '#64748b', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <ChevronRight size={14} />
        </span>
        <Folder size={15} className={isDarkMode ? "text-cyan-400 fill-cyan-400/20" : "text-blue-500 fill-blue-500/20"} style={{ filter: isDarkMode ? 'drop-shadow(0 0 4px rgba(6,182,212,0.4))' : 'none' }} />
        <span className="text-sm truncate font-semibold tracking-wide">{name}</span>
      </div>
      {isOpen && node.children && (
        <div className="flex flex-col">
          {Object.entries(node.children)
            .sort(([aName, aNode], [bName, bNode]) => {
              if (aNode.type === bNode.type) return aName.localeCompare(bName);
              return aNode.type === 'directory' ? -1 : 1;
            })
            .map(([childName, childNode]) => (
              <FileTreeItem key={childName} name={childName} node={childNode} depth={depth + 1} isDarkMode={isDarkMode} />
            ))}
        </div>
      )}
    </div>
  );
};

export default function TerminalApp() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const router = useRouter();

  const [vfsRoot, setVfsRoot] = useState<VFSNode>(INITIAL_VFS);
  const [cwd, setCwd] = useState<string>('/home/guest');
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Buffer for current command input
  const inputBuffer = useRef<string>('');
  
  type InteractiveMode = 'none' | 'cat' | 'adduser' | 'passwd';
  interface InteractiveState {
    mode: InteractiveMode;
    step: number;
    target: string;
    append: boolean;
    content: string;
    data: Record<string, string>;
  }
  
  // State for interactive commands
  const interactiveState = useRef<InteractiveState>({ mode: 'none', step: 0, target: '', append: false, content: '', data: {} });

  const writePrompt = useCallback((terminal: Terminal, currentCwd: string) => {
    let displayCwd = currentCwd;
    if (currentCwd.startsWith('/home/guest')) {
      displayCwd = currentCwd.replace('/home/guest', '~');
    }
    terminal.write('\r\n' + PROMPT.replace('{cwd}', displayCwd));
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ref to hold latest state for the terminal closure
  const stateRef = useRef({ vfs: vfsRoot, cwd: cwd });
  useEffect(() => {
    stateRef.current = { vfs: vfsRoot, cwd: cwd };
  }, [vfsRoot, cwd]);

  useEffect(() => {
    if (!terminalRef.current || termInstance.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
      fontSize: fontSize,
      allowTransparency: true,
      theme: {
        background: '#00000000',
        foreground: '#e2e8f0',
        cursor: '#06b6d4',
        selectionBackground: 'rgba(6, 182, 212, 0.3)',
        black: '#1e293b',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#f8fafc',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#34d399',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#e879f9',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();

    termInstance.current = term;
    fitAddon.current = fit;

    term.writeln('\x1b[1;36mUbuntu 24.04 LTS Mock Environment\x1b[0m');
    term.writeln('Type \x1b[1;33mhelp\x1b[0m to see available commands.');
    writePrompt(term, cwd);
    
    // Auto-focus terminal on load
    setTimeout(() => term.focus(), 100);

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (termInstance.current && document.activeElement?.className !== 'xterm-helper-textarea') {
         termInstance.current.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);

    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (interactiveState.current.mode !== 'none') {
        const state = interactiveState.current;
        // Handle EOF (Ctrl+D) or Cancel (Ctrl+C)
        if (domEvent.ctrlKey && (domEvent.key === 'c' || (domEvent.key === 'd' && state.mode === 'cat'))) {
          if (domEvent.key === 'd' && state.mode === 'cat') {
            // Save the file
            setVfsRoot(prev => writeToFile(prev, stateRef.current.cwd, state.target, state.content, state.append));
          }
          
          // Exit interactive mode
          interactiveState.current = { mode: 'none', step: 0, target: '', append: false, content: '', data: {} };
          term.write('^' + domEvent.key.toUpperCase() + '\r\n');
          writePrompt(term, stateRef.current.cwd);
          return;
        }

        if (domEvent.keyCode === 13) { // Enter
          if (state.mode === 'cat') {
            state.content += '\n';
            term.write('\r\n');
          } else if (state.mode === 'adduser') {
             term.write('\r\n');
             if (state.step === 0) { // New password
               state.data.password = state.content;
               state.content = ''; state.step = 1;
               term.write('Retype new password: ');
             } else if (state.step === 1) { // Retype password
               if (state.content !== state.data.password) {
                 term.writeln('Sorry, passwords do not match');
                 term.writeln('passwd: Authentication token manipulation error');
                 term.writeln('adduser: password file busy, try again');
                 interactiveState.current = { mode: 'none', step: 0, target: '', append: false, content: '', data: {} };
                 writePrompt(term, stateRef.current.cwd);
               } else {
                 term.writeln('passwd: password updated successfully');
                 term.writeln('Changing the user information for ' + state.target);
                 term.writeln('Enter the new value, or press ENTER for the default');
                 state.content = ''; state.step = 2;
                 term.write('Full Name []: ');
               }
             } else if (state.step === 2) {
               state.content = ''; state.step = 3; term.write('Room Number []: ');
             } else if (state.step === 3) {
               state.content = ''; state.step = 4; term.write('Work Phone []: ');
             } else if (state.step === 4) {
               state.content = ''; state.step = 5; term.write('Home Phone []: ');
             } else if (state.step === 5) {
               state.content = ''; state.step = 6; term.write('Other []: ');
             } else if (state.step === 6) {
               state.content = ''; state.step = 7; term.write('Is the information correct? [Y/n] ');
             } else if (state.step === 7) {
               // Create user in VFS
               setVfsRoot(prev => {
                  const clone = JSON.parse(JSON.stringify(prev));
                  const home = resolvePath(clone, stateRef.current.cwd, '/home').node;
                  if (home && home.type === 'directory') {
                    home.children = home.children || {};
                    home.children[state.target] = { name: state.target, type: 'directory', children: {} };
                  }
                  return clone;
               });
               interactiveState.current = { mode: 'none', step: 0, target: '', append: false, content: '', data: {} };
               writePrompt(term, stateRef.current.cwd);
             }
          } else if (state.mode === 'passwd') {
             term.write('\r\n');
             if (state.step === 0) {
               state.data.password = state.content;
               state.content = ''; state.step = 1;
               term.write('Retype new password: ');
             } else if (state.step === 1) {
               if (state.content !== state.data.password) {
                 term.writeln('Sorry, passwords do not match');
                 term.writeln('passwd: Authentication token manipulation error');
               } else {
                 term.writeln('passwd: password updated successfully');
               }
               interactiveState.current = { mode: 'none', step: 0, target: '', append: false, content: '', data: {} };
               writePrompt(term, stateRef.current.cwd);
             }
          }
        } else if (domEvent.keyCode === 8) { // Backspace
          if (state.content.length > 0) {
            state.content = state.content.slice(0, -1);
            if (state.mode === 'cat' || (state.mode === 'adduser' && state.step >= 2)) {
              term.write('\b \b');
            }
          }
        } else if (printable) {
          state.content += key;
          if (state.mode === 'cat' || (state.mode === 'adduser' && state.step >= 2)) {
            term.write(key);
          }
        }
        return;
      }

      if (domEvent.keyCode === 13) { // Enter
        const cmdStr = inputBuffer.current;
        inputBuffer.current = '';
        
        term.write('\r\n');
        
        if (cmdStr.trim()) {
          const { vfs: currentVfs, cwd: currentCwd } = stateRef.current;
          const result = executeCommand(cmdStr, currentVfs, currentCwd);
          
          if (result.interactiveCat) {
            interactiveState.current = { 
              mode: 'cat', 
              step: 0,
              target: result.interactiveCat.target, 
              append: result.interactiveCat.append, 
              content: '',
              data: {}
            };
            return; // Don't write prompt
          }

          if (result.interactiveProcess) {
             const type = result.interactiveProcess.type;
             const args = result.interactiveProcess.args;
             interactiveState.current = { mode: type, step: 0, target: args[0] || '', append: false, content: '', data: {} };
             if (result.output) term.writeln(result.output);
             term.write('New password: ');
             return;
          }

          if (result.clear) {
            term.clear();
          } else if (result.output) {
            const outputStr = result.output.replace(/\n/g, '\r\n');
            term.writeln(outputStr);
          }

          const newCwd = result.newCwd || currentCwd;
          const newVfs = result.newVfsRoot || currentVfs;
          
          writePrompt(term, newCwd);
          
          // Update state if needed
          if (result.newCwd) setCwd(result.newCwd);
          if (result.newVfsRoot) setVfsRoot(result.newVfsRoot);

        } else {
          writePrompt(term, stateRef.current.cwd);
        }
      } else if (domEvent.keyCode === 8) { // Backspace
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (printable) {
        inputBuffer.current += key;
        term.write(key);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (fitAddon.current) fitAddon.current.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      resizeObserver.disconnect();
      term.dispose();
      termInstance.current = null;
    };
  }, []); // Only run once

  useEffect(() => {
    if (termInstance.current) {
      termInstance.current.options.fontSize = fontSize;
      termInstance.current.options.theme = isDarkMode ? {
        background: '#00000000',
        foreground: '#e2e8f0',
        cursor: '#06b6d4',
        selectionBackground: 'rgba(6, 182, 212, 0.3)',
        black: '#1e293b',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#f8fafc',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#34d399',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#e879f9',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      } : {
        background: '#00000000',
        foreground: '#0f172a',
        cursor: '#2563eb',
        selectionBackground: 'rgba(37, 99, 235, 0.2)',
        black: '#000000',
        red: '#dc2626',
        green: '#16a34a',
        yellow: '#ca8a04',
        blue: '#2563eb',
        magenta: '#c026d3',
        cyan: '#0891b2',
        white: '#e2e8f0',
        brightBlack: '#64748b',
        brightRed: '#ef4444',
        brightGreen: '#22c55e',
        brightYellow: '#eab308',
        brightBlue: '#3b82f6',
        brightMagenta: '#d946ef',
        brightCyan: '#06b6d4',
        brightWhite: '#f8fafc',
      };
      if (fitAddon.current) {
        setTimeout(() => fitAddon.current?.fit(), 10);
      }
    }
  }, [fontSize, isDarkMode]);

  return (
    <div className="h-screen w-screen flex flex-col font-sans transition-all duration-700" style={{
      background: isDarkMode ? 'radial-gradient(ellipse at top, #0f172a, #000000)' : 'radial-gradient(ellipse at top, #eff6ff, #f8fafc)',
      color: isDarkMode ? '#ffffff' : '#0f172a'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .futuristic-scroll::-webkit-scrollbar, .xterm-viewport::-webkit-scrollbar {
          width: 20px;
          height: 20px;
        }
        .futuristic-scroll::-webkit-scrollbar-track, .xterm-viewport::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border-radius: 15px;
        }
        .futuristic-scroll::-webkit-scrollbar-thumb, .xterm-viewport::-webkit-scrollbar-thumb {
          background-color: ${isDarkMode ? 'rgba(6,182,212,0.8)' : 'rgba(59,130,246,0.8)'};
          border-radius: 15px;
          border: 4px solid transparent;
          background-clip: padding-box;
        }
        .futuristic-scroll::-webkit-scrollbar-thumb:hover, .xterm-viewport::-webkit-scrollbar-thumb:hover {
          background-color: ${isDarkMode ? 'rgba(6,182,212,1)' : 'rgba(59,130,246,1)'};
          border: 3px solid transparent;
        }
      `}} />
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 backdrop-blur-xl transition-all duration-500 z-20" style={{
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: isDarkMode ? '0 4px 30px rgba(0,0,0,0.2)' : '0 4px 30px rgba(0,0,0,0.05)'
      }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          >
            <ChevronRight className={`rotate-180 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} size={18} />
          </button>
          <div className="flex items-center gap-3 relative group cursor-default">
            <div className={`absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${isDarkMode ? 'bg-cyan-500/50' : 'bg-blue-500/30'}`}></div>
            <TerminalIcon className={`relative z-10 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} size={22} />
            <h1 className={`font-bold tracking-widest text-sm relative z-10 uppercase ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600'}`}>
              UBUNTU TERMINAL FOR PRACTICE
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFontSize(f => Math.max(10, f - 1))}
            className="p-2 rounded-xl backdrop-blur-md transition-all duration-300"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDarkMode ? '#d1d5db' : '#4b5563'
            }}
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
          <button 
            onClick={() => setFontSize(f => Math.min(24, f + 1))}
            className="p-2 rounded-xl backdrop-blur-md transition-all duration-300"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDarkMode ? '#d1d5db' : '#4b5563'
            }}
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <div className="w-px h-8 mx-2" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}></div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl backdrop-blur-md transition-all duration-300"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(6,182,212,0.2)' : 'rgba(59,130,246,0.1)',
              color: isDarkMode ? '#67e8f9' : '#2563eb',
              boxShadow: isDarkMode ? '0 0 15px rgba(6,182,212,0.3)' : '0 0 15px rgba(59,130,246,0.2)'
            }}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Sidebar - File Explorer */}
        {!isMobile && (
          <aside className="w-64 shrink-0 flex flex-col overflow-y-auto z-10 transition-all duration-500 rounded-2xl backdrop-blur-xl futuristic-scroll" style={{
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'}`,
            boxShadow: isDarkMode ? '0 8px 32px 0 rgba(0,0,0,0.36)' : '0 8px 32px 0 rgba(31,38,135,0.07)'
          }}>
            <div 
              className="p-5 text-[10px] font-black uppercase tracking-[0.2em] sticky top-0 backdrop-blur-md z-10"
              style={{
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                color: isDarkMode ? 'rgba(6,182,212,0.7)' : 'rgba(37,99,235,0.7)'
              }}
            >
              System Explorer
            </div>
            <div className="py-4">
              <FileTreeItem node={vfsRoot} name="/" depth={0} isDarkMode={isDarkMode} />
            </div>
          </aside>
        )}

        {/* Right Content - Terminal */}
        <main className="flex-1 min-h-0 min-w-0 relative transition-all duration-500 group flex flex-col">
          <div className="flex-1 min-h-0 min-w-0 rounded-2xl overflow-hidden backdrop-blur-2xl transition-all duration-500 relative flex flex-col" style={{
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(6,182,212,0.2)' : 'rgba(59,130,246,0.2)'}`,
            boxShadow: isDarkMode ? '0 0 40px rgba(6,182,212,0.15)' : '0 8px 32px 0 rgba(31,38,135,0.1)'
          }}>
             
             {/* Glowing ambient background effect inside terminal container */}
             <div className="absolute inset-0 opacity-50 pointer-events-none transition-opacity duration-1000" style={{
               background: isDarkMode ? 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05), transparent 70%)' : 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.05), transparent 70%)'
             }}></div>
             
             {/* Actual Terminal */}
             <div 
                className="flex-1 min-h-0 min-w-0 w-full relative z-10 p-5" 
                onClick={() => termInstance.current?.focus()}
             >
               <div ref={terminalRef} className="w-full h-full" />
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
