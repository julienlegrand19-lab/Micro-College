import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
let root={};new Function('globalThis',readFileSync('dnb/dungeons-engine.js','utf8'))(root);
let E=root.AstreonDungeons;
for(let seed=0;seed<100;seed++)for(let d of E.data){
 let s=E.fresh(seed),a=E.area(s,d.id);assert(!E.advance(s,d.id));assert(!E.collect(s,d.id));
 for(let i=0;i<3;i++){let m=E.puzzle(d.id,i,seed);assert(E.path(a.pos,E.device));assert(!E.solve(s,d.id,i,m.expected.map(()=>'')));assert(E.solve(s,d.id,i,m.expected));if(m.kind==='angle')assert.equal(Math.round(Math.atan2(m.height,m.distance)*180/Math.PI),m.expected[0]);if(i<2)assert(E.advance(s,d.id))}
 a.pos=E.chest.slice();assert(E.collect(s,d.id));assert(E.clean(s,0).areas[d.id].relic);
}
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));
 const base='http://127.0.0.1:8765/dnb/',click=id=>page.locator('#'+id).click();
 await page.goto(base+'donjons.html');assert.equal(await page.locator('[data-dungeon]:disabled').count(),3);
 await page.evaluate(()=>localStorage.setItem('astreon-clairval-v1',JSON.stringify({seed:42,done:['potion','ladder','bridge','stars','forge','mirror','robot'],pos:[5,10],found:[],final:false})));
 await page.reload();assert.equal(await page.locator('[data-dungeon]:disabled').count(),0);
 for(let d of E.data){
  await page.locator('[data-dungeon="'+d.id+'"]').click();
  for(let i=0;i<3;i++){
   await click('navigate');await page.waitForFunction(()=>document.querySelector('#status').textContent==='Tu es arrivé.');
   await click('interact');await page.locator('dialog[open]').waitFor();let m=E.puzzle(d.id,i,42);
   await click('check');assert((await page.locator('#feedback').textContent()).includes('bloqué'));
   if(m.kind==='dose'){for(let j=0;j<3;j++)for(let n=0;n<m.expected[j];n++)await page.locator('[data-dose="'+j+'"][data-delta="1"]').click()}
   else if(m.max)await page.locator('#setting').evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},m.expected[0]);
   else for(let j=0;j<m.expected.length;j++)await page.locator('#v'+j).fill(String(m.expected[j]));
   await click('check');assert((await page.locator('#feedback').textContent()).includes('Mécanisme activé'));await click('closeDialog');
   if(i===1){await page.reload();await page.locator('[data-dungeon="'+d.id+'"]').click()}
   await click('navigate');await page.waitForFunction(()=>document.querySelector('#status').textContent==='Tu es arrivé.');await click('interact');
   if(i===2){await page.locator('#exitRelic').waitFor();await click('exitRelic')}
  }
 }
 assert((await page.locator('#app').textContent()).includes('3/3 reliques découvertes'));
 await page.goto(base+'clairval.html');assert.equal(await page.locator('#relicCount').textContent(),'3/3 reliques des donjons');
 assert.deepEqual(errors,[]);console.log('PASS: 900 cases, 9 rooms, gated entry, save/reload, 3 relics, Clairval integration');
}finally{await browser.close()}
