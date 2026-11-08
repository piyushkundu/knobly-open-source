'use client';
import { useEffect, useState } from 'react';
import BaseEditor, { loader } from '@monaco-editor/react';
import type { EditorProps } from '@monaco-editor/react';

let pending: Promise<void> | null = null;
function prepareEditor() {
  if (!pending) pending = import('monaco-editor').then(monaco => {
    const environment = {
      getWorker(_id: string, label: string) {
        if (label === 'json') return new Worker(new URL('monaco-editor/language/json/json.worker.js', import.meta.url), {type:'module'});
        if (label === 'css' || label === 'scss' || label === 'less') return new Worker(new URL('monaco-editor/language/css/css.worker.js', import.meta.url), {type:'module'});
        if (label === 'html' || label === 'handlebars' || label === 'razor') return new Worker(new URL('monaco-editor/language/html/html.worker.js', import.meta.url), {type:'module'});
        if (label === 'typescript' || label === 'javascript') return new Worker(new URL('monaco-editor/language/typescript/ts.worker.js', import.meta.url), {type:'module'});
        return new Worker(new URL('monaco-editor/editor/editor.worker.js', import.meta.url), {type:'module'});
      },
    };
    (self as typeof self & {MonacoEnvironment?:typeof environment}).MonacoEnvironment = environment;
    // Bundle the audited npm implementation; do not load the wrapper's older CDN default.
    loader.config({monaco});
  }).catch(error => { pending = null; throw error; });
  return pending;
}

export function Editor(props: EditorProps) {
  const [ready,setReady] = useState(false);
  const [error,setError] = useState(false);
  const [attempt,setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void prepareEditor().then(() => { if(active)setReady(true); }).catch(() => { if(active)setError(true); });
    return () => { active = false; };
  },[attempt]);
  if(error) return <div role="alert" style={{padding:16,color:'#991b1b',background:'#fff1f2'}}>The editor could not load. Your code is still kept by the workspace. <button onClick={()=>{setError(false);setAttempt(n=>n+1);}}>Retry editor</button></div>;
  if(!ready) return <div role="status">{props.loading ?? 'Loading editor…'}</div>;
  return <BaseEditor {...props} />;
}
export default Editor;
export {loader};
export type {OnMount,OnChange,BeforeMount} from '@monaco-editor/react';
