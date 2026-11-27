
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:8765/dnb/';
const browser=await chromium.launch({headless:true});
const errors=[];
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'});
const page=await context.newPage();
page.on('pageerror',e=>errors.push(String(e)));
async function click(id){await page.locator('#'+id).click()}
async function optional(id){let e=page.locator('#'+id);if(await e.count()&&await e.isVisible())await e.click()}
async function question(){await optional('cutnext');await optional('direct');await page.locator('#app .question').waitFor()}
try{
 await page.goto(base);await page.locator('#hw').waitFor();
 // Narrow screens and landscape: the document must not overflow horizontally.
 for(const viewport of [{width:320,height:640},{width:375,height:812},{width:844,height:390}]){
  await page.setViewportSize(viewport);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'home overflow '+JSON.stringify(viewport));
  await page.locator('[data-mentor="1"]').click();await page.locator('[data-mentor-tab="example"]').click();
  assert(await page.evaluate(()=>{let d=document.querySelector('.mentor-dialog');return d.scrollWidth<=d.clientWidth+1}),'mentor overflow '+JSON.stringify(viewport));
  await click('mentorContinue');
 }
 await page.setViewportSize({width:390,height:844});
 await page.setViewportSize({width:320,height:640});await click('castleOpen');
 assert((await page.locator('.castle-counters').textContent()).includes('1/7'));
 assert.equal(await page.locator('.castle-buildings article').count(),7);
 assert(await page.locator('[data-cosmetic="outfit"][data-color="#c4a164"]').isDisabled());
 await page.locator('[data-cosmetic="skin"][data-color="#80543f"]').click();
 await page.locator('[data-cosmetic="hair"][data-color="#c5c6ce"]').click();
 await page.locator('[data-cosmetic="outfit"][data-color="#496c90"]').click();
 assert(await page.evaluate(()=>{let d=document.querySelector('.castle-dialog');return d.scrollWidth<=d.clientWidth+1}),'castle overflow');
 await click('castleClose');await page.reload();await click('castleOpen');
 assert.equal(await page.locator('[data-cosmetic="skin"][data-color="#80543f"]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('[data-cosmetic="outfit"][data-color="#496c90"]').getAttribute('aria-pressed'),'true');
 await click('castleDefault');await click('castleClose');await page.setViewportSize({width:390,height:844});

 // The personal notebook is independent of the graded assignment.
 await click('personalOpen');assert((await page.locator('.personal-stats').textContent()).includes('0/24'));
 await page.locator('[data-personal-length="3"]').click();assert.equal(await page.locator('.personal-plan>div').count(),3);
 await click('personalStart');
 await click('personalHint');
 let fields=page.locator('.personal-dialog [data-study-field]');
 for(let j=0;j<await fields.count();j++){let f=fields.nth(j);if(await f.evaluate(e=>e.tagName==='SELECT'))await f.selectOption({index:1});else await f.fill('1')}
 await click('personalCheck');assert(await page.locator('#personalNext').isEnabled());
 let log=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).revisionBook);
 assert.equal(Object.values(log.skills).length,1);assert.equal(Object.values(log.skills)[0].help,1);assert.equal(Object.values(log.skills)[0].ok+Object.values(log.skills)[0].err,0);
 await click('personalReturn');assert((await page.locator('.personal-stats').textContent()).includes('0/24'));await click('personalClose');
 await page.reload();await click('personalOpen');assert((await page.locator('.personal-dialog').textContent()).includes('1 avec indice'));await click('personalClose');


 assert.equal(await page.locator('.atlas-node').count(),6);
 assert.equal(await page.locator('[data-mentor]').count(),6);
 assert.equal(await page.locator('.scratch-territory').count(),1);
 await page.locator('.scratch-link:not(.studio-link)').click();await page.locator('#learn').waitFor();
 await click('learn');assert.equal(await page.locator('[data-lesson]').count(),6);await click('adaListen');assert((await page.locator('#adaVoiceStatus').textContent()).length>0);await click('adaStop');await click('home');assert.equal(await page.locator('[data-room]').count(),16);
 await page.locator('[data-route="2"]').click();assert.equal(await page.locator('[data-room]').count(),6);
 await page.locator('[data-room="12"]').click();await page.locator('#response').fill('26');await click('check');assert((await page.locator('#feedback').textContent()).includes('réussi'));await click('home');await page.locator('[data-route="-1"]').click();
 await page.locator('[data-room="1"]').click();await click('run');assert((await page.locator('#feedback').textContent()).includes('Complète'));
 await page.locator('[data-hole="r"]').selectOption('4');await click('run');assert((await page.locator('#trace').textContent()).includes('avancer 55'));await click('check');assert((await page.locator('#feedback').textContent()).includes('réussi'));
 await click('home');assert((await page.locator('[data-room="1"]').textContent()).includes('✓'));
 await page.reload();assert((await page.locator('[data-room="1"]').textContent()).includes('✓'));
 await page.locator('[data-room="3"]').click();await page.locator('#response').fill('17');await click('check');assert((await page.locator('#feedback').textContent()).includes('réussi'));
 await page.goto(base);await page.locator('#hw').waitFor();
 assert.equal(await page.locator('[data-path-world]').count(),6);
 assert.equal(await page.locator('[data-boss-world]').count(),6);
 await page.locator('[data-boss-world="1"]').click();await page.locator('#ped0').waitFor();
 // Answer all phases correctly, solving the actual generated Pythagoras problems.
 let concept=(await page.locator('.pedagogic-boss .question').textContent()).trim();
 await page.locator('#ped0').selectOption({label:concept.startsWith('Dans un triangle')?'le côté opposé à l’angle droit':'la contraposée'});
 await click('pedCheck');assert.equal(await page.locator('.ped-health .cleared').count(),1);await click('pedNext');
 let task=await page.locator('.pedagogic-boss .question').textContent(),n=[...task.matchAll(/\d+/g)].map(m=>Number(m[0]));
 let labels=await page.locator('.pedagogic-boss .guided-step label').allTextContents();
 if(task.startsWith('ABC est rectangle')){
   let add=task.includes('Calculer BC'),target=add?'BC':'AC';
   await page.locator('#ped0').selectOption({label:'Théorème de Pythagore'});
   await page.locator('#ped1').selectOption({label:'BC² = AB² + AC²'});
   await page.locator('#ped2').selectOption({label:n[0]+'² '+(add?'+':'−')+' '+n[1]+'²'});
   await page.locator('#ped3').fill(String(Math.sqrt(n[0]**2+(add?1:-1)*n[1]**2)));
 }else{
   n.sort((a,b)=>a-b);let [u,v,z]=n,yes=z*z===u*u+v*v;
   await page.locator('#ped0').fill(String(z*z));await page.locator('#ped1').fill(String(u*u+v*v));
   await page.locator('#ped2').selectOption({label:yes?'Réciproque de Pythagore':'Contraposée de Pythagore'});
   await page.locator('#ped3').selectOption({label:yes?'Le triangle est rectangle.':'Le triangle n’est pas rectangle.'});
 }
 await click('pedCheck');assert.equal(await page.locator('.ped-health .cleared').count(),2);await click('pedNext');
 task=await page.locator('.pedagogic-boss .question').textContent();n=[...task.matchAll(/\d+/g)].map(m=>Number(m[0]));
 if(task.startsWith('Une cour')){let [a,b,c]=n,d2=a*a+b*b+c*c;await page.locator('#ped0').fill(String(Math.sqrt(a*a+b*b)));await page.locator('#ped1').fill(String(d2));await page.locator('#ped2').fill(String(Math.sqrt(d2)))}
 else {let [a,b,c]=n;for(let [i,v] of [c*c,a*a+b*b,a*b/2,a+b+c].entries())await page.locator('#ped'+i).fill(String(v))}
 await click('pedCheck');assert.equal(await page.locator('.ped-health .cleared').count(),3);await click('pedNext');assert((await page.locator('.boss-finish').textContent()).includes('Gardien vaincu'));await click('bossClose');
 assert(await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).pedBoss[1].won));

 await page.locator('[data-path-world="1"]').click();assert.equal(await page.locator('[data-path]').count(),3);
 await page.locator('[data-path="0"]').click();assert.equal(await page.locator('.guided-step').count(),4);await click('pathHint');assert((await page.locator('#pathFeedback').textContent()).length>15);await click('pathMenu');
 await page.locator('[data-path="2"]').click();assert((await page.locator('.paths-dialog').textContent()).includes('Le câble du rempart'));await page.locator('#path0').fill('0');await page.locator('#path1').fill('0');await page.locator('#path2').fill('0');await click('pathCheck');assert(await page.locator('#pathNext').isEnabled());await click('pathNext');assert((await page.locator('.paths-dialog').textContent()).includes('Le passage du colosse'));await click('pathMenu');await click('pathClose');
 await page.locator('[data-mentor="3"]').click();await page.locator('[data-mentor-tab="example"]').click();await click('mentorListen');assert((await page.locator('#mentorVoiceStatus').textContent()).length>0);await click('mentorSilence');await page.locator('[data-geometry="BC"]').click();assert((await page.locator('.geometry-feedback').textContent()).includes('hypoténuse'));await click('mentorContinue');

 await page.locator('[data-mentor="1"]').click();await page.getByRole('dialog',{name:'Rencontre avec le maître'}).waitFor();
 await page.locator('[data-mentor-tab="lesson"]').click();assert((await page.locator('#mentorContent').textContent()).includes('BC² = AB² + AC²'));await click('mentorNext');assert((await page.locator('#mentorContent').textContent()).includes('AC² = BC² − AB²'));
 await page.locator('[data-mentor-tab="proof"]').click();assert.equal(await page.locator('[data-mentor-proof]').count(),3);await page.locator('[data-mentor-proof="1"]').click();await page.locator('#proofCheck').waitFor();await click('writingBack');await page.locator('#mentorContinue').waitFor();await click('mentorContinue');
 await page.locator('[data-world="1"]').click();await page.locator('#mentorContinue').waitFor();await click('mentorContinue');await page.locator('#walk').waitFor();await click('direct');await page.locator('#mentorHelp').waitFor();await click('mentorHelp');await click('mentorContinue');await click('leave');await page.locator('#hw').waitFor();

 assert.equal(await page.evaluate(()=>typeof AstreonArt?.hero==='function'&&typeof AstreonArt?.boss==='function'),true);
 // Exercise every new illustration on a real canvas, with actual rendering state.
 const painted=await page.evaluate(()=>{let canvas=document.createElement('canvas');canvas.width=400;canvas.height=400;let g=canvas.getContext('2d');let n=0;for(let character of ['knight','mage','ranger','scout'])for(let pose of ['idle','run','jump','cast','hurt']){g.clearRect(0,0,400,400);AstreonArt.hero(g,{character,pose,x:200,y:300,scale:3,time:1234});if(g.getImageData(0,0,400,400).data.some((v,i)=>i%4===3&&v>0))n++}for(let territory=0;territory<6;territory++)for(let attack of [false,true]){g.clearRect(0,0,400,400);AstreonArt.boss(g,{territory,attack,x:200,y:300,scale:3,time:1234});if(g.getImageData(0,0,400,400).data.some((v,i)=>i%4===3&&v>0))n++}return n});assert.equal(painted,32);
 await click('chronicleOpen');assert.equal(await page.locator('.chronicle-card').count(),6);
 await page.locator('[data-chronicle="guardians"]').click();assert.equal(await page.locator('.chronicle-card.locked').count(),6);
 await page.locator('[data-chronicle="actors"]').click();assert.equal(await page.locator('.chronicle-card').count(),5);
 await page.locator('[data-chronicle="relics"]').click();assert.equal(await page.locator('.chronicle-card').count(),11);
 await click('closeChronicle');
 await click('dailyOpen');await click('replayStart');await page.locator('#replay0').fill('0');for(const f of await page.locator('dialog[open] [data-study-field]').all())await f.fill('0');await click('replayCheck');await page.locator('#replayFeedback').waitFor();await click('replayNext');await click('replayClose');
 await click('survivalOpen');await click('replayStart');assert.equal(await page.locator('.survival-hud').count(),1);await click('replayClose');
 await page.locator('#combatDifficulty').selectOption('story');
 await click('notebookOpen');assert.equal(await page.locator('[data-skill]').count(),24);
 await click('reviewPlan');await page.locator('#skill0').fill('0');for(const f of await page.locator('dialog[open] [data-study-field]').all())await f.fill('0');await click('skillCheck');assert(await page.locator('#skillNext').isEnabled());await click('skillReturn');await click('writingOpen');assert.equal(await page.locator('[data-writing]').count(),10);await page.locator('[data-writing="1"]').click();assert.equal(await page.locator('.proof-choice').count(),5);for(const field of await page.locator('.proof-choice').all()){assert.equal(await field.locator('option').count(),5);await field.selectOption('0')}await page.locator('#proof1').selectOption('1');await click('proofCheck');assert.equal(await page.locator('.proof-right').count(),4);assert.equal(await page.locator('.proof-wrong').count(),1);await page.locator('#proof1').selectOption('0');await click('proofCheck');assert.equal(await page.locator('.proof-right').count(),5);assert(await page.locator('#proofModel').isVisible());await click('writingBack');await click('writingFree');await page.locator('[data-writing="1"]').click();await page.locator('#draftReason').fill('ABC est rectangle en A.');await click('writingReveal');await page.locator('[data-writing-check="0"]').check();await click('writingDone');await click('writingBack');await click('notebookClose');




 assert.equal(await page.locator('[data-focus]').count(),6);
 await click('villageOpen');await page.locator('[data-villager="bram"]').click();await page.locator('[data-choice="0"]').click();assert.equal(await page.locator('[data-forge="blade"]').isDisabled(),true);await click('villageBack');await click('villageJournal');assert.equal(await page.getByText('Maître de la crypte',{exact:true}).count(),1);await click('villageBack');await click('villageCrypt');await click('cryptStart');await page.locator('#crypt0').fill('0');await click('cryptCheck');await click('cryptNext');await page.locator('#crypt0').fill('0');await click('cryptCheck');await click('cryptNext');await page.locator('[data-move="spell"]').click();assert.equal(await page.locator('[data-move="spell"]').isDisabled(),true);await click('villageClose');await page.locator('#hw').waitFor();
 await page.locator('[data-focus="0"]').click();await page.locator('#focusCheck').waitFor();await click('studyClose');
 await click('mockOpen');await click('beginMock');assert.equal(await page.locator('[data-mock]').count(),24);await page.locator('#mockTime').waitFor();await page.locator('dialog[open]').evaluate(d=>d.close());
 await click('hw');await optional('prologueSkip');await page.locator('#student').fill('TEST-E01');await click('start');
 await page.locator('#walk').waitFor();assert.equal(await page.locator('#secret').count(),1);assert.equal(await page.locator('#actHP').getAttribute('max'),'9');
 await page.keyboard.down('ArrowRight');try{await page.waitForFunction(()=>Number(document.querySelector('#routeProgress')?.value)>10)}finally{await page.keyboard.up('ArrowRight')}
 await page.locator('#jump').click();
 await click('direct');await page.locator('#app .question').waitFor();
 assert.equal(await page.locator('#mentorHelp').count(),0);assert.equal(await page.locator('.mentor-dialog[open]').count(),0);
 let attempt=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);
 assert.equal(attempt.qs.length,24);assert.equal(attempt.qs.filter(q=>q.kind==='proof').length,12);
 for(let i=0;i<24;i++){
   await question();
   let Q=attempt.qs[i];
   if(Q.kind==='yn')await page.locator('[data-yn="'+Q.expected[0]+'"]').click();
   else for(let j=0;j<Q.expected.length;j++){let f=page.locator('#a'+j);if(Q.kind==='proof'&&Q.options[j])await f.selectOption(String(Q.expected[j]));else await f.fill(String(Q.expected[j]))}
   if(i===4){assert.equal(await page.locator('.guided-step').count(),4);await page.reload();await click('hw');await question();let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);assert.equal(saved.at,i);assert.deepEqual(saved.answers[i],Q.expected.map(String))}
   await click('next');
 }
 await optional('finalContinue');await click('submit');await page.locator('#exportJson').waitFor();assert.equal((await page.locator('.score').textContent()).trim(),'20/20');
 let final=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);assert(final.finished);
 let report={format:'astreon-dnb-report-v1',student:final.student,submitted:final.submitted,points:[4,3,3,4,3,3],total:20,questions:final.qs.map((Q,j)=>({chapter:Q.w,slot:Q.i,text:Q.t,kind:Q.kind,expected:Q.expected,response:final.answers[j]}))};
 const desktop=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});desktop.on('pageerror',e=>errors.push(String(e)));await desktop.goto(base+'professeur.html');await desktop.locator('#files').setInputFiles({name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});await desktop.waitForFunction(()=>document.querySelector('#n').textContent==='1');assert.equal((await desktop.locator('#avg').textContent()).trim(),'20');assert((await desktop.locator('#grades').textContent()).includes('Local non certifié'));await desktop.locator('#sourceFilter').selectOption('server');assert.equal(await desktop.locator('#n').textContent(),'0');await desktop.locator('#sourceFilter').selectOption('local');assert.equal(await desktop.locator('#n').textContent(),'1');
 assert.equal(await desktop.locator('#diagnostic table').first().locator('tbody tr').count(),24);
 let report2=JSON.parse(JSON.stringify(report));report2.student='TEST-E03';report2.questions[0].response=null;report2.questions[4].labels=final.qs[4].labels;report2.questions[4].response[0]='';report2.points=[3,3-3/16,3,4,3,3];report2.total=20-1-3/16;
 await desktop.locator('#files').setInputFiles({name:'partial.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report2))});await desktop.waitForFunction(()=>document.querySelector('#n').textContent==='2');
 assert((await desktop.locator('#diagnostic').textContent()).includes('88 %'));
 await desktop.locator('[data-code="test-e03"]').click();await desktop.locator('#remediate').click();assert.equal(await desktop.locator('#sheet .sheet-group').count(),2);assert.equal(await desktop.locator('#sheet .sheet-question').count(),4);await desktop.locator('#closeSheet').click();
 await desktop.locator('[data-assignment="6"]').check();assert(await desktop.locator('#compose').isDisabled());await desktop.locator('[data-assignment="0"]').uncheck();assert(await desktop.locator('#compose').isEnabled());await desktop.locator('#compose').click();assert.equal(await desktop.locator('#sheet .sheet-group').count(),6);assert((await desktop.locator('#sheet').textContent()).includes('Programmation et Scratch'));
 await desktop.evaluate(()=>window.print=()=>{});await desktop.locator('#printKey').click();assert((await desktop.locator('#sheet').textContent()).includes('Corrigé'));await desktop.locator('#printSubject').click();assert(!(await desktop.locator('#sheet h1').textContent()).includes('Corrigé'));await desktop.close();
 const online=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});online.on('pageerror',e=>errors.push(String(e)));
 let saved=final.qs.map(()=>null),position=0,revision=0,loseAck=true,loseSubmit=true,submitted=false;
 const publicAttempt=finished=>({student:'test-e02',revision,qs:finished?final.qs:final.qs.map(({t,kind,labels,diagram,w,i,options})=>({t,kind,labels,diagram,w,i,options})),answers:saved,at:position,finished,created:final.created,submitted:finished?new Date().toISOString():null});
 await online.route('https://micro-college.julienlegrand19.workers.dev/**',async route=>{
  let req=route.request(),path=new URL(req.url()).pathname;const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type','Content-Type':'application/json'};
  if(req.method()==='OPTIONS')return route.fulfill({status:200,headers,body:'{}'});
  let result={ok:true};if(path==='/health')result={ok:true,configured:true,dnb:1,dnbRevision:1};else if(path==='/student/login')result={token:'a'.repeat(64),id:'test-e02',name:'TEST-E02'};else if(path==='/student/dnb/start')result=publicAttempt(false);else if(path==='/student/dnb/attempt'){result={attempt:publicAttempt(false)}}else if(path==='/student/dnb/save'){let p=req.postDataJSON();assert.equal(p.revision,revision);saved=p.answers;position=p.at;revision++;if(loseAck){loseAck=false;return route.abort('failed')}result={ok:true,revision}}else if(path==='/student/dnb/submit'){let p=req.postDataJSON();if(!submitted){assert.equal(p.revision,revision);saved=p.answers;position=p.at;revision++;submitted=true}result=publicAttempt(true);if(loseSubmit){loseSubmit=false;return route.abort('failed')}}else if(path!=='/student/logout')throw Error('Unexpected mocked route '+path);await route.fulfill({status:200,headers,body:JSON.stringify(result)})
 });
 await online.goto(base+'?school=1');await online.locator('#hw').click();await online.locator('#onlineName').fill('TEST-E02');await online.locator('#onlinePass').fill('test-only');await online.locator('#onlineStart').click();await online.locator('#direct').click();await online.locator('#app .question').waitFor();let Q=final.qs[0];await online.locator('#a0').fill(String(Q.expected[0]));await online.getByText('Sauvegarde non confirmée — reste sur cette page',{exact:false}).waitFor();await online.evaluate(()=>window.dispatchEvent(new Event('online')));await online.getByText('Sauvegarde serveur confirmée',{exact:true}).waitFor();await online.locator('#finish').click();await online.locator('#submit').click();await online.locator('#submitError').waitFor();assert(await online.locator('#review').isDisabled());await online.locator('#submit').click();await online.getByText('Remise confirmée par le serveur', {exact:false}).waitFor();assert.equal(saved[0][0],String(Q.expected[0]));await online.close();

 const exam=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});exam.on('pageerror',e=>errors.push(String(e)));exam.on('dialog',d=>d.accept());
 await exam.goto(base+'examen.html');await exam.locator('#newExam').click();assert.equal(await exam.locator('[data-nav]').count(),14);assert(await exam.locator('[data-nav="6"]').isDisabled());assert.equal(await exam.locator('.answer-card').count(),0);
 let examData=await exam.evaluate(()=>JSON.parse(localStorage.getItem('astreon-exam-114')));
 for(let i=0;i<14;i++){
   let q=examData.qs[i];
   for(let j=0;j<q.expected.length;j++){let f=exam.locator('#a'+j);if(q.options?.[j])await f.selectOption(String(q.expected[j]));else await f.fill(String(q.expected[j]))}
   if(i===2){await exam.reload();await exam.locator('#resume').click();assert.equal(await exam.locator('#a0').inputValue(),String(q.expected[0]));}
   if(i===5){await exam.locator('#closeAuto').click();assert(await exam.locator('[data-nav="0"]').isDisabled());}
   else if(i<13)await exam.locator('#next').click();
   else await exam.locator('#finish').click();
 }
 assert.equal(await exam.locator('.score').textContent(),'20/20');assert.equal(await exam.locator('.answer-card').count(),14);
 await exam.evaluate(()=>{let m=JSON.parse(localStorage.getItem('astreon-exam-114'));m.finished=false;m.deadline=Date.now()-1;localStorage.setItem('astreon-exam-114',JSON.stringify(m))});
 await exam.reload();await exam.locator('#resume').click();await exam.locator('.score').waitFor();await exam.close();
 const voice=await browser.newPage();await voice.addInitScript(()=>{
  const vs=[{name:'France standard',voiceURI:'std',lang:'fr-FR',localService:true},{name:'France Natural',voiceURI:'natural',lang:'fr-FR',localService:true},{name:'Québec Natural',voiceURI:'ca',lang:'fr-CA',localService:true},{name:'France cloud',voiceURI:'cloud',lang:'fr-FR',localService:false}];
  Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>vs,cancel(){},speak(u){window.lastVoice={name:u.voice.name,lang:u.lang,text:u.text}},addEventListener(){}}});
  Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class{constructor(text){this.text=text}}});
 });
 await voice.goto(base+'scratch.html');await voice.locator('#learn').click();let select=voice.getByLabel('Voix française du mentor');assert.equal(await select.locator('option').count(),2);assert.equal(await select.inputValue(),'natural');await voice.getByRole('button',{name:'Écouter un extrait'}).click();assert.equal(await voice.evaluate(()=>window.lastVoice.lang),'fr-FR');await select.selectOption('std');await voice.reload();await voice.locator('#learn').click();assert.equal(await voice.getByLabel('Voix française du mentor').inputValue(),'std');await voice.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: mobile local campaign, reload, perfect grading, teacher import, mocked online submission, study and mock entry');
}finally{await browser.close()}
