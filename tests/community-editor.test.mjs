import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
function harness(){
  const cells=[],effects=[],configured=[],workers=[];let cursor=0,fail=false;
  const monaco={__esModule:true,editor:{}},self={};
  const react={useState(initial){const i=cursor++;if(!(i in cells))cells[i]=initial;return[cells[i],v=>{cells[i]=typeof v==='function'?v(cells[i]):v;}];},
    useEffect(fn,deps){const i=cursor++,before=cells[i];if(!before||deps.some((v,j)=>v!==before[j])){cells[i]=deps;effects.push(fn);}}};
  const BaseEditor=()=>null,exports={};
  const dependencies={react,'react/jsx-runtime':jsxRuntime,'@monaco-editor/react':{__esModule:true,default:BaseEditor,loader:{config:x=>configured.push(x)}}};
  const source=readFileSync(new URL('../src/lib/community-editor.tsx',import.meta.url),'utf8').replaceAll('import.meta.url',JSON.stringify('http://localhost:3000/editor'));
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  vm.compileFunction(compiled,['exports','require','self','URL','Worker'])(exports,name=>{
    if(name==='monaco-editor'){if(fail)throw Error('Chunk unavailable');return monaco;}
    assert.ok(Object.hasOwn(dependencies,name),name);return dependencies[name];
  },self,URL,class{constructor(url,options){this.url=String(url);workers.push({url:this.url,options});}});
  return{configured,workers,BaseEditor,self,monaco,setFail:v=>fail=v,
    render(props={value:'keep this code'}){cursor=0;return exports.Editor(props);},
    async flush(){for(const effect of effects.splice(0))effect();await new Promise(resolve=>setImmediate(resolve));}};
}
test('editor waits for the local npm implementation before rendering the CDN-loading base component',async()=>{
  const h=harness(),first=h.render();assert.equal(first.props.role,'status');assert.equal(h.configured.length,0);
  await h.flush();const ready=h.render();assert.equal(ready.type,h.BaseEditor);assert.equal(ready.props.value,'keep this code');
  assert.equal(h.configured.length,1);assert.equal(h.configured[0].monaco,h.monaco);assert.equal(h.configured[0].paths,undefined);
});
test('a failed local editor chunk can be retried without discarding the workspace value',async()=>{
  const h=harness();h.setFail(true);h.render();await h.flush();const error=h.render();assert.equal(error.props.role,'alert');
  const retry=error.props.children.find(x=>typeof x==='object'&&x.type==='button');h.setFail(false);retry.props.onClick();
  h.render();await h.flush();const ready=h.render();assert.equal(ready.type,h.BaseEditor);assert.equal(ready.props.value,'keep this code');
});
test('editor language workers use statically bundled same-origin module entries',async()=>{
  const h=harness();h.render();await h.flush();
  for(const label of ['json','css','html','typescript','python'])h.self.MonacoEnvironment.getWorker('worker',label);
  assert.equal(h.workers.length,5);assert.ok(h.workers.every(w=>w.url.startsWith('http://localhost:3000/')&&w.options.type==='module'));
  assert.ok(h.workers[3].url.endsWith('/typescript/ts.worker.js'));assert.ok(h.workers[4].url.endsWith('/editor/editor.worker.js'));
});
