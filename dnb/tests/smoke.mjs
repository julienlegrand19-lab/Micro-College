
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
 assert.equal(await page.locator('.atlas-node').count(),6);
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



 assert.equal(await page.locator('[data-focus]').count(),6);
 await click('villageOpen');await page.locator('[data-villager="bram"]').click();await page.locator('[data-choice="0"]').click();assert.equal(await page.locator('[data-forge="blade"]').isDisabled(),true);await click('villageBack');await click('villageJournal');assert.equal(await page.getByText('Maître de la crypte',{exact:true}).count(),1);await click('villageBack');await click('villageCrypt');await click('cryptStart');await page.locator('#crypt0').fill('0');await click('cryptCheck');await click('cryptNext');await page.locator('#crypt0').fill('0');await click('cryptCheck');await click('cryptNext');await page.locator('[data-move="spell"]').click();assert.equal(await page.locator('[data-move="spell"]').isDisabled(),true);await click('villageClose');await page.locator('#hw').waitFor();
 await page.locator('[data-focus="0"]').click();await page.locator('#focusCheck').waitFor();await click('studyClose');
 await click('mockOpen');await click('beginMock');assert.equal(await page.locator('[data-mock]').count(),24);await page.locator('#mockTime').waitFor();await page.locator('dialog[open]').evaluate(d=>d.close());
 await click('hw');await optional('prologueSkip');await page.locator('#student').fill('TEST-E01');await click('start');
 await page.locator('#walk').waitFor();assert.equal(await page.locator('#secret').count(),1);assert.equal(await page.locator('#actHP').getAttribute('max'),'9');
 await page.keyboard.down('ArrowRight');try{await page.waitForFunction(()=>Number(document.querySelector('#routeProgress')?.value)>10)}finally{await page.keyboard.up('ArrowRight')}
 await page.locator('#jump').click();
 await click('direct');await page.locator('#app .question').waitFor();
 let attempt=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);
 assert.equal(attempt.qs.length,24);
 for(let i=0;i<24;i++){
   await question();
   let Q=attempt.qs[i];
   if(Q.kind==='yn')await page.locator('[data-yn="'+Q.expected[0]+'"]').click();
   else for(let j=0;j<Q.expected.length;j++)await page.locator('#a'+j).fill(String(Q.expected[j]));
   if(i===4){await page.reload();await click('hw');await question();let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);assert.equal(saved.at,i);assert.deepEqual(saved.answers[i],Q.expected.map(String))}
   await click('next');
 }
 await optional('finalContinue');await click('submit');await page.locator('#exportJson').waitFor();assert.equal((await page.locator('.score').textContent()).trim(),'20/20');
 let final=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);assert(final.finished);
 let report={format:'astreon-dnb-report-v1',student:final.student,submitted:final.submitted,points:[4,3,3,4,3,3],total:20,questions:final.qs.map((Q,j)=>({chapter:Q.w,slot:Q.i,text:Q.t,kind:Q.kind,expected:Q.expected,response:final.answers[j]}))};
 const desktop=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});desktop.on('pageerror',e=>errors.push(String(e)));await desktop.goto(base+'professeur.html');await desktop.locator('#files').setInputFiles({name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});await desktop.waitForFunction(()=>document.querySelector('#n').textContent==='1');assert.equal((await desktop.locator('#avg').textContent()).trim(),'20');await desktop.close();
 const online=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});online.on('pageerror',e=>errors.push(String(e)));
 let saved=final.qs.map(()=>null),position=0;
 const publicAttempt=finished=>({student:'test-e02',qs:finished?final.qs:final.qs.map(({t,kind,labels,diagram,w,i})=>({t,kind,labels,diagram,w,i})),answers:saved,at:position,finished,created:final.created,submitted:finished?new Date().toISOString():null});
 await online.route('https://micro-college.julienlegrand19.workers.dev/**',async route=>{
  let req=route.request(),path=new URL(req.url()).pathname;const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type','Content-Type':'application/json'};
  if(req.method()==='OPTIONS')return route.fulfill({status:200,headers,body:'{}'});
  let result={ok:true};if(path==='/health')result={ok:true,configured:true,dnb:1};else if(path==='/student/login')result={token:'a'.repeat(64),id:'test-e02',name:'TEST-E02'};else if(path==='/student/dnb/start')result=publicAttempt(false);else if(path==='/student/dnb/save'){let p=req.postDataJSON();saved=p.answers;position=p.at}else if(path==='/student/dnb/submit'){let p=req.postDataJSON();saved=p.answers;position=p.at;result=publicAttempt(true)}else if(path!=='/student/logout')throw Error('Unexpected mocked route '+path);await route.fulfill({status:200,headers,body:JSON.stringify(result)})
 });
 await online.goto(base+'?school=1');await online.locator('#hw').click();await online.locator('#onlineName').fill('TEST-E02');await online.locator('#onlinePass').fill('test-only');await online.locator('#onlineStart').click();await online.locator('#direct').click();await online.locator('#app .question').waitFor();let Q=final.qs[0];await online.locator('#a0').fill(String(Q.expected[0]));await online.locator('#finish').click();await online.locator('#submit').click();await online.getByText('Remise confirmée par le serveur', {exact:false}).waitFor();assert.equal(saved[0][0],String(Q.expected[0]));await online.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: mobile local campaign, reload, perfect grading, teacher import, mocked online submission, study and mock entry');
}finally{await browser.close()}
