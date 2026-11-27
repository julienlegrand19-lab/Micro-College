// Micro-Collège: API scolaire. No account passwords are stored in plaintext.
const ORIGIN='https://julienlegrand19-lab.github.io';
const CHAPTERS=['relatifs','pyramides','litteral'];
const enc=new TextEncoder();
const now=()=>Math.floor(Date.now()/1000);
const random=(n=24)=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('');
const norm=s=>String(s||'').trim().normalize('NFC').toLocaleLowerCase('fr');
const plain=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.trim().length<=max;
function response(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS','Vary':'Origin','X-Content-Type-Options':'nosniff'}})}
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
async function mac(env,kind,value){const k=await crypto.subtle.importKey('raw',enc.encode(env.AUTH_PEPPER),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',k,enc.encode(kind+'|'+value))),x=>x.toString(16).padStart(2,'0')).join('')}
function equal(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}
async function json(req,max=450000){const len=Number(req.headers.get('Content-Length')||0);if(len>max)fail('Requête trop volumineuse.',413);const reader=req.body?.getReader();if(!reader)fail('Données manquantes.');let size=0,parts=[];for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();fail('Requête trop volumineuse.',413)}parts.push(value)}const data=new Uint8Array(size);let offset=0;for(const p of parts){data.set(p,offset);offset+=p.length}try{const obj=JSON.parse(new TextDecoder().decode(data));if(!obj||typeof obj!=='object'||Array.isArray(obj))fail('Format invalide.');return obj}catch{fail('Format invalide.')}}
async function loginLimit(env,req,role,id){const ip=req.headers.get('CF-Connecting-IP')||'unknown';const t=now();const buckets=[await mac(env,'rate',role+'|ip|'+ip),await mac(env,'rate',role+'|id|'+id)];for(const [i,bucket] of buckets.entries()){const r=await env.DB.prepare('INSERT INTO login_limits(bucket,attempts,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN expires_at<=? THEN 1 ELSE attempts+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING attempts').bind(bucket,t+600,t,t).first();if(r.attempts>(role==='student'&&i===0?120:20))fail('Trop de tentatives. Réessaie dans dix minutes.',429)}}
async function auth(env,req,role){const token=req.headers.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];if(!token)fail('Connexion nécessaire.',401);const hash=await mac(env,'session',token);const s=await env.DB.prepare('SELECT s.role,s.student_id,s.expires_at,u.active FROM sessions s LEFT JOIN students u ON u.id=s.student_id WHERE s.token_mac=? AND s.expires_at>?').bind(hash,now()).first();if(!s||s.role!==role||(role==='student'&&s.active!==1))fail('Session expirée ou accès interdit.',401);return {...s,hash}}
async function session(env,role,id=null){const token=random(32),hash=await mac(env,'session',token),t=now();const statements=[env.DB.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(t),env.DB.prepare('DELETE FROM login_limits WHERE expires_at<=?').bind(t)];if(id)statements.push(env.DB.prepare('DELETE FROM sessions WHERE student_id=?').bind(id));statements.push(env.DB.prepare('INSERT INTO sessions(token_mac,role,student_id,expires_at) VALUES(?,?,?,?)').bind(hash,role,id,t+(role==='teacher'?7200:28800)));await env.DB.batch(statements);return token}
function cleanAppearance(a){const out={};const values={character:['ranger','scout','knight','mage'],accessory:['scarf','cape','amulet','glasses','none']};for(const [k,v] of Object.entries(values))if(v.includes(a?.[k]))out[k]=a[k];for(const k of ['outfit','skin','hair'])if(a?.[k]==='default'||/^#[0-9a-f]{6}$/i.test(a?.[k]||''))out[k]=a[k];return out}
const num=(n,max=1000000)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
function summarize(data,ch){const max=ch==='relatifs'?6:5;let worlds=0,stars=0,correct=0,answered=0,errors=0,remediations=0,seconds=0;const topics=[];for(let w=0;w<max;w++){const records=data?.records?.[w]||{},runs=Object.values(data?.runs||{}).filter(r=>r?.world===w);let c=0,a=0,e=0,m=0,t=0;const levels=Object.values(records);if(levels.length)worlds++;for(const r of levels){stars+=num(r?.stars,3);c+=num(r?.correct);a+=num(r?.answered);e+=num(r?.errors);m+=num(r?.remediations);t+=num(r?.seconds)}for(const r of runs){c+=num(r.state?.firstCorrect);a+=num(r.state?.crystals);e+=num(r.state?.mathErrors);m+=num(r.state?.mathRemediations);t+=num(r.state?.mathSeconds)}correct+=c;answered+=a;errors+=e;remediations+=m;seconds+=t;topics.push({world:w,correct:c,answered:a,errors:e,remediations:m,seconds:t})}return {worlds,max,stars,correct,answered,errors,remediations,seconds,topics}}
const worlds=[['⚔️','Le royaume fragmenté','Fractions',4],['⛰️','Les montagnes de Pythagore','Pythagore',3],['🏛️','Les ruines de Thalès','Thalès',3],['🔭','L’observatoire des angles','Trigonométrie',4],['⚒️','Les forges de l’algèbre','Double distributivité',3],['🔮','La citadelle des identités','Identités remarquables',3]];

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[rand(0,a.length-1)], gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a), rnd=x=>Math.round(x*10)/10;
const fr=(n,d)=>{let g=gcd(n,d);return d/g===1?String(n/g):n/g+'/'+d/g}, sign=n=>n<0?'− '+Math.abs(n):'+ '+n, bin=(a,b)=>'('+ (a===1?'x':a+'x')+' '+sign(b)+')';
function q(t,expected,solution,hint,kind='num',labels=['Réponse'],diagram=''){return {t,expected:Array.isArray(expected)?expected:[expected],solution,hint,kind,labels,diagram}}
function tri(a,b,c,angle=''){return '<svg viewBox="0 0 310 205" width="310" role="img" aria-label="Triangle ABC rectangle en A, schéma non à l’échelle"><path d="M45 155 L45 35 L270 155 Z M45 141 H59 V155"/><text x="26" y="174">A</text><text x="26" y="27">B</text><text x="276" y="174">C</text><text x="8" y="95">'+esc(a)+'</text><text x="140" y="178">'+esc(b)+'</text><text x="155" y="83">'+esc(c)+'</text>'+(angle?'<text x="222" y="146">'+esc(angle)+'</text>':'')+'<text x="60" y="196" style="font-size:10px">Schéma non à l’échelle</text></svg>'}
function thal(bow){return bow?'<svg viewBox="0 0 300 180" width="300" role="img" aria-label="A D B et C D E alignés, AC et BE parallèles"><path d="M45 32 L255 148 M45 148 L255 32 M45 32 V148 M255 32 V148"/><text x="23" y="28">A</text><text x="23" y="164">C</text><text x="144" y="82">D</text><text x="263" y="164">B</text><text x="263" y="28">E</text><text x="90" y="174" style="font-size:10px">Schéma non à l’échelle</text></svg>':'<svg viewBox="0 0 300 190" width="300" role="img" aria-label="Triangle ABC, D sur AB, E sur AC"><path d="M150 20 L30 160 H270 Z M90 90 H210"/><text x="145" y="15">A</text><text x="13" y="175">B</text><text x="276" y="175">C</text><text x="70" y="88">D</text><text x="218" y="88">E</text><text x="90" y="184" style="font-size:10px">Schéma non à l’échelle</text></svg>'}
function make(w,i){
let a=rand(2,7),b=rand(2,8),c=rand(2,6),d=rand(2,9),s=pick([-1,1]),t=pick([-1,1]); let k=rand(2,5);
if(w===0){
 if(i===0){let m=pick([2,3,5,7]),n=m+1;return q('Simplifier '+(m*k)+'/'+(n*k)+' en fraction irréductible.',fr(m,n),'Diviser le numérateur et le dénominateur par '+k+'.','Cherche un diviseur commun.','frac')}
 if(i===1){let e=rand(2,5),f=e+1,op=pick([1,-1]);return q('Calculer '+a+'/'+e+' '+(op===1?'+':'−')+' '+b+'/'+f+'. Donner le résultat irréductible.',fr(a*f+op*b*e,e*f),'Mettre au même dénominateur '+e*f+', puis simplifier.','Cherche un dénominateur commun.','frac')}
 if(i===2)return q('Calculer ('+s*a+'/'+b+') × '+c+'/'+d+'. Donner le résultat irréductible.',fr(s*a*c,b*d),'Multiplier les numérateurs et les dénominateurs, puis simplifier.','Multiplie séparément numérateurs et dénominateurs.','frac');
 return q('Calculer '+a+'/'+b+' ÷ ('+s*c+'/'+d+'). Donner le résultat irréductible.',fr(s*a*d,b*c),'Diviser revient à multiplier par l’inverse.','Inverse la deuxième fraction.','frac')
}
if(w===1){let [u,v,h]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,12,15]]).map(x=>x*k);
 if(i===0)return q('ABC est rectangle en A. AB = '+u+' cm et AC = '+v+' cm. Calculer BC en cm.',h,'BC² = '+u+'² + '+v+'² = '+h*h+'.','Repère l’hypoténuse.','num',['BC (cm)'],tri(u,v,'?'));
 if(i===1)return q('ABC est rectangle en A. BC = '+h+' cm et AB = '+u+' cm. Calculer AC en cm.',v,'AC² = '+h+'² − '+u+'² = '+v*v+'.','Isole le carré du côté recherché.','num',['AC (cm)'],tri(u,'?',h));
 if(i===2)return q('Un triangle a pour côtés '+u+', '+v+' et '+h+' cm. Est-il rectangle ? Justifier sur ton brouillon.','oui','Le plus grand côté vérifie '+h+'² = '+u+'² + '+v+'². Réciproque de Pythagore.','Compare le carré du plus grand côté à la somme des deux autres carrés.','yn');
 return q('Un triangle a pour côtés '+u+', '+v+' et '+(h+1)+' cm. Est-il rectangle ? Justifier sur ton brouillon.','non','Les carrés sont différents : '+(h+1)**2+' ≠ '+(u*u+v*v)+'. Contraposée de Pythagore.','Teste l’égalité de Pythagore.','yn')
}
if(w===2){
 if(i===0)return q('D ∈ [AB], E ∈ [AC] et (DE) ∥ (BC). AD = '+a+' cm, AB = '+a*k+' cm, BC = '+b*k+' cm. Calculer DE en cm.',b,'DE/BC = AD/AB = 1/'+k+'.','Écris les rapports de Thalès.','num',['DE (cm)'],thal(false));
 if(i===1)return q('Les points A, D, B et C, D, E sont alignés dans cet ordre. (AC) ∥ (BE). AD = '+a+' cm, DB = '+a*k+' cm, DC = '+b+' cm. Calculer DE en cm.',b*k,'AD/DB = DC/DE = 1/'+k+'.','Dans le nœud papillon, repère les côtés correspondants.','num',['DE (cm)'],thal(true));
 if(i===2)return q('D ∈ [AB] et E ∈ [AC]. AD = '+a+', AB = '+a*k+', AE = '+b+', AC = '+b*k+' cm. (DE) et (BC) sont-elles parallèles ? Justifier sur ton brouillon.','oui','AD/AB = AE/AC = 1/'+k+' : réciproque de Thalès.','Compare AD/AB et AE/AC.','yn',['Réponse'],thal(false));
 return q('D ∈ [AB] et E ∈ [AC]. AD = '+a+', AB = '+a*k+', AE = '+b+', AC = '+(b*k+1)+' cm. (DE) et (BC) sont-elles parallèles ? Justifier sur ton brouillon.','non','AD/AB et AE/AC sont différents : contraposée de Thalès.','Compare les deux rapports.','yn',['Réponse'],thal(false))
}
if(w===3){let angle=pick([25,30,35,40,45,50,55,60,65]), h=rand(8,24),adj=rand(4,17),opp=rand(3,14),r=angle*Math.PI/180;
 if(i===0)return q('ABC est rectangle en A. BC = '+h+' cm, angle ACB = '+angle+'°. Calculer AB en cm, arrondi au dixième.',rnd(h*Math.sin(r)),'AB = '+h+' × sin('+angle+'°).','Sinus : opposé / hypoténuse.','num',['AB (cm)'],tri('?', '',h,angle+'°'));
 if(i===1)return q('ABC est rectangle en A. BC = '+h+' cm, angle ACB = '+angle+'°. Calculer AC en cm, arrondi au dixième.',rnd(h*Math.cos(r)),'AC = '+h+' × cos('+angle+'°).','Cosinus : adjacent / hypoténuse.','num',['AC (cm)'],tri('', '?',h,angle+'°'));
 if(i===2)return q('ABC est rectangle en A. AC = '+adj+' cm, angle ACB = '+angle+'°. Calculer AB en cm, arrondi au dixième.',rnd(adj*Math.tan(r)),'AB = '+adj+' × tan('+angle+'°).','Tangente : opposé / adjacent.','num',['AB (cm)'],tri('?',adj,'',angle+'°'));
 return q('ABC est rectangle en A. AB = '+opp+' cm, AC = '+adj+' cm. Calculer l’angle ACB en degrés, arrondi au dixième.',rnd(Math.atan(opp/adj)*180/Math.PI),'angle ACB = arctan('+opp+'/'+adj+').','Utilise tan⁻¹ ou arctan en mode degrés.','num',['Angle (°)'],tri(opp,adj,'','?'))
}
if(w===4){let B=s*b,D=t*d;let A=i===0?1:a,C=i<=1?1:c;if(i===3){let e=rand(1,5);return q('Développer et réduire '+bin(A,B)+bin(C,D)+' '+sign(e)+'x². Donner a, b et c dans ax² + bx + c.',[A*C+e,A*D+B*C,B*D],'Produit : chaque terme du premier facteur multiplie chaque terme du second, puis ajouter '+e+'x².','Fais les quatre produits, puis regroupe.','coeff',['a (x²)','b (x)','c (constant)'])}
 return q('Développer et réduire '+bin(A,B)+bin(C,D)+'. Donner a, b et c dans ax² + bx + c.',[A*C,A*D+B*C,B*D],'Quatre produits : '+A*C+'x², '+A*D+'x, '+B*C+'x, '+B*D+'.','Multiplie chaque terme du premier facteur par chaque terme du second.','coeff',['a (x²)','b (x)','c (constant)'])
}
let A=i===0?1:a,B=b;
if(i===0||i===1){let S=i===0?1:-1;return q('Développer '+bin(A,S*B)+'². Donner a, b et c dans ax² + bx + c.',[A*A,2*A*S*B,B*B],'Carré d’une somme ou différence : premier carré, double produit, second carré.','N’oublie pas le double produit.','coeff',['a (x²)','b (x)','c (constant)'])}
if(i===2)return q('Développer '+bin(A,B)+bin(A,-B)+'. Donner a, b et c dans ax² + bx + c.',[A*A,0,-B*B],'Produit d’une somme et d’une différence : différence de deux carrés.','Utilise (u + v)(u − v) = u² − v².','coeff',['a (x²)','b (x)','c (constant)']);
return q('Factoriser x² − '+B*B+'. Compléter (x + a)(x − a) avec a positif.',B,'x² − '+B*B+' = (x + '+B+')(x − '+B+').','Reconnais la différence de deux carrés.','num',['a'])
}

