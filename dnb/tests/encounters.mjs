import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));
 const base='http://127.0.0.1:8765/dnb/',click=id=>page.locator('#'+id).click();
 await page.goto(base);
 const scenery=await page.evaluate(()=>Array.from({length:6},(_,w)=>{let c=document.createElement('canvas');c.width=840;c.height=320;let ctx=c.getContext('2d');AstreonDaylight.landscape(ctx,w);let d=ctx.getImageData(0,0,840,320).data,sum=0;for(let i=0;i<d.length;i+=4)sum+=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722);return {luma:sum/(840*320),image:c.toDataURL()}}));
 assert(scenery.every(s=>s.luma>130));assert.equal(new Set(scenery.map(s=>s.image)).size,6);
 await click('hw');let skip=page.locator('#prologueSkip');if(await skip.count())await skip.click();await page.locator('#student').fill('TEST-VENTURE');await click('start');
 const baseline=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);
 const fit=()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
 async function enter(at){
  await page.evaluate(n=>{let k='gardiens-dnb-v1',s=JSON.parse(localStorage.getItem(k));s.hw.at=n;localStorage.setItem(k,JSON.stringify(s))},at);
  await page.reload();await click('hw');await page.locator('#ventureCanvas').waitFor();assert(await fit())
 }
 async function verify(at){await page.locator('.venture-complete').waitFor();await click('direct');await page.locator('#app .question').waitFor();let s=await page.evaluate(()=>JSON.parse(localStorage.getItem('gardiens-dnb-v1')).hw);assert.equal(s.at,at);assert.deepEqual(s.qs,baseline.qs);assert.deepEqual(s.answers,baseline.answers)}
 await enter(4);await page.locator('[data-climb="0"]').click();assert((await page.locator('#ventureFeedback').textContent()).includes('instable'));for(let v of [1,2,0])await page.locator('[data-climb="'+v+'"]').click();await verify(4);
 for(let [at,counts] of [[8,[2,1,3]],[16,[3,0,2]],[20,[2,0,1]]]){
  await enter(at);await click('ventureCheck');assert(!(await page.locator('.venture-complete').count()));
  for(let j=0;j<3;j++)for(let n=0;n<counts[j];n++)await page.locator('[data-piece="'+j+'"]').click();await click('ventureCheck');await verify(at)
 }
 await enter(12);await page.locator('#ventureAngle').evaluate(e=>{e.value=45;e.dispatchEvent(new Event('input',{bubbles:true}))});await click('ventureCheck');await verify(12);
 for(let w=0;w<6;w++){
  let at=4*w+3;await enter(at);
  for(let j=0;j<3;j++){let action=['attack','jump','shield'][(j+w+3)%3];await page.locator('[data-venture="'+action+'"]').click()}await verify(at)
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: six bright landscapes, 11 varied encounters, all paths optional, unchanged homework');
}finally{await browser.close()}
