import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
let root={};new Function('globalThis',readFileSync('dnb/clairval-engine.js','utf8'))(root);new Function('globalThis',readFileSync('dnb/clairval-life.js','utf8'))(root);
let E=root.ClairvalEngine,L=root.ClairvalLife;
for(let seed=0;seed<100;seed++){let s=L.clean(null),m=L.market(seed);assert.equal(L.act(s,'merchant',[],String(m.change+1),seed),'wrong');assert.equal(L.act(s,'merchant',[],String(m.change),seed),'reward');assert.equal(L.act(s,'merchant',[],String(m.change),seed),'done');assert.equal(L.progress(s),1)}
let original=E.fresh(42);for(let q of L.places.filter(q=>q.x<11))assert(E.path(original.pos,[q.x,q.y],original));assert.equal(E.path(original.pos,[20,10],original),null);
let s=L.clean(null);assert.equal(L.act(s,'lostsheep',[],'',42),'unstarted');assert.equal(L.act(s,'shepherd',[],'',42),'start');assert.equal(L.act(s,'lostsheep',[],'',42),'found');assert.equal(L.act(s,'shepherd',[],'',42),'reward');assert.equal(L.act(s,'courier',[],'',42),'start');assert.equal(L.act(s,'keeper',[],'',42),'blocked');assert.equal(L.act(s,'keeper',['bridge'],'',42),'reward');
assert.deepEqual(L.position([[0,0],[1,0]],1050),[.5,0]);assert.equal(L.condition('auto',45000).id,'breeze');assert.equal(L.condition('rain',0).id,'rain');
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:320,height:640},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));
 const base='http://127.0.0.1:8765/dnb/',click=id=>page.locator('#'+id).click(),place=id=>page.locator('[data-life="'+id+'"]'),state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('astreon-clairval-life-v1')));
 await page.goto(base+'clairval.html');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));
 const seed=await page.evaluate(()=>JSON.parse(localStorage.getItem('astreon-clairval-v1')).seed);
 await page.locator('#weatherChoice').selectOption('rain');assert.equal(await page.locator('#weatherNow').textContent(),'Petite averse lumineuse');
 async function visit(id){await place(id).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Tu es arrivé'));await click('interact');await page.locator('dialog[open]').waitFor()}
 await visit('shepherd');assert.equal((await state()).sheep,'looking');await click('closeDialog');
 await visit('lostsheep');assert.equal((await state()).sheep,'found');await click('closeDialog');
 await page.reload();assert.equal((await state()).sheep,'found');assert.equal(await page.locator('#weatherChoice').inputValue(),'rain');
 await visit('shepherd');assert.equal((await state()).sheep,'done');await click('closeDialog');
 await visit('courier');await click('closeDialog');assert.equal((await state()).letter,'carrying');assert(await place('keeper').isDisabled());
 await visit('merchant');await page.locator('#marketAnswer').fill(String(L.market(seed).change+1));await click('marketCheck');assert(!(await state()).market);await page.locator('#marketAnswer').fill(String(L.market(seed).change));await click('marketCheck');assert((await state()).market);await click('closeDialog');
 // In this isolated browser test, establish the main quest prerequisites before checking the delivery.
 await page.evaluate(()=>{let k='astreon-clairval-v1',s=JSON.parse(localStorage.getItem(k));s.done=['potion','ladder','bridge'];localStorage.setItem(k,JSON.stringify(s))});await page.reload();assert(!(await place('keeper').isDisabled()));
 await visit('keeper');assert.equal((await state()).letter,'done');await click('closeDialog');
 assert((await page.locator('#lifeJournal').textContent()).includes('3/3 services rendus'));
 await page.reload();assert((await page.locator('#lifeJournal').textContent()).includes('3/3 services rendus'));
 await click('invJournal');await page.locator('dialog[open]').waitFor();
 const k=1+seed%5;
 await page.locator('[data-inv="'+(k+3)+'"]').click();await click('invCheck');assert(await page.locator('#invNext').isHidden());
 await page.locator('[data-inv="'+(k+8)+'"]').click();await click('invCheck');await click('invNext');
 await click('closeDialog');await page.reload();await click('invJournal');assert((await page.locator('dialog h2').textContent()).includes('clés'));
 await page.locator('[data-inv="1/3"]').click();await click('invCheck');await click('invNext');
 await page.locator('#invSlider').fill(String(3+k));await click('invCheck');await click('invNext');assert((await page.locator('dialog h2').textContent()).includes('résolu'));
 await click('closeDialog');await page.reload();assert((await page.locator('#invJournal').textContent()).includes('Enquête résolue'));assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('astreon-clairval-investigation-v1'))),3);
 assert.deepEqual(errors,[]);
 console.log('PASS: 100 markets, optional village quests, bridge constraint, mobile, weather, persistence');
}finally{await browser.close()}