/* V0.8 — alternative families, same assessment blueprint and legacy compatibility. */
const baseMake=make;
function alternate(w,i){
 const a=rand(2,7),b=rand(2,8),c=rand(2,6),k=rand(2,5),s=pick([-1,1]),d=rand(3,9);
 if(w===0){
  if(i===0)return q('Simplifier −'+a*k+'/'+(a+1)*k+' en fraction irréductible.',fr(-a,a+1),'Diviser les deux termes par '+k+'.','Conserve le signe.','frac');
  if(i===1)return q('Calculer '+a+'/'+d+' − ('+s*b+'/'+(2*d)+'). Donner le résultat irréductible.',fr(2*a-s*b,2*d),'Mettre au dénominateur '+2*d+' puis soustraire.','Attention au signe entre parenthèses.','frac');
  if(i===2)return q('Calculer '+a+'/'+b+' × ('+s*c+'/'+(a*k)+'). Donner le résultat irréductible.',fr(s*c,b*k),'Simplifier le facteur commun '+a+', puis réduire.','Simplifie avant de multiplier.','frac');
  return q('Une potion contient '+a+'/'+d+' litre. On remplit des fioles de 1/'+b+' litre. Calculer le quotient exact, en fraction irréductible (sans arrondir).',fr(a*b,d),'Le quotient vaut '+a+'/'+d+' × '+b+'.','Diviser par 1/'+b+' revient à multiplier par '+b+'.','frac')
 }
 if(w===1){
  let [u,v,h]=pick([[3,4,5],[5,12,13],[8,15,17]]).map(x=>x*k);
  if(i===0){let U=a+3,V=b+5;return q('Un mur vertical et le sol forment un angle droit. Une échelle relie le pied situé à '+U+' m du mur à un point à '+V+' m de hauteur. Calculer la longueur de l’échelle en m, arrondie au dixième.',rnd(Math.sqrt(U*U+V*V)),'L² = '+U+'² + '+V+'².','Le mur et le sol sont les côtés de l’angle droit.','num',['Longueur (m)'],tri(V,U,'?'))}
  if(i===1)return q('Une rampe de '+h+' m relie le sol à une plateforme située à '+u+' m de hauteur. Le sol est horizontal et la hauteur verticale. Calculer la distance horizontale en m.',v,'Distance² = '+h+'² − '+u+'².','L’hypoténuse est la rampe.','num',['Distance (m)'],tri(u,'?',h));
  let H=i===2?h+1:h;return q('Un triangle a pour côtés '+u+', '+v+' et '+H+' cm. Pour justifier si le triangle est rectangle, calculer le carré du plus grand côté et la somme des carrés des deux autres côtés.',[H*H,u*u+v*v],'Comparer '+H*H+' et '+(u*u+v*v)+' : '+(H*H===u*u+v*v?'le triangle est rectangle.':'le triangle n’est pas rectangle.'),'Utilise la réciproque ou la contraposée de Pythagore.','coeff',['Carré du plus grand côté','Somme des deux autres carrés'])
 }
 if(w===2){
  if(i===0)return q('D ∈ [AB], E ∈ [AC], (DE) ∥ (BC). AD = '+a+', AB = '+a*k+', AE = '+b+' cm. Calculer AC en cm.',b*k,'AD/AB = AE/AC.','Écris les rapports correspondants.','num',['AC (cm)'],thal(false));
  if(i===1)return q('A, D, B et C, D, E sont alignés dans cet ordre. (AC) ∥ (BE). AD = '+a+', DB = '+a*k+', AC = '+b+' cm. Calculer BE en cm.',b*k,'AD/DB = AC/BE = 1/'+k+'.','Compare les deux triangles du nœud papillon.','num',['BE (cm)'],thal(true));
  const A=a*k,B=b*k+(i===2?1:0);return q('D ∈ [AB], E ∈ [AC]. AD = '+a+', AB = '+A+', AE = '+b+', AC = '+B+' cm. Pour tester le parallélisme, calculer les produits en croix AD × AC et AE × AB.',[a*B,b*A],'Les produits '+a*B+' et '+b*A+' sont '+(a*B===b*A?'égaux : réciproque de Thalès.':'différents : contraposée de Thalès.'),'Compare AD/AB et AE/AC.','coeff',['AD × AC','AE × AB'],thal(false))
 }
 if(w===3){let angle=pick([25,30,35,40,45,50,55,60,65]),rad=angle*Math.PI/180,n=rand(6,20);
  if(i===0)return q('ABC rectangle en A, AB = '+n+' cm, angle ACB = '+angle+'°. Calculer BC en cm, arrondi au dixième.',rnd(n/Math.sin(rad)),'BC = '+n+' / sin('+angle+'°).','Isole l’hypoténuse dans le rapport sinus.','num',['BC (cm)'],tri(n,'','?',angle+'°'));
  if(i===1)return q('ABC rectangle en A, AC = '+n+' cm, angle ACB = '+angle+'°. Calculer BC en cm, arrondi au dixième.',rnd(n/Math.cos(rad)),'BC = '+n+' / cos('+angle+'°).','Isole l’hypoténuse dans le rapport cosinus.','num',['BC (cm)'],tri('',n,'?',angle+'°'));
  if(i===2)return q('ABC rectangle en A, AB = '+n+' cm, angle ACB = '+angle+'°. Calculer AC en cm, arrondi au dixième.',rnd(n/Math.tan(rad)),'AC = '+n+' / tan('+angle+'°).','Isole le côté adjacent.','num',['AC (cm)'],tri(n,'?','',angle+'°'));
  let p=rand(3,n-1),use=pick(['sin','cos']);return q('ABC rectangle en A, BC = '+n+' cm, '+(use==='sin'?'AB':'AC')+' = '+p+' cm. Calculer l’angle ACB en degrés, arrondi au dixième.',rnd((use==='sin'?Math.asin(p/n):Math.acos(p/n))*180/Math.PI),'angle ACB = '+use+'⁻¹('+p+'/'+n+').','Calculatrice en mode degrés.','num',['Angle (°)'],tri(use==='sin'?p:'',use==='cos'?p:'',n,'?'))
 }
 if(w===4){let A=i===0?1:a,B=s*b,C=i<2?1:c,D=pick([-1,1])*d,E=i===3?rand(1,5):0;return q('Développer et réduire '+bin(A,B)+bin(C,D)+(E?' − '+E+'x':'')+'. Donner les coefficients de x², x et le terme constant.',[A*C,A*D+B*C-E,B*D],'Développer les quatre produits puis regrouper les termes de même degré.','Multiplie chaque terme du premier facteur par chaque terme du second.','coeff',['Coefficient de x²','Coefficient de x','Constante'])}
 let B=b,A=i===0?1:a;
 if(i<2){let S=i===0?1:-1;return q('Développer et réduire '+bin(A,S*B)+'² − '+B*B+'. Donner les coefficients de x², x et le terme constant.',[A*A,2*A*S*B,0],'Le terme constant du carré s’annule avec '+B*B+'.','Utilise l’identité remarquable puis réduis.','coeff',['Coefficient de x²','Coefficient de x','Constante'])}
 if(i===2)return q('Développer et réduire '+bin(A,B)+bin(A,-B)+' + '+B*B+'. Donner les coefficients de x², x et le terme constant.',[A*A,0,0],'La différence de deux carrés se simplifie.','Utilise (u + v)(u − v).','coeff',['Coefficient de x²','Coefficient de x','Constante']);
 return q('Factoriser '+A*A+'x² − '+B*B+'. Compléter (ax + b)(ax − b) avec a et b positifs.',[A,B],'Différence de deux carrés : ('+A+'x)² − '+B+'².','Identifie les deux carrés.','coeff',['a','b'])
}
make=function(w,i){return Math.random()<.5?baseMake(w,i):alternate(w,i)};


