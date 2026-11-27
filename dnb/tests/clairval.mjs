import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
let root={};new Function('globalThis',readFileSync('dnb/clairval-engine.js','utf8'))(root);
let E=root.ClairvalEngine,s=E.fresh(42);
assert.equal(E.path(s.pos,[17,6],s),null);
assert(!E.complete(s,'bridge',E.mission('bridge',42).expected));
for(let id of E.ids){let q=E.sites.find(x=>x.id===id);assert(E.path(s.pos,[q.x,q.y],s));assert(E.complete(s,id,E.mission(id,s.seed).expected));s.pos=[q.x,q.y]}
assert.equal(s.done.length,7);
for(let n=0;n<100;n++)for(let id of E.ids){let m=E.mission(id,n);assert(E.check(m,m.expected));assert(!E.check(m,m.expected.map(()=>'')));if(id==='stars')assert.equal(Math.round(Math.atan2(m.height,m.distance)*180/Math.PI),m.expected[0])}
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8765/dnb/');await page.locator('#clairvalOpen').click();
 const click=id=>page.locator('#'+id).click(),place=id=>page.locator('[data-destination="'+id+'"]');
 assert(await place('stars').isDisabled());assert.equal(await page.locator('#journal button').count(),8);
 const fit=()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
 assert(await fit());let seed=await page.evaluate(()=>JSON.parse(localStorage.getItem('astreon-clairval-v1')).seed);
 async function arrive(id){await place(id).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Tu es arrivé'));await page.locator('#interact').click();await page.locator('dialog[open]').waitFor()}
 await arrive('bridge');assert((await page.locator('dialog').textContent()).includes('d’abord aider'));await click('closeDialog');
 for(let id of E.ids){
  await arrive(id);assert(await fit());let m=E.mission(id,seed);
  await click('check');assert((await page.locator('#feedback').textContent()).includes('pas encore'));
  if(m.kind==='dose'){for(let i=0;i<3;i++)for(let n=0;n<m.expected[i];n++)await page.locator('[data-dose="'+i+'"][data-delta="1"]').click()}
  else if(['ladder','bridge','stars'].includes(m.kind))await page.locator('#setting').evaluate((el,n)=>{el.value=n;el.dispatchEvent(new Event('input',{bubbles:true}))},m.expected[0]);
  else for(let i=0;i<m.expected.length;i++)await page.locator('#v'+i).fill(String(m.expected[i]));
  await click('check');assert((await page.locator('#feedback').textContent()).includes(m.success));await click('closeDialog');
 }
 assert(!(await place('stars').isDisabled()));assert((await page.locator('#seals').textContent()).includes('7/7'));
 await arrive('final');assert((await page.locator('dialog').textContent()).includes('Gardien de Clairval'));await click('closeDialog');
 await page.reload();assert((await page.locator('#seals').textContent()).includes('Coffre ouvert'));
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1'))?.hw??null),null);
 assert.deepEqual(errors,[]);
 console.log('PASS: 700 mission cases, collision, gated bridge, all seven quests, finale, narrow mobile and persistence');
}finally{await browser.close()}
