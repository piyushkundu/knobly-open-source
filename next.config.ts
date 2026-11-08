import type { NextConfig } from 'next';
import path from 'node:path';

const config:NextConfig = {
  experimental:{cpus:2},
  webpack(current,{webpack}) {
    // Monaco ships a vendored sanitizer even in its ESM tree. Package overrides
    // alone cannot replace that file: substitute the pinned, patched dependency.
    current.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /[\\/]monaco-editor[\\/]esm[\\/]vs[\\/]base[\\/]browser[\\/]dompurify[\\/]dompurify\.js$/,
      path.resolve(process.cwd(),'node_modules/dompurify/dist/purify.es.mjs'),
    ));
    return current;
  },
};
export default config;