/* V1.0 — three additional templates per chapter/slot. */
const earlierMake=make;
function extended(w,i,j){
 const a=rand(2,7),b=rand(2,8),c=rand(2,6),d=rand(3,9),k=rand(2,5),s=pick([-1,1]),t=pick([-1,1]);
 const F=(text,n,den,sol)=>q(text+' Donner le résultat irréductible.',fr(n,den),sol,'Écris les étapes sur ton brouillon.','frac');
 const N=(text,value,sol,label='Réponse',diagram='')=>q(text,value,sol,'Identifie la propriété utile.','num',[label],diagram);
 const C=(text,values,sol,labels=['Coefficient de x²','Coefficient de x','Constante'])=>q(text,values,sol,'Écris les étapes sur ton brouillon.','coeff',labels);
 const Y=(text,yes,sol)=>q(text,yes?'oui':'non',sol,'Justifie en comparant les deux membres.','yn');
 if(w===0){
  if(i===0){let m=a+1,n=a,den=m*k,num=n*k;if(j===0)return F('Réduire '+num+'/'+den+' à sa plus simple expression.',n,m,'Diviser les deux termes par '+k+'.');if(j===1)return F('Écrire '+(-den)+'/'+num+' sous forme irréductible.',-m,n,'Le quotient est négatif ; diviser par '+k+'.');return F('Une réserve compte '+num+' cristaux bleus sur '+den+' cristaux. Quelle fraction représente les cristaux bleus ?',n,m,'La proportion vaut '+num+'/'+den+'.')}
  if(i===1){if(j===0)return F('Calculer '+a+'/'+d+' + '+b+'/'+(d*k)+'.',a*k+b,d*k,'Multiplier les deux termes de la première fraction par '+k+'.');if(j===1)return F('Calculer 1 − '+a+'/'+(a+k)+'.',k,a+k,'Écrire 1 = '+(a+k)+'/'+(a+k)+'.');return F('Calculer '+a+'/'+d+' − '+b+'/'+d+' + '+c+'/'+d+'.',a-b+c,d,'Le dénominateur est commun.')}
  if(i===2){if(j===0)return F('Calculer '+s*a+' × '+b+'/'+d+'.',s*a*b,d,'Écrire l’entier sur 1.');if(j===1)return F('Calculer ('+(-a)+'/'+b+') × ('+(-c)+'/'+d+').',a*c,b*d,'Le produit de deux nombres négatifs est positif.');return F('Calculer les '+a+'/'+(a+k)+' de '+b+'/'+d+' litre.',a*b,(a+k)*d,'Prendre une fraction d’une quantité revient à multiplier.')}
  if(j===0)return F('Calculer '+a+'/'+b+' ÷ '+d+'.',a,b*d,'Multiplier par 1/'+d+'.');if(j===1)return F('Calculer '+a+' ÷ '+b+'/'+d+' (le diviseur est la fraction '+b+'/'+d+').',a*d,b,'Multiplier par '+d+'/'+b+'.');return F('Calculer ('+(-a)+'/'+b+') ÷ ('+(-c)+'/'+d+').',a*d,b*c,'Multiplier par l’inverse du second nombre négatif.')
 }
 if(w===1){
  let [u,v,h]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]).map(x=>x*k);
  if(i===0){if(j===0)return N('Un rectangle mesure '+u+' m sur '+v+' m. Calculer sa diagonale en m.',h,'d² = '+u+'² + '+v+'².','Diagonale (m)');if(j===1)return N('Une tour verticale de '+u+' m est reliée par un câble à un point du sol horizontal situé à '+v+' m de son pied. Calculer la longueur du câble.',h,'Le câble est l’hypoténuse.','Longueur (m)');return N('Deux chemins perpendiculaires mesurent '+a+' m et '+d+' m. Calculer la distance directe entre leurs extrémités, au dixième.',rnd(Math.hypot(a,d)),'d² = '+a+'² + '+d+'².','Distance (m)')}
  if(i===1){if(j===0)return N('Un rectangle a une diagonale de '+h+' cm et une largeur de '+u+' cm. Calculer sa longueur.',v,'L² = '+h+'² − '+u+'².','Longueur (cm)');if(j===1)return N('Une échelle de '+h+' m repose contre un mur vertical. Son pied est à '+v+' m du mur, sur un sol horizontal. Calculer la hauteur atteinte.',u,'Hauteur² = '+h+'² − '+v+'².','Hauteur (m)');return N('Un triangle DEF est rectangle en E. DF = '+h+' cm, EF = '+v+' cm. Calculer DE.',u,'DE² = DF² − EF².','DE (cm)')}
  let H=(j===0||j===2&&i===3)?h:h+1,yes=H===h;
  if(j===0)return Y('Un triangle de côtés '+v+', '+h+' et '+u+' cm est-il rectangle ?',true,h+'² = '+v+'² + '+u+'².');
  if(j===1)return Y('Un constructeur a mesuré les trois côtés d’un triangle : '+u+', '+v+' et '+H+' m. Peut-il affirmer que le triangle est rectangle ?',yes,'Comparer '+H*H+' et '+(u*u+v*v)+'.');
  return C('Le plus grand côté d’un triangle mesure '+H+' cm ; les autres mesurent '+u+' et '+v+' cm. Calculer la différence entre le carré du plus grand côté et la somme des deux autres carrés.',[H*H-u*u-v*v],'Une différence nulle caractérise un triangle rectangle.',['Différence (cm²)'])
 }
 if(w===2){
  if(i===0){if(j===0)return N('D ∈ [AB], E ∈ [AC], (DE) ∥ (BC). AD = '+a+', DB = '+a*(k-1)+', DE = '+b+' cm. Calculer BC.',b*k,'AB = AD + DB ; BC/DE = AB/AD.','BC (cm)',thal(false));if(j===1)return N('D ∈ [AB], E ∈ [AC], (DE) ∥ (BC). AB = '+a*k+', AD = '+a+', AC = '+b*k+' cm. Calculer AE.',b,'AE/AC = AD/AB.','AE (cm)',thal(false));return N('Deux triangles ABC et ADE ont D sur [AB], E sur [AC] et (DE) ∥ (BC). AE = '+b+', AC = '+b*k+', AB = '+a*k+' cm. Calculer AD.',a,'AD/AB = AE/AC.','AD (cm)',thal(false))}
  if(i===1){const pre='A, D, B et C, D, E sont alignés dans cet ordre. (AC) ∥ (BE). ';if(j===0)return N(pre+'AD = '+a+', DB = '+a*k+', BE = '+b*k+' cm. Calculer AC.',b,'AC/BE = AD/DB.','AC (cm)',thal(true));if(j===1)return N(pre+'DC = '+b+', DE = '+b*k+', DB = '+a*k+' cm. Calculer AD.',a,'AD/DB = DC/DE.','AD (cm)',thal(true));return N(pre+'AD = '+a+', DB = '+a*k+', DE = '+b*k+' cm. Calculer DC.',b,'DC/DE = AD/DB.','DC (cm)',thal(true))}
  let yes=j===0?i===3:j===1?i===2:pick([true,false]),B=b*k+(yes?0:1);
  if(j===0)return Y('D ∈ [AB], E ∈ [AC]. AD = '+a+', DB = '+a*(k-1)+', AE = '+b+', AC = '+B+' cm. Les droites (DE) et (BC) sont-elles parallèles ?',yes,'AB = '+a*k+' ; comparer AD/AB et AE/AC.');
  if(j===1)return Y('A, D, B et C, D, E sont alignés dans cet ordre. AD = '+a+', DB = '+a*k+', DC = '+b+', DE = '+B+' cm. Les droites (AC) et (BE) sont-elles parallèles ?',yes,'Comparer AD/DB et DC/DE.');
  return C('D ∈ [AB], E ∈ [AC]. AD = '+a+', AB = '+a*k+', AE = '+b+', AC = '+B+' cm. Calculer la différence AD × AC − AE × AB.',[a*B-b*a*k],'Une différence nulle signifie que les rapports sont égaux.',['Différence'])
 }
 if(w===3){let angle=pick([25,30,35,40,45,50,55,60,65]),r=angle*Math.PI/180,n=rand(7,22),p=rand(2,n-1),prefix='ABC est rectangle en A. ';
  if(i===0){if(j===0)return N(prefix+'BC = '+n+' cm, angle ABC = '+angle+'°. Calculer AC au dixième.',rnd(n*Math.sin(r)),'AC = BC × sin(ABC).','AC (cm)');if(j===1)return N('Une échelle de '+n+' m fait un angle de '+angle+'° avec le sol horizontal. Calculer la hauteur atteinte au dixième.',rnd(n*Math.sin(r)),'La hauteur est opposée à l’angle.','Hauteur (m)');return N(prefix+'AC = '+n+' cm, angle ABC = '+angle+'°. Calculer BC au dixième.',rnd(n/Math.sin(r)),'BC = AC / sin(ABC).','BC (cm)')}
  if(i===1){if(j===0)return N(prefix+'BC = '+n+' cm, angle ABC = '+angle+'°. Calculer AB au dixième.',rnd(n*Math.cos(r)),'AB = BC × cos(ABC).','AB (cm)');if(j===1)return N('Une rampe de '+n+' m fait un angle de '+angle+'° avec le sol horizontal. Calculer sa projection horizontale au dixième.',rnd(n*Math.cos(r)),'La projection est adjacente à l’angle.','Distance (m)');return N(prefix+'AB = '+n+' cm, angle ABC = '+angle+'°. Calculer BC au dixième.',rnd(n/Math.cos(r)),'BC = AB / cos(ABC).','BC (cm)')}
  if(i===2){if(j===0)return N(prefix+'AB = '+n+' cm, angle ABC = '+angle+'°. Calculer AC au dixième.',rnd(n*Math.tan(r)),'AC = AB × tan(ABC).','AC (cm)');if(j===1)return N('À '+n+' m du pied d’une tour verticale, on vise son sommet sous un angle de '+angle+'° par rapport à l’horizontale (visée depuis le sol). Calculer la hauteur au dixième.',rnd(n*Math.tan(r)),'La hauteur vaut distance × tangente.','Hauteur (m)');return N(prefix+'AC = '+n+' cm, angle ABC = '+angle+'°. Calculer AB au dixième.',rnd(n/Math.tan(r)),'AB = AC / tan(ABC).','AB (cm)')}
  let trig=j===0?'sin':j===1?'cos':'tan',value=j===0?Math.asin(p/n):j===1?Math.acos(p/n):Math.atan(p/n);
  return N(prefix+(j===0?'AC = '+p+', BC = '+n:j===1?'AB = '+p+', BC = '+n:'AC = '+p+', AB = '+n)+' cm. Calculer l’angle ABC au dixième de degré.',rnd(value*180/Math.PI),'angle ABC = '+trig+'⁻¹('+p+'/'+n+').','Angle (°)')
 }
 if(w===4){let A=i===0?1:a,B=s*b,Cc=i<2?1:c,D=t*d,m=i===3?k:1,base=[A*Cc,A*D+B*Cc,B*D];if(j===0)return C('Développer et réduire '+bin(A,B)+bin(Cc,D)+' + '+k+'x. Donner les trois coefficients.',[base[0],base[1]+k,base[2]],'Développer puis ajouter '+k+'x.');if(j===1)return C('Développer et réduire −'+m+bin(A,B)+bin(Cc,D)+'. Donner les trois coefficients.',base.map(v=>-m*v),'Développer puis multiplier tous les termes par −'+m+'.');return C('Développer et réduire '+bin(A,B)+bin(Cc,D)+' − '+bin(A,-B)+bin(Cc,D)+'. Donner les trois coefficients.',[0,2*B*Cc,2*B*D],'Développer les deux produits puis soustraire chacun des termes.')}
 let A=i===0?1:a,B=b,sg=i===1?-1:1;
 if(i<2){if(j===0)return C('Développer et réduire '+bin(A,sg*B)+'² + '+k+'x. Donner les trois coefficients.',[A*A,2*A*sg*B+k,B*B],'Utiliser le carré puis ajouter '+k+'x.');if(j===1)return C('Développer et réduire −'+bin(A,sg*B)+'². Donner les trois coefficients.',[-A*A,-2*A*sg*B,-B*B],'Changer le signe de chaque terme après développement.');return C('Développer et réduire '+bin(A,sg*B)+'² − '+A*A+'x². Donner les trois coefficients.',[0,2*A*sg*B,B*B],'Les termes en x² s’annulent.')}
 if(i===2){if(j===0)return C('Développer et réduire '+bin(A,B)+bin(A,-B)+' − '+k+'x. Donner les trois coefficients.',[A*A,-k,-B*B],'Utiliser la différence de deux carrés.');if(j===1)return C('Développer et réduire '+k+bin(A,B)+bin(A,-B)+'. Donner les trois coefficients.',[k*A*A,0,-k*B*B],'Multiplier la différence de deux carrés par '+k+'.');return C('Développer et réduire '+bin(A,B)+bin(A,-B)+' − '+A*A+'x². Donner les trois coefficients.',[0,0,-B*B],'Les termes en x² s’annulent.')}
 if(j===0)return C('Factoriser x² + '+2*B+'x + '+B*B+'. Compléter (x + b)² avec b positif.',[B],'Carré d’une somme.',['b']);
 if(j===1)return C('Factoriser x² − '+2*B+'x + '+B*B+'. Compléter (x − b)² avec b positif.',[B],'Carré d’une différence.',['b']);
 return C('Factoriser '+A*A+'x² + '+2*A*B+'x + '+B*B+'. Compléter (ax + b)² avec a et b positifs.',[A,B],'Carré d’une somme.',['a','b'])
}
make=function(w,i){let j=rand(0,4);return j<2?earlierMake(w,i):extended(w,i,j-2)};

