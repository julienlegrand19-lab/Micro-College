import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
let root={};new Function('globalThis',readFileSync('dnb/workshops-engine.js','utf8'))(root);
let E=root.AstreonWorkshops;
for(const m of E.potions){let a=E.potionGoal(m);assert(E.potionOK(m,a));assert.equal(a.reduce((s,n)=>s+n,0),m.total);assert(a.every(Number.isInteger));assert(!E.potionOK(m,[a[0]+1,a[1]-1,a[2]]))}
assert.deepEqual(E.bridges.map(E.bridgeGoal),[9,15,20]);assert.deepEqual(E.stars.map(E.starGoal),[37,53,26]);for(const m of E.mazes){let p=E.shortest(m);assert(p&&p.length<=30);assert(E.simulate(m,p).won);assert(!E.simulate(m,[]).won)}
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:320,height:640},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8765/dnb/');await page.locator('#workshopOpen').click();assert.equal(await page.locator('[data-workshop]').count(),4);
 const click=id=>page.locator('#'+id).click();
 const fit=()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
 assert(await fit(),'workshops home overflow');
 for(let g=0;g<4;g++){
  await page.locator('[data-workshop="'+g+'"]').click();
  for(let i=0;i<3;i++){
   assert(await fit(),'workshop overflow '+g+':'+i);
   if(g===0){
    await click('check');assert((await page.locator('#feedback').textContent()).includes('volume total'));
    let amounts=E.potionGoal(E.potions[i]);for(let j=0;j<3;j++)for(let n=0;n<amounts[j];n++)await page.locator('[data-dose="'+j+'"][data-delta="1"]').click();
    await click('check')
   }else if(g===1||g===2){
    await click('check');assert((await page.locator('#feedback').textContent()).includes('ne convient pas'));
    let goal=g===1?E.bridgeGoal(E.bridges[i]):E.starGoal(E.stars[i]);
    await page.locator('#setting').evaluate((e,n)=>{e.value=n;e.dispatchEvent(new Event('input',{bubbles:true}))},goal);
    assert.equal(await page.locator('#value').textContent(),String(goal));await click('check')
   }else{
    await page.locator('[data-op="L"]').click();await page.locator('[data-op="F"]').click();await click('run');await page.getByText('L’automate a heurté un mur.',{exact:false}).waitFor();await click('clear');
    for(let op of E.shortest(E.mazes[i]))await page.locator('[data-op="'+op+'"]').click();await click('run');
   }
   await page.getByText('Mission accomplie !',{exact:false}).waitFor();assert(await page.locator('#next').isEnabled());await click('next');
  }
 }
 assert((await page.locator('#app').textContent()).includes('12/12 missions accomplies · 4/4 sceaux'));
 await page.reload();assert((await page.locator('#app').textContent()).includes('12/12 missions accomplies'));
 await page.goto('http://127.0.0.1:8765/dnb/');assert((await page.locator('.workshop-entry').textContent()).includes('12/12'));
 assert.deepEqual(errors,[]);
 console.log('PASS: 12 workshop missions, failure/retry, all four seals, narrow mobile and persistence');
}finally{await browser.close()}
