import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('dnb/index.html','utf8'), worker=readFileSync('school/worker-dnb-candidate.js','utf8');
const start=html.indexOf('const worlds='),end=html.indexOf('let session=null;');
const source=html.slice(start,end);
const bank=h=>h.slice(h.indexOf('function make(w,i)'),h.indexOf('function normalize(v)'));
assert.equal(bank(html),bank(worker),'Les banques locale et serveur doivent être identiques');
const {variants,correct,worlds}=new Function('localStorage',source+';return {variants:[baseMake,alternate,...[0,1,2].map(j=>(w,i)=>extended(w,i,j))],correct,worlds}')({getItem:()=>null,setItem:()=>{}});
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
let total=0,independent=0;
for(let w=0;w<6;w++)for(let slot=0;slot<4;slot++)for(let variant=0;variant<5;variant++)for(let n=0;n<100;n++){
 let Q=variants[variant](w,slot);assert(Q.t&&Q.solution&&Q.labels.length===Q.expected.length);assert(correct(Q,Q.expected.map(String)));assert(!correct(Q,Q.expected.map(()=>'')));total++;
 if(w===0){approx(fractionValue(Q.t),expression(String(Q.expected[0])),Q.t);independent++}
 if(w===4||w===5&&slot<3){let m=Q.t.match(/^Développer(?: et réduire)? (.*?)\./);assert(m,Q.t);let [a,b,c]=Q.expected;for(let x of [-3,-1,0,2,5])approx(expression(m[1],x),a*x*x+b*x+c,Q.t);independent++}
 if(w===5&&slot===3){let m=Q.t.match(/^Factoriser (.*?)\./);assert(m,Q.t);let [a,b]=Q.expected;if(b===undefined){b=a;a=1}let same=Q.t.includes('² avec');for(let x of [-3,0,2,5]){let value=same?(Q.t.includes('(x − b)')?(a*x-b)**2:(a*x+b)**2):(a*x+b)*(a*x-b);approx(expression(m[1],x),value,Q.t)}independent++}
}
assert.equal(worlds.reduce((n,w)=>n+w[3],0),20);
console.log('PASS: '+total+' questions; '+independent+' vérifications indépendantes fractions/algèbre; banques identiques.');
