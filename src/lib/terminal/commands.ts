import { VFSNode, resolvePath, getAbsolutePath } from './vfs';

const commandHistory: string[] = [];

export interface CommandResult {
  output: string;
  newVfsRoot?: VFSNode;
  newCwd?: string;
  clear?: boolean;
  interactiveCat?: { target: string; append: boolean };
  interactiveProcess?: { type: 'adduser' | 'passwd'; args: string[] };
}

export function executeCommand(
  cmdStr: string,
  vfsRoot: VFSNode,
  cwd: string
): CommandResult {
  let redirectTarget = '';
  let append = false;
  let baseCmdStr = cmdStr;
  
  if (cmdStr.includes('>>')) {
    const parts = cmdStr.split('>>');
    baseCmdStr = parts[0];
    redirectTarget = parts[1].trim();
    append = true;
  } else if (cmdStr.includes('>')) {
    const parts = cmdStr.split('>');
    baseCmdStr = parts[0];
    redirectTarget = parts[1].trim();
  }

  const args = baseCmdStr.trim().split(/\s+/).filter(Boolean);
  const cmd = args[0];
  
  if (!cmd) return { output: '' };

  if (cmdStr.trim()) {
    commandHistory.push(cmdStr.trim());
  }

  const cloneVfs = (): VFSNode => JSON.parse(JSON.stringify(vfsRoot));

  const writeRedirect = (output: string, target: string, appendMode: boolean, currentVfs: VFSNode): CommandResult => {
    const newVfs = currentVfs;
    const { node, parentDir, finalName } = resolvePath(newVfs, cwd, target);
    
    if (node && node.type === 'directory') return { output: `bash: ${target}: Is a directory` };
    if (!parentDir || parentDir.type !== 'directory') return { output: `bash: ${target}: No such file or directory` };
    
    parentDir.children = parentDir.children || {};
    if (node) {
       node.content = appendMode ? ((node.content || '') + output) : output;
    } else {
       parentDir.children[finalName] = { name: finalName, type: 'file', content: output };
    }
    return { output: '', newVfsRoot: newVfs };
  };

  try {
    // If it's cat with no args but redirected, enter interactive mode
    if (cmd === 'cat' && args.length === 1 && redirectTarget) {
      return { output: '', interactiveCat: { target: redirectTarget, append } };
    }

    let cmdOutput = '';
    let cmdNewVfs = cloneVfs();
    let cmdNewCwd = cwd;
    let shouldClear = false;

    switch (cmd) {
      case 'help':
        return {
          output: `\x1b[1;36mKnobly Nexus OS - Available Commands\x1b[0m
====================================

\x1b[1;33mFILE SYSTEM\x1b[0m
  \x1b[1;32mls\x1b[0m [dir]        - List directory contents (e.g., 'ls' or 'ls /home')
  \x1b[1;32mcd\x1b[0m <dir>        - Change working directory (e.g., 'cd Music')
  \x1b[1;32mpwd\x1b[0m             - Print current working directory path
  \x1b[1;32mmkdir\x1b[0m <name>    - Create a new directory
  \x1b[1;32mrmdir\x1b[0m <name>    - Remove an empty directory
  \x1b[1;32mtouch\x1b[0m <name>    - Create a new empty file
  \x1b[1;32mrm\x1b[0m [-r] <name>  - Remove a file (use -r to delete directories)
  \x1b[1;32mcp\x1b[0m [-r] <s d>   - Copy file or dir from source(s) to destination(d)
  \x1b[1;32mmv\x1b[0m <src dest>   - Move or rename files and directories
  \x1b[1;32mcat\x1b[0m <file>      - Read and print file contents
  \x1b[1;32mecho\x1b[0m <text>     - Print text (use > or >> to write to files)

\x1b[1;33mSYSTEM & USER\x1b[0m
  \x1b[1;32madduser\x1b[0m <name>  - Interactively add a new user to the system
  \x1b[1;32mpasswd\x1b[0m <name>   - Interactively change a user's password
  \x1b[1;32mwhoami\x1b[0m          - Show current logged-in user
  \x1b[1;32mdate\x1b[0m            - Show current system date and time
  \x1b[1;32mhistory\x1b[0m         - Show the list of previously typed commands
  \x1b[1;32mclear\x1b[0m           - Clear the terminal screen
  \x1b[1;32mhelp\x1b[0m            - Show this detailed help guide

\x1b[1;36mPRO TIP:\x1b[0m You can use \x1b[1;33m>\x1b[0m to create/overwrite files and \x1b[1;33m>>\x1b[0m to append text!
Example: \x1b[1;32mecho\x1b[0m "Hello World" > test.txt`
        };

      case 'pwd':
        cmdOutput = cwd;
        break;

      case 'whoami':
        cmdOutput = 'guest';
        break;

      case 'date':
        cmdOutput = new Date().toString();
        break;

      case 'clear':
        shouldClear = true;
        break;

      case 'ls': {
        const targetPath = args[1] || '.';
        const { node } = resolvePath(cmdNewVfs, cwd, targetPath);
        if (!node) { cmdOutput = `ls: cannot access '${targetPath}': No such file or directory`; break; }
        if (node.type === 'file') { cmdOutput = node.name; break; }
        
        const children = Object.values(node.children || {});
        cmdOutput = children.map(c => {
          return c.type === 'directory' ? `\x1b[1;34m${c.name}\x1b[0m` : c.name;
        }).join('  ');
        break;
      }

      case 'cd': {
        const targetPath = args[1] || '~';
        const { node } = resolvePath(cmdNewVfs, cwd, targetPath);
        if (!node) { cmdOutput = `bash: cd: ${targetPath}: No such file or directory`; break; }
        if (node.type !== 'directory') { cmdOutput = `bash: cd: ${targetPath}: Not a directory`; break; }
        
        cmdNewCwd = getAbsolutePath(cwd, targetPath);
        break;
      }

      case 'mkdir': {
        const targetPath = args[1];
        if (!targetPath) { cmdOutput = `mkdir: missing operand`; break; }
        
        const { node, parentDir, finalName } = resolvePath(cmdNewVfs, cwd, targetPath);
        
        if (node) { cmdOutput = `mkdir: cannot create directory '${targetPath}': File exists`; break; }
        if (!parentDir || parentDir.type !== 'directory') { cmdOutput = `mkdir: cannot create directory '${targetPath}': No such file or directory`; break; }
        
        parentDir.children = parentDir.children || {};
        parentDir.children[finalName] = { name: finalName, type: 'directory', children: {} };
        break;
      }

      case 'rmdir': {
        const targetPath = args[1];
        if (!targetPath) { cmdOutput = `rmdir: missing operand`; break; }
        
        const { node, parentDir, finalName } = resolvePath(cmdNewVfs, cwd, targetPath);
        
        if (!node) { cmdOutput = `rmdir: failed to remove '${targetPath}': No such file or directory`; break; }
        if (node.type !== 'directory') { cmdOutput = `rmdir: failed to remove '${targetPath}': Not a directory`; break; }
        if (Object.keys(node.children || {}).length > 0) { cmdOutput = `rmdir: failed to remove '${targetPath}': Directory not empty`; break; }
        if (!parentDir) { cmdOutput = `rmdir: cannot remove root directory`; break; }
        
        delete parentDir.children![finalName];
        break;
      }

      case 'touch': {
        const targetPath = args[1];
        if (!targetPath) { cmdOutput = `touch: missing file operand`; break; }
        
        const { node, parentDir, finalName } = resolvePath(cmdNewVfs, cwd, targetPath);
        
        if (node) break; // Already exists, do nothing
        if (!parentDir || parentDir.type !== 'directory') { cmdOutput = `touch: cannot touch '${targetPath}': No such file or directory`; break; }
        
        parentDir.children = parentDir.children || {};
        parentDir.children[finalName] = { name: finalName, type: 'file', content: '' };
        break;
      }

      case 'rm': {
        const isRecursive = args[1] === '-r' || args[1] === '-rf';
        const targetPath = isRecursive ? args[2] : args[1];
        
        if (!targetPath) { cmdOutput = `rm: missing operand`; break; }
        
        const { node, parentDir, finalName } = resolvePath(cmdNewVfs, cwd, targetPath);
        
        if (!node) { cmdOutput = `rm: cannot remove '${targetPath}': No such file or directory`; break; }
        if (!parentDir) { cmdOutput = `rm: cannot remove root directory`; break; }
        
        if (node.type === 'directory' && !isRecursive) {
          cmdOutput = `rm: cannot remove '${targetPath}': Is a directory`;
          break;
        }
        
        delete parentDir.children![finalName];
        
        if (cwd.startsWith(getAbsolutePath(cwd, targetPath))) {
            cmdNewCwd = '/';
        }
        break;
      }

      case 'cp': {
        const isRecursive = args[1] === '-r' || args[1] === '-R';
        const srcPath = isRecursive ? args[2] : args[1];
        const destPath = isRecursive ? args[3] : args[2];
        if (!srcPath || !destPath) { cmdOutput = `cp: missing operand`; break; }
        
        const { node: srcNode } = resolvePath(cmdNewVfs, cwd, srcPath);
        if (!srcNode) { cmdOutput = `cp: cannot stat '${srcPath}': No such file or directory`; break; }
        if (srcNode.type === 'directory' && !isRecursive) { cmdOutput = `cp: -r not specified; omitting directory '${srcPath}'`; break; }
        
        const { node: destNode, parentDir: destParent, finalName: destName } = resolvePath(cmdNewVfs, cwd, destPath);
        if (!destParent) { cmdOutput = `cp: cannot create regular file '${destPath}': No such file or directory`; break; }
        
        const copiedNode = JSON.parse(JSON.stringify(srcNode));
        
        if (destNode && destNode.type === 'directory') {
          destNode.children = destNode.children || {};
          copiedNode.name = srcNode.name;
          destNode.children[srcNode.name] = copiedNode;
        } else {
          copiedNode.name = destName;
          destParent.children = destParent.children || {};
          destParent.children[destName] = copiedNode;
        }
        break;
      }

      case 'mv': {
        const srcPath = args[1];
        const destPath = args[2];
        if (!srcPath || !destPath) { cmdOutput = `mv: missing operand`; break; }
        
        const { node: srcNode, parentDir: srcParent, finalName: srcName } = resolvePath(cmdNewVfs, cwd, srcPath);
        if (!srcNode || !srcParent) { cmdOutput = `mv: cannot stat '${srcPath}': No such file or directory`; break; }
        
        const { node: destNode, parentDir: destParent, finalName: destName } = resolvePath(cmdNewVfs, cwd, destPath);
        if (!destParent) { cmdOutput = `mv: cannot move '${srcPath}' to '${destPath}': No such file or directory`; break; }
        
        if (destNode && destNode.type === 'directory') {
          destNode.children = destNode.children || {};
          destNode.children[srcNode.name] = srcNode;
        } else {
          srcNode.name = destName;
          destParent.children = destParent.children || {};
          destParent.children[destName] = srcNode;
        }
        delete srcParent.children![srcName];
        break;
      }

      case 'history': {
        cmdOutput = commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
        break;
      }

      case 'adduser': {
        const username = args[1];
        if (!username) { cmdOutput = `adduser: Only one or two names allowed.`; break; }
        
        const { node: homeNode } = resolvePath(cmdNewVfs, cwd, '/home');
        if (homeNode && homeNode.type === 'directory') {
            if (homeNode.children && homeNode.children[username]) {
                cmdOutput = `adduser: The user \`${username}' already exists.`;
            } else {
                return { 
                  output: `Adding user \`${username}' ...\r\nAdding new group \`${username}' (1001) ...\r\nAdding new user \`${username}' (1001) with group \`${username}' ...\r\nCreating home directory \`/home/${username}' ...\r\nCopying files from \`/etc/skel' ...`, 
                  interactiveProcess: { type: 'adduser', args: [username] } 
                };
            }
        }
        break;
      }

      case 'passwd': {
        const username = args[1] || 'guest';
        return { 
          output: `Changing password for ${username}.`, 
          interactiveProcess: { type: 'passwd', args: [username] } 
        };
      }

      case 'cat': {
        if (args.length < 2) {
            cmdOutput = `cat: missing operand`;
            break;
        }
        // Support concatenation of multiple files
        const outputs = [];
        for (let i = 1; i < args.length; i++) {
            const targetPath = args[i];
            const { node } = resolvePath(cmdNewVfs, cwd, targetPath);
            if (!node) { outputs.push(`cat: ${targetPath}: No such file or directory`); }
            else if (node.type === 'directory') { outputs.push(`cat: ${targetPath}: Is a directory`); }
            else { outputs.push(node.content || ''); }
        }
        cmdOutput = outputs.join('\n');
        break;
      }

      case 'echo': {
        let text = args.slice(1).join(' ');
        if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
          text = text.substring(1, text.length - 1);
        }
        cmdOutput = text;
        break;
      }

      default:
        cmdOutput = `bash: ${cmd}: command not found`;
        break;
    }

    // Handle global redirection
    if (redirectTarget && cmdOutput && !cmdOutput.startsWith('bash: ') && !cmdOutput.startsWith('cat: ') && !cmdOutput.startsWith('mkdir: ') && !cmdOutput.startsWith('rm: ') && !cmdOutput.startsWith('rmdir: ') && !cmdOutput.startsWith('touch: ') && !cmdOutput.startsWith('cp: ') && !cmdOutput.startsWith('mv: ')) {
        return writeRedirect(cmdOutput, redirectTarget, append, cmdNewVfs);
    }

    // special case if echo was completely empty, we can still touch/empty the file
    if (redirectTarget && cmd === 'echo' && cmdOutput === '') {
         return writeRedirect('', redirectTarget, append, cmdNewVfs);
    }

    return { output: cmdOutput, newVfsRoot: cmdNewVfs, newCwd: cmdNewCwd, clear: shouldClear };

  } catch (error: any) {
    return { output: `bash: error: ${error.message}` };
  }
}