function normalize(v){return String(v??'').trim().replace(/−/g,'-').replace(/,/g,'.').replace(/\s/g,'').toLowerCase()}
function correct(Q,ans){if(!Array.isArray(Q.expected)||!Array.isArray(ans)||ans.length!==Q.expected.length)return false;return Q.expected.every((e,i)=>{const a=normalize(ans[i]);if(!a)return false;if(Q.kind==='yn')return a===e;if(Q.kind==='frac'){const m=a.match(/^([+-]?\d+)(?:\/([1-9]\d*))?$/);if(!m)return false;const n=Number(m[1]),d=Number(m[2]||1);return Number.isSafeInteger(n)&&Number.isSafeInteger(d)&&gcd(n,d)===1&&fr(n,d)===String(e)}return /^[-+]?\d+(?:\.\d+)?$/.test(a)&&Math.abs(Number(a)-Number(e))<1e-8})}
function expected(Q){return Q.expected.join(' ; ').replace(/\./g,',')}
function build(w){return Array.from({length:4},(_,i)=>({...make(w,i),w,i}))}
function makeHomework(){return worlds.flatMap((_,w)=>Array.from({length:4},(_,i)=>{let Q;if((w===1||w===2)&&i===2)Q=alternate(w,Math.random()<.5?2:3);else if((w===1||w===2)&&i===3)Q=baseMake(w,Math.random()<.5?2:3);else Q=baseMake(w,i);return {...Q,w,i}}))}

