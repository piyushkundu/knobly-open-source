import assert from 'node:assert/strict';
const expected={GCLOUD_PROJECT:'demo-knobly-local',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:19099',FIRESTORE_EMULATOR_HOST:'127.0.0.1:18080'};
for(const [key,value] of Object.entries(expected)){if(process.env[key])assert.equal(process.env[key],value);process.env[key]=value;}
for(const key of ['GOOGLE_APPLICATION_CREDENTIALS','FIREBASE_SERVICE_ACCOUNT_JSON','FIREBASE_ADMIN_PRIVATE_KEY','VERCEL'])assert.ok(!process.env[key],'Refusing credentials/hosted environment: '+key);
const apps=await import('firebase-admin/app'),authSdk=await import('firebase-admin/auth'),store=await import('firebase-admin/firestore');
const app=apps.initializeApp({projectId:'demo-knobly-local'}),auth=authSdk.getAuth(app),db=store.getFirestore(app);
async function create(path,value){const ref=db.doc(path);if(!(await ref.get()).exists)await ref.create(value);}
try{
  for(const [uid,email,role] of [['demo-learner','learner@example.test','user'],['trusted-admin-stage1','admin@example.test','admin']]){
    try{await auth.getUser(uid);}catch(error){if(error.code!=='auth/user-not-found')throw error;await auth.createUser({uid,email,password:'DemoOnly123!',emailVerified:true});}
    await create('users/'+uid,{email,displayName:role==='admin'?'Demo Admin':'Demo Learner',isAdmin:false,saved_codes:[]});
    await create('profiles/'+uid,{email,full_name:role==='admin'?'Demo Admin':'Demo Learner',role});
    await create('exam_user_state/'+uid,{user_id:uid,total_points:0,total_xp:0,current_level:1});
  }
  await create('app_settings/html_tasks',{unlockedTasks:['1']});
  await create('exam_tests/demo-test',{title:'Sample HTML Practice',mode:'PRACTICE',duration_minutes:10,xp_reward:20,total_marks:2,is_active:true});
  for(const [id,question,answer] of [['paragraph','Which tag creates a paragraph?','<p>'],['link','Which tag creates a hyperlink?','<a>']]){
    await create('exam_questions/demo-'+id,{test_id:'demo-test',question_text:question,question_type:'MCQ',marks:1,explanation:'Synthetic local-demo question.'});
    await create('exam_options/demo-'+id+'-a',{question_id:'demo-'+id,option_text:answer,is_correct:true});
    await create('exam_options/demo-'+id+'-b',{question_id:'demo-'+id,option_text:'<br>',is_correct:false});
  }
  console.log('Demo accounts and sample exam ready. Existing emulator records were not overwritten.');
}finally{await apps.deleteApp(app);}
