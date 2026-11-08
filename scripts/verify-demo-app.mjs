// Verify the actual built community app with only loopback emulators.
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import net from 'node:net';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {startEmulators,demoEnvironment,AUTH_HOST} from '../tests/start-firebase-emulators.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
await access(path.join(root,'.next/BUILD_ID'));
await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(3042,'127.0.0.1',()=>s.close(resolve));});
const session=await startEmulators();let server,logs='',checks=0;
const kill=child=>new Promise(resolve=>{if(!child||child.exitCode!==null){resolve();return;}
  if(process.platform==='win32'){const p=spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});p.once('close',resolve);p.once('error',resolve);}
  else{child.once('close',resolve);child.kill('SIGTERM');}});
const stop=async()=>{await kill(server);await kill(session.child);};
process.once('SIGINT',()=>{void stop();});process.once('SIGTERM',()=>{void stop();});
try{
  const deadline=Date.now()+90000;
  while(!session.log.join('').includes('All emulators ready')){if(session.child.exitCode!==null||Date.now()>deadline)throw Error('Emulator startup failed');await new Promise(resolve=>setTimeout(resolve,250));}
  await new Promise((resolve,reject)=>{const seed=spawn(process.execPath,[path.join(root,'scripts/seed-demo.mjs')],{cwd:root,env:session.env,windowsHide:true,stdio:'inherit'});
    seed.once('error',reject);seed.once('close',code=>code===0?resolve():reject(Error('Demo seed failed')));});
  server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port','3042'],{
    cwd:root,env:demoEnvironment({NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',FIREBASE_TRUSTED_ADMIN_UIDS:'trusted-admin-stage1',KNOBLY_ENABLE_EMAIL:'false',METADATA_SERVER_DETECTION:'none'}),windowsHide:true,stdio:['ignore','pipe','pipe']});
  for(const stream of [server.stdout,server.stderr])stream.on('data',data=>{logs=(logs+data).slice(-12000);});
  const base='http://127.0.0.1:3042';let ready=false;
  const startDeadline=Date.now()+60000;
  while(Date.now()<startDeadline){if(server.exitCode!==null)throw Error('Built server exited');try{const r=await fetch(base,{signal:AbortSignal.timeout(5000)});if(r.status===200){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,250));}
  assert.ok(ready,'Built server did not become ready');
  for(const route of ['/','/html','/optional-content','/html/tasks/1/compiler']){
    const response=await fetch(base+route);assert.equal(response.status,200,route);checks++;
  }
  const anon=await fetch(base+'/api/leaderboard');assert.equal(anon.status,401);checks++;
  const login=await fetch('http://'+AUTH_HOST+'/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=emulator-only',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:'learner@example.test',password:'DemoOnly123!',returnSecureToken:true})});
  assert.equal(login.status,200);const {idToken}=await login.json();assert.ok(idToken);checks++;
  const post=body=>fetch(base+'/api/exams',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+idToken},body:JSON.stringify(body)});
  const load=await post({action:'load',testId:'demo-test'});assert.equal(load.status,200);const publicText=await load.text();assert.ok(!publicText.includes('is_correct'));checks++;
  const started=await post({action:'start',testId:'demo-test',requestId:randomUUID()});assert.equal(started.status,200);const {attemptId}=await started.json();checks++;
  const answers={'demo-paragraph':{option_id:'demo-paragraph-a',short_answer:null},'demo-link':{option_id:'demo-link-a',short_answer:null}};
  const submitted=await post({action:'submit',attemptId,answers,revision:1});assert.equal(submitted.status,200);const result=await submitted.json();
  assert.equal(result.result.score,2);assert.equal(result.result.xpAwarded,20);checks++;
  const duplicate=await post({action:'submit',attemptId,answers:{},revision:2});assert.deepEqual(await duplicate.json(),result);checks++;
  const review=await post({action:'review',attemptId});assert.equal(review.status,200);assert.equal((await review.json()).attempt.score,2);checks++;
  const board=await fetch(base+'/api/leaderboard',{headers:{Authorization:'Bearer '+idToken}});assert.equal(board.status,200);assert.equal((await board.json()).leaderboard[0].total_xp,20);checks++;
  const ai=await fetch(base+'/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'demo'}]})});
  assert.equal(ai.status,503);checks++;
  console.log(JSON.stringify({actualBuiltAppChecks:checks,project:'demo-knobly-local',productionCredentialsUsed:false,browserVisualCheck:false}));
}catch(error){console.error(logs);throw error;}
finally{await stop();}
