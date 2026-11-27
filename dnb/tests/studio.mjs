import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
let root={};new Function('globalThis',readFileSync('dnb/studio-engine.js','utf8'))(root);
let E=root.AstreonStudio;
const b=(op,value,body,otherwise)=>({...E.node(op),...(value===undefined?{}:{value}),...(body?{body}:{}),...(otherwise?{otherwise}:{})});
const solutions=[[b('pen'),b('repeat',4,[b('move',60),b('turn',90)])],[b('pen'),b('repeat',3,[b('move',70),b('turn',120)])],[b('repeat',5,[b('add',4)]),b('say')],[b('if',10,[b('add',5)],[b('add',-2)]),b('say')],[b('repeat',3,[b('repeat',4,[b('add',2)])]),b('say')],[b('mul',3),b('add',2),b('if',13,[b('add',5)],[b('add',-5)]),b('say')]];
for(let [i,p] of solutions.entries()){assert(E.assess(p,i).ok);assert(!E.assess([],i).ok)}
assert(!E.assess([b('set',20),b('say'),b('repeat',1,[])],2).ok);
assert(!E.assess([b('repeat',12,[b('add',2)]),b('say')],4).ok);
assert.throws(()=>E.execute([b('repeat',50,[b('repeat',50,[b('add',1)])])]),/limite/);
assert.throws(()=>E.execute([b('repeat',51,[])]),/invalide/);
assert.throws(()=>E.execute([{op:'eval'}]),/inconnu/);
const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:320,height:640},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(String(e)));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:8765/dnb/');await page.locator('.studio-link').click();
 assert.equal(await page.locator('[data-mission]').count(),7);
 const click=id=>page.locator('#'+id).click(),loc=(attr,v)=>page.locator('[data-'+attr+'="'+v+'"]');
 const fit=()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
 async function build(p,address=''){for(let i=0;i<p.length;i++){let b=p[i],at=address?address+'/'+i:String(i);await loc('target',address).click();await loc('add',b.op).click();if(b.value!==undefined)await loc('value',at).fill(String(b.value));for(let branch of E.spec[b.op].branches||[])await build(b[branch],at+'/'+branch)}}
 for(let i=0;i<6;i++){
  await loc('mission',i).click();assert(await fit(),'studio overflow '+i);
  await click('check');assert(!(await page.locator('#feedback').textContent()).includes('Mission réussie'));
  await build(solutions[i]);assert(await fit(),'nested overflow '+i);
  await click('check');await page.getByText('Mission réussie !',{exact:false}).waitFor();await click('home')
 }
 assert((await page.locator('#app').textContent()).includes('6/6 missions réussies'));
 await page.reload();assert((await page.locator('#app').textContent()).includes('6/6 missions réussies'));
 await loc('mission','free').click();await loc('add','set').click();await loc('value','0').fill('3');await loc('add','add').click();await loc('value','1').fill('2');
 await click('step');assert((await page.locator('#trace').textContent()).includes('nombre = 3'));await click('step');assert((await page.locator('#trace').textContent()).includes('nombre = 5'));
 await loc('up','1').click();await click('run');assert((await page.locator('#trace').textContent()).includes('nombre = 3'));
 await loc('cut','0').click();await loc('paste','').click();await click('run');assert((await page.locator('#trace').textContent()).includes('nombre = 5'));
 await page.reload();await loc('mission','free').click();assert.equal(await loc('value','0').inputValue(),'3');assert.equal(await loc('value','1').inputValue(),'2');
 assert.deepEqual(errors,[]);
 console.log('PASS: 6 studio missions, all cases, safe limits, mobile, step-by-step, move, cut/paste, persistence');
}finally{await browser.close()}
