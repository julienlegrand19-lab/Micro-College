import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
let root={};new Function('globalThis',readFileSync('dnb/secrets-engine.js','utf8'))(root);
let E=root.AstreonSecrets;
function walk(r,s,to){let p=E.path(r,s,to);assert(p);for(let n of p)assert.notEqual(E.move(r,s,n[0]-s.pos[0],n[1]-s.pos[1]),'blocked')}
for(let r of E.rooms){let s=E.fresh(r);assert.equal(E.path(r,s,r.key),null);assert(!E.eligible(r,{}));
 if(r.kind==='crate'){walk(r,s,[5,6]);assert.notEqual(E.move(r,s,0,-1),'blocked')}
 else if(r.kind==='sequence'){walk(r,s,r.switches[0]);assert.equal(E.interact(r,s),'wrong');for(let i of r.target){walk(r,s,r.switches[i]);E.interact(r,s)}}
 else{walk(r,s,r.switches[2]);E.interact(r,s)}
 assert(s.open);assert(!s.key);walk(r,s,r.key);assert(s.key);walk(r,s,r.chest);assert.equal(E.interact(r,s),'reward');assert.equal(E.interact(r,s),'found');assert(E.clean(r,s).found)
}
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));
 const base='http://127.0.0.1:8765/dnb/',click=id=>page.locator('#'+id).click(),state=id=>page.evaluate(id=>JSON.parse(localStorage.getItem('astreon-secrets-v1'))[id],id);
 await page.goto(base+'secrets.html');assert.equal(await page.locator('[data-room]:disabled').count(),3);
 await page.evaluate(()=>localStorage.setItem('astreon-dungeons-v1',JSON.stringify({seed:42,areas:Object.fromEntries(['cave','temple','vault'].map(id=>[id,{solved:3,room:2,relic:true}]))})));await page.reload();
 const fit=()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
 for(let r of E.rooms){await page.locator('[data-room="'+r.id+'"]').click();assert(await fit());assert(!(await state(r.id)).open);
  async function go(to){let s=await state(r.id),p=E.path(r,s,to);assert(p);for(let n of p){await page.locator('[data-dir="'+(n[0]-s.pos[0])+','+(n[1]-s.pos[1])+'"]').click();s.pos=n}assert.deepEqual((await state(r.id)).pos,to)}
  if(r.kind==='crate'){await go([5,6]);await page.locator('[data-dir="0,-1"]').click()}
  else if(r.kind==='sequence'){await go(r.switches[0]);await click('action');assert((await page.locator('#status').textContent()).includes('recommence'));for(let i of r.target){await go(r.switches[i]);await click('action')}}
  else{await go(r.switches[2]);await click('action')}
  assert((await state(r.id)).open);await go(r.key);assert((await state(r.id)).key);
  await page.reload();await page.locator('[data-room="'+r.id+'"]').click();assert((await state(r.id)).key);
  await go(r.chest);await click('action');assert((await state(r.id)).found);await click('reset');assert((await state(r.id)).found);await click('leave')
 }
 assert((await page.locator('#app').textContent()).includes('3/3 trésors secrets'));await page.goto(base+'clairval.html');assert.equal(await page.locator('#secretCount').textContent(),'3/3 trésors des passages cachés');assert.deepEqual(errors,[]);
 console.log('PASS: 3 spatial puzzles, collisions, locked gates, unique keys and chests, save/reset, mobile');
}finally{await browser.close()}
