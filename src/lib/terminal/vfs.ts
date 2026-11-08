export type FileType = 'file' | 'directory';

export interface VFSNode {
  name: string;
  type: FileType;
  content?: string;
  children?: Record<string, VFSNode>;
}

export const INITIAL_VFS: VFSNode = {
  name: '/',
  type: 'directory',
  children: {
    'home': {
      name: 'home',
      type: 'directory',
      children: {
        'guest': {
          name: 'guest',
          type: 'directory',
          children: {
            'Desktop': { name: 'Desktop', type: 'directory', children: {} },
            'Documents': { name: 'Documents', type: 'directory', children: {} },
            'Downloads': { name: 'Downloads', type: 'directory', children: {} },
            'Music': { name: 'Music', type: 'directory', children: {} },
            'Pictures': { name: 'Pictures', type: 'directory', children: {} },
            'Public': { name: 'Public', type: 'directory', children: {} },
            'Templates': { name: 'Templates', type: 'directory', children: {} },
            'Videos': { name: 'Videos', type: 'directory', children: {} },
            'welcome.txt': {
              name: 'welcome.txt',
              type: 'file',
              content: 'Welcome to the Ubuntu mock terminal!\nType "help" to see available commands.\nThis is a client-side simulated filesystem.'
            }
          }
        }
      }
    }
  }
};

export function resolvePath(root: VFSNode, cwd: string, path: string): { node: VFSNode | null, parentDir: VFSNode | null, finalName: string } {
  if (!path) return { node: resolvePath(root, cwd, '.').node, parentDir: null, finalName: '' };
  
  const isAbsolute = path.startsWith('/');
  const startDir = isAbsolute ? '/' : cwd;
  
  // Handle ~ symbol
  if (path === '~' || path.startsWith('~/')) {
    return resolvePath(root, '/home/guest', path.replace('~', ''));
  }
  
  // Clean up path parts
  const rawParts = (isAbsolute ? path : `${startDir}/${path}`).split('/');
  const parts: string[] = [];
  for (const part of rawParts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length > 0) parts.pop();
    } else {
      parts.push(part);
    }
  }

  let curr = root;
  let parentDir: VFSNode | null = null;
  let finalName = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (curr.type !== 'directory' || !curr.children) {
      return { node: null, parentDir: null, finalName: part };
    }
    
    if (i === parts.length - 1) {
      parentDir = curr;
      finalName = part;
    }

    if (curr.children[part]) {
      curr = curr.children[part];
    } else {
      if (i === parts.length - 1) {
        return { node: null, parentDir, finalName: part };
      } else {
        return { node: null, parentDir: null, finalName: part };
      }
    }
  }

  if (parts.length === 0) {
    return { node: root, parentDir: null, finalName: '/' };
  }

  return { node: curr, parentDir, finalName };
}

export function getAbsolutePath(cwd: string, targetPath: string): string {
  if (targetPath === '~' || targetPath.startsWith('~/')) {
    targetPath = targetPath.replace('~', '/home/guest');
  }

  const isAbsolute = targetPath.startsWith('/');
  const rawParts = (isAbsolute ? targetPath : `${cwd}/${targetPath}`).split('/');
  const parts: string[] = [];
  for (const part of rawParts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length > 0) parts.pop();
    } else {
      parts.push(part);
    }
  }
  return '/' + parts.join('/');
}

export function writeToFile(vfsRoot: VFSNode, cwd: string, targetPath: string, content: string, append: boolean): VFSNode {
  const newVfs = JSON.parse(JSON.stringify(vfsRoot));
  const { node, parentDir, finalName } = resolvePath(newVfs, cwd, targetPath);
  
  if (node && node.type === 'directory') return newVfs; // Can't write to dir
  if (!parentDir || parentDir.type !== 'directory') return newVfs; // Parent missing
  
  parentDir.children = parentDir.children || {};
  if (node) {
    node.content = append ? ((node.content || '') + content) : content;
  } else {
    parentDir.children[finalName] = { name: finalName, type: 'file', content };
  }
  return newVfs;
}