function marks(S){return worlds.map((w,i)=>S.qs.reduce((sum,Q,j)=>sum+(Q.w===i&&correct(Q,S.answers[j])?w[3]/4:0),0))}


/* DNB: authoritative server-side questions, one attempt per student, no answer keys in drafts. */
const DNB_ASSIGNMENT='noel-2026-v1';
function dnbAnswers(qs,raw){if(!Array.isArray(raw)||raw.length!==qs.length)fail('Réponses invalides.');return raw.map((a,i)=>{if(a===null)return null;if(!Array.isArray(a)||a.length!==qs[i].labels.length||a.some(v=>typeof v!=='string'||v.length>80))fail('Réponse invalide.');return a.map(v=>v.trim())})}
function dnbResult(row){let qs=JSON.parse(row.questions),answers=JSON.parse(row.answers),S={qs,answers};let points=marks(S);return {format:'astreon-dnb-report-v1',version:'server-1',student:row.student_id,created:new Date(row.created_at*1000).toISOString(),submitted:row.submitted_at?new Date(row.submitted_at*1000).toISOString():null,questions:qs.map((Q,j)=>({chapter:Q.w,slot:Q.i,text:Q.t,kind:Q.kind,expected:Q.expected,labels:Q.labels,response:answers[j]})),points,total:points.reduce((a,b)=>a+b,0)}}
function dnbPublic(row){let qs=JSON.parse(row.questions),answers=JSON.parse(row.answers),finished=!!row.submitted_at;return {assignment:DNB_ASSIGNMENT,student:row.student_id,qs:finished?qs:qs.map(({t,kind,labels,diagram,w,i})=>({t,kind,labels,diagram,w,i})),answers,at:row.position,finished,created:new Date(row.created_at*1000).toISOString(),submitted:finished?new Date(row.submitted_at*1000).toISOString():null,...(finished?{result:dnbResult(row)}:{})}}
async function dnbRead(env,id){return env.DB.prepare('SELECT * FROM dnb_attempts WHERE student_id=? AND assignment=?').bind(id,DNB_ASSIGNMENT).first()}
async function dnbRoutes(req,env,path,method){
 if(path==='/teacher/dnb/results'&&method==='GET'){await auth(env,req,'teacher');const {results}=await env.DB.prepare('SELECT a.*,s.classroom FROM dnb_attempts a JOIN students s ON s.id=a.student_id WHERE a.assignment=? AND a.submitted_at IS NOT NULL ORDER BY s.classroom,s.pseudo').bind(DNB_ASSIGNMENT).all();return response({assignment:DNB_ASSIGNMENT,reports:results.map(r=>({...dnbResult(r),classroom:r.classroom}))})}
 const s=await auth(env,req,'student'),id=s.student_id;
 if(path==='/student/dnb/start'&&method==='POST'){let row=await dnbRead(env,id);if(!row){let qs=makeHomework();await env.DB.prepare('INSERT OR IGNORE INTO dnb_attempts(student_id,assignment,questions,answers,position,created_at) VALUES(?,?,?,?,?,?)').bind(id,DNB_ASSIGNMENT,JSON.stringify(qs),JSON.stringify(qs.map(()=>null)),0,now()).run();row=await dnbRead(env,id)}return response(dnbPublic(row))}
 if(path==='/student/dnb/attempt'&&method==='GET'){let row=await dnbRead(env,id);return response({attempt:row?dnbPublic(row):null})}
 if((path==='/student/dnb/save'&&method==='PUT')||(path==='/student/dnb/submit'&&method==='POST')){
 let row=await dnbRead(env,id);if(!row)fail('Aucun devoir commencé.',404);if(row.submitted_at){if(path.endsWith('/submit'))return response(dnbPublic(row));fail('Devoir déjà remis.',409)}
 let b=await json(req,16000),qs=JSON.parse(row.questions),answers=dnbAnswers(qs,b.answers),pos=Number.isInteger(b.at)?Math.max(0,Math.min(23,b.at)):row.position,submit=path.endsWith('/submit'),timestamp=submit?now():null;
 const changed=await env.DB.prepare('UPDATE dnb_attempts SET answers=?,position=?,submitted_at=? WHERE student_id=? AND assignment=? AND submitted_at IS NULL AND EXISTS(SELECT 1 FROM sessions WHERE token_mac=? AND expires_at>?)').bind(JSON.stringify(answers),pos,timestamp,id,DNB_ASSIGNMENT,s.hash,now()).run();if(!changed.meta.changes)fail('Devoir verrouillé ou session expirée.',409);row=await dnbRead(env,id);return response(submit?dnbPublic(row):{ok:true})
 }
 fail('Route inconnue.',404)
}

