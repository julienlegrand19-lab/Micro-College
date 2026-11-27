import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('dnb/index.html','utf8'), worker=readFileSync('school/worker-dnb-candidate.js','utf8');
const start=html.indexOf('const worlds='),end=html.indexOf('let session=null;');
const source=html.slice(start,end);
const bank=h=>h.slice(h.indexOf('function make(w,i)'),h.indexOf('function normalize(v)'));
assert.equal(bank(html),bank(worker),'Les banques locale et serveur doivent être identiques');
const {variants,correct,worlds,makeHomework}=new Function('localStorage',source+';return {variants:[baseMake,alternate,...[0,1,2].map(j=>(w,i)=>extended(w,i,j))],correct,worlds,makeHomework}')({getItem:()=>null,setItem:()=>{}});
// Independent expression parser: no eval and no shared generation functions.
function expression(input,x=0){
 let tokens=input.replace(/−/g,'-').replace(/²/g,'^2').replace(/×/g,'*').replace(/÷/g,'/').replace(/\s+/g,'').match(/\d+|x|[()+*/^\-]/g)||[];
 let i=0;
 function atom(){let t=tokens[i++];if(t==='('){let v=sum();assert.equal(tokens[i++],')',input);return v}if(t==='x')return x;assert(/^\d+$/.test(t||''),input);return Number(t)}
 function power(){let v=atom();if(tokens[i]==='^'){i++;v=v**Number(tokens[i++])}return v}
 function unary(){if(tokens[i]==='-'){i++;return -unary()}if(tokens[i]==='+'){i++;return unary()}return power()}
 function product(){let v=unary();while(i<tokens.length){let t=tokens[i];if(t==='*'||t==='/'){i++;let b=unary();v=t==='*'?v*b:v/b}else if(t==='('||t==='x'){v*=unary()}else break}return v}
 function sum(){let v=product();while(tokens[i]==='+'||tokens[i]==='-'){let t=tokens[i++],b=product();v+=t==='+'?b:-b}return v}
 let v=sum();assert.equal(i,tokens.length,input);return v
}
const approx=(a,b,t)=>assert(Math.abs(a-b)<1e-8,t+' : '+a+' != '+b);
function fractionValue(t){let p=t.replace(/−/g,'-');
 let m=p.match(/contient (\d+\/\d+) litre.*fioles de (\d+\/\d+) litre/);if(m)return expression('('+m[1]+')/('+m[2]+')');
 m=p.match(/compte (\d+) cristaux bleus sur (\d+) cristaux/);if(m)return +m[1]/+m[2];
 m=p.match(/Calculer les (\d+\/\d+) de (\d+\/\d+) litre/);if(m)return expression('('+m[1]+')*('+m[2]+')');
 m=p.match(/Calculer (\d+) ÷ (\d+\/\d+) \(le diviseur/);if(m)return expression(m[1]+'/('+m[2]+')');
 m=p.match(/^(?:Calculer|Simplifier|Réduire|Écrire) ([\d\s+\-\/×÷()]+?)(?:\s+en fraction|\s+à sa plus|\s+sous forme|\. |\.$)/);assert(m,p);
 // A division glyph between fractions has lower binding than fraction bars.
 return expression(m[1].replace(/([+-]?\d+\/\d+)/g,'($1)'))
}

// Recompute from the question text, not the answer key or generation parameters.
function geometry(Q,w,slot,variant){
 let t=Q.t, n=[...t.matchAll(/\d+/g)].map(m=>Number(m[0])), sides=Object.fromEntries([...t.matchAll(/\b([A-Z]{2}) = (\d+)/g)].map(m=>[m[1],+m[2]])), expected;
 const round=(v)=>Math.round(v*10)/10;
 if(w===1){
  if(slot===0){assert.equal(n.length,2,t);let a=Math.sqrt(n[0]**2+n[1]**2);expected=[/dixième/.test(t)?round(a):a]}
  else if(slot===1){assert.equal(n.length,2,t);expected=[Math.sqrt(n[0]**2-n[1]**2)]}
  else {assert.equal(n.length,3,t);let [a,b,c]=n.sort((a,b)=>a-b);assert(a+b>c,'Triangle impossible: '+t);let sum=a*a+b*b,large=c*c;expected=Q.kind==='yn'?[large===sum?'oui':'non']:Q.labels.length===2?[large,sum]:[large-sum]}
 }else if(w===2){
  if(sides.AB===undefined&&sides.AD!==undefined&&sides.DB!==undefined&&!t.includes('A, D, B et C, D, E'))sides.AB=sides.AD+sides.DB;
  let pairs=t.includes('A, D, B et C, D, E')?[['AD','DB'],['DC','DE'],['AC','BE']]:[['AD','AB'],['AE','AC'],['DE','BC']];
  if(slot<2){let target=Q.labels[0].slice(0,2),pair=pairs.find(p=>p.includes(target)),known=pairs.find(p=>p.every(k=>sides[k]!==undefined));assert(pair&&known,t);let ratio=sides[known[0]]/sides[known[1]];expected=[target===pair[0]?sides[pair[1]]*ratio:sides[pair[0]]/ratio]}
  else{let [a,b]=pairs;let left=sides[a[0]]*sides[b[1]],right=sides[b[0]]*sides[a[1]];expected=Q.kind==='yn'?[left===right?'oui':'non']:Q.labels.length===2?[left,right]:[left-right]}
 }else{
  let angleName=t.includes('angle ACB')?'ACB':t.includes('angle ABC')?'ABC':null;
  let opp=angleName==='ABC'?'AC':'AB',adj=angleName==='ABC'?'AB':'AC',hyp='BC';
  if(slot===3){assert(angleName,t);let a=sides[opp],b=sides[adj],c=sides[hyp];let radians=a!==undefined&&b!==undefined?Math.atan2(a,b):a!==undefined?Math.asin(a/c):Math.acos(b/c);expected=[round(radians*180/Math.PI)]}
  else{let angle=Number(t.match(/(\d+)°/)?.[1]),r=angle*Math.PI/180;assert(Number.isFinite(r),t);let target=Q.labels[0].slice(0,2),val;
   if(!angleName){assert.equal(n.length,2,t);val=n[0]*[Math.sin,Math.cos,Math.tan][slot](r)}
   else {let ratios={[opp]:Math.sin(r),[adj]:Math.cos(r),[hyp]:1};let known=Object.keys(sides)[0];assert(known&&ratios[target]!==undefined,t);val=sides[known]/ratios[known]*ratios[target]}
   expected=[round(val)]
  }
 }
 assert.equal(expected.length,Q.expected.length,t);
 expected.forEach((v,i)=>typeof v==='string'?assert.equal(Q.expected[i],v,t):approx(Number(Q.expected[i]),v,t));
}

let total=0,independent=0;
for(let w=0;w<6;w++)for(let slot=0;slot<4;slot++)for(let variant=0;variant<5;variant++)for(let n=0;n<100;n++){
 let Q=variants[variant](w,slot);assert(Q.t&&Q.solution&&Q.labels.length===Q.expected.length);assert(correct(Q,Q.expected.map(String)));assert(!correct(Q,Q.expected.map(()=>'')));total++;
 if(w>=1&&w<=3){geometry(Q,w,slot,variant);independent++}
 if(w===0){approx(fractionValue(Q.t),expression(String(Q.expected[0])),Q.t);independent++}
 if(w===4||w===5&&slot<3){let m=Q.t.match(/^Développer(?: et réduire)? (.*?)\./);assert(m,Q.t);let [a,b,c]=Q.expected;for(let x of [-3,-1,0,2,5])approx(expression(m[1],x),a*x*x+b*x+c,Q.t);independent++}
 if(w===5&&slot===3){let m=Q.t.match(/^Factoriser (.*?)\./);assert(m,Q.t);let [a,b]=Q.expected;if(b===undefined){b=a;a=1}let same=Q.t.includes('² avec');for(let x of [-3,0,2,5]){let value=same?(Q.t.includes('(x − b)')?(a*x-b)**2:(a*x+b)**2):(a*x+b)*(a*x-b);approx(expression(m[1],x),value,Q.t)}independent++}
}
// The new scored blueprint is invariant in task shape, even if numerical values change.
const signature=qs=>qs.map(q=>[q.w,q.i,q.kind,q.labels.length].join(':')).join('|');
const reference=signature(makeHomework());for(let n=0;n<1000;n++){let qs=makeHomework();assert.equal(signature(qs),reference);assert.equal(qs.reduce((s,q)=>s+(correct(q,q.expected.map(String))?worlds[q.w][3]/4:0),0),20)}
assert.equal(html.match(/function makeHomework\(\)\{[^\n]+/)[0],worker.match(/function makeHomework\(\)\{[^\n]+/)[0]);
console.log('PASS: 1000 devoirs, structure et barème invariants.');
assert.equal(worlds.reduce((n,w)=>n+w[3],0),20);
console.log('PASS: '+total+' questions; '+independent+' vérifications indépendantes sur les six chapitres; banques identiques.');