export default {async fetch(req,env){
 try{
 const url=new URL(req.url),path=url.pathname.replace(/\/+$/,'')||'/';const method=req.method,origin=req.headers.get('Origin');
 if(origin&&origin!==ORIGIN)return response({error:'Origine interdite.'},403);
 if(method==='OPTIONS')return response({},200);
 if(path==='/health'&&method==='GET')return response({ok:true,version:1,dnb:1,configured:!!(env.DB&&env.AUTH_PEPPER&&env.ADMIN_SECRET)});
 if(!env.DB||typeof env.AUTH_PEPPER!=='string'||env.AUTH_PEPPER.length<32||typeof env.ADMIN_SECRET!=='string'||env.ADMIN_SECRET.length<24)fail('Service non configuré.',503);
 if(path==='/teacher/login'&&method==='POST'){const b=await json(req,4096);await loginLimit(env,req,'teacher','admin');if(typeof b.password!=='string'||b.password.length>256||!equal(await mac(env,'admin',b.password),await mac(env,'admin',env.ADMIN_SECRET)))fail('Identifiants incorrects.',401);return response({token:await session(env,'teacher')})}
 if(path==='/student/login'&&method==='POST'){const b=await json(req,4096),id=norm(b.name);if(!id||id.length>24||typeof b.password!=='string'||b.password.length>128)fail('Identifiants incorrects.',401);await loginLimit(env,req,'student',id);const u=await env.DB.prepare('SELECT * FROM students WHERE id=? AND active=1').bind(id).first();const h=await mac(env,'password',id+'|'+b.password);if(!u||!equal(h,u.password_mac))fail('Identifiants incorrects.',401);return response({token:await session(env,'student',id),id:u.id,name:u.pseudo,appearance:JSON.parse(u.appearance)})}
 if(path==='/teacher/dnb/results'||path.startsWith('/student/dnb/'))return await dnbRoutes(req,env,path,method);
 if(path.startsWith('/teacher/')){
 const s=await auth(env,req,'teacher');
 if(path==='/teacher/logout'&&method==='POST'){await env.DB.prepare('DELETE FROM sessions WHERE token_mac=?').bind(s.hash).run();return response({ok:true})}
 if(path==='/teacher/students'&&method==='GET'){const {results:users}=await env.DB.prepare('SELECT id,pseudo,classroom,created_at,active FROM students ORDER BY classroom,pseudo LIMIT 500').all();const {results:rows}=await env.DB.prepare('SELECT student_id,chapter,data,updated_at FROM progress').all();const map=new Map();for(const r of rows){let summary;try{summary=summarize(JSON.parse(r.data),r.chapter)}catch{continue}if(!map.has(r.student_id))map.set(r.student_id,{});map.get(r.student_id)[r.chapter]={...summary,updated_at:r.updated_at}}return response({students:users.map(u=>({...u,chapters:map.get(u.id)||{}}))})}
 if(path==='/teacher/students'&&method==='POST'){const b=await json(req,4096);if(!plain(b.pseudo,24)||!plain(b.classroom,32)||!/^[-_\p{L}\p{N} ]+$/u.test(b.pseudo))fail('Pseudo ou classe invalide.');const id=norm(b.pseudo);if(await env.DB.prepare('SELECT id FROM students WHERE id=?').bind(id).first())fail('Ce pseudo existe déjà.',409);const count=await env.DB.prepare('SELECT COUNT(*) AS n FROM students').first();if(count.n>=500)fail('Limite de 500 comptes atteinte.',409);const password=random(12);await env.DB.prepare('INSERT INTO students(id,pseudo,classroom,password_mac,created_at) VALUES(?,?,?,?,?)').bind(id,b.pseudo.trim(),b.classroom.trim(),await mac(env,'password',id+'|'+password),now()).run();return response({name:b.pseudo.trim(),password},201)}
 if(path==='/teacher/reset'&&method==='POST'){const b=await json(req,4096),id=norm(b.id);if(!await env.DB.prepare('SELECT id FROM students WHERE id=?').bind(id).first())fail('Compte introuvable.',404);const password=random(12);await env.DB.batch([env.DB.prepare('UPDATE students SET password_mac=? WHERE id=?').bind(await mac(env,'password',id+'|'+password),id),env.DB.prepare('DELETE FROM sessions WHERE student_id=?').bind(id)]);return response({name:id,password})}
 if(path==='/teacher/delete'&&method==='POST'){const b=await json(req,4096),id=norm(b.id);await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE student_id=?').bind(id),env.DB.prepare('DELETE FROM progress WHERE student_id=?').bind(id),env.DB.prepare('DELETE FROM dnb_attempts WHERE student_id=?').bind(id),env.DB.prepare('DELETE FROM students WHERE id=?').bind(id)]);return response({ok:true})}
 fail('Route inconnue.',404);
 }
 if(path.startsWith('/student/')){
 const s=await auth(env,req,'student');
 if(path==='/student/logout'&&method==='POST'){await env.DB.prepare('DELETE FROM sessions WHERE token_mac=?').bind(s.hash).run();return response({ok:true})}
 const ch=path.split('/')[2];if(!CHAPTERS.includes(ch))fail('Chapitre inconnu.',404);
 if(method==='GET'){const r=await env.DB.prepare('SELECT data FROM progress WHERE student_id=? AND chapter=?').bind(s.student_id,ch).first();return response({progress:r?JSON.parse(r.data):null})}
 if(method==='PUT'){const b=await json(req);if(!b.progress||typeof b.progress!=='object'||Array.isArray(b.progress))fail('Progression invalide.');const data=JSON.stringify(b.progress);if(enc.encode(data).length>420000)fail('Sauvegarde trop volumineuse.',413);const app=JSON.stringify(cleanAppearance(b.appearance));const guard='EXISTS(SELECT 1 FROM sessions WHERE token_mac=? AND expires_at>?)';const t=now();const result=await env.DB.batch([env.DB.prepare('INSERT INTO progress(student_id,chapter,data,updated_at) SELECT ?,?,?,? WHERE '+guard+' ON CONFLICT(student_id,chapter) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at').bind(s.student_id,ch,data,t,s.hash,t),env.DB.prepare('UPDATE students SET appearance=? WHERE id=? AND '+guard).bind(app,s.student_id,s.hash,t)]);if(!result[0].meta.changes)fail('Session expirée.',401);return response({ok:true})}
 }
 fail('Route inconnue.',404);
 }catch(e){return response({error:e.status?e.message:'Erreur du service. Aucun détail sensible n’est publié.'},e.status||500)}
}};
