/* Astréon V1.18: bounded, deterministic Scratch-inspired interpreter. No eval or network. */
(function(root){
'use strict';
const spec={
 move:{label:'avancer de',color:'motion',value:40,suffix:'pas'},
 turn:{label:'tourner à droite de',color:'motion',value:90,suffix:'°'},
 direction:{label:'s’orienter à',color:'motion',value:90,suffix:'°'},
 pen:{label:'stylo en position d’écriture',color:'pen'},
 lift:{label:'relever le stylo',color:'pen'},
 set:{label:'mettre nombre à',color:'variable',value:0},
 add:{label:'ajouter à nombre',color:'variable',value:1},
 mul:{label:'multiplier nombre par',color:'variable',value:2},
 say:{label:'dire la valeur de nombre',color:'looks'},
 repeat:{label:'répéter',color:'control',value:4,suffix:'fois',branches:['body']},
 if:{label:'si nombre >',color:'control',value:10,suffix:'alors',branches:['body','otherwise']}
};
function node(op){if(!Object.hasOwn(spec,op))throw Error('Bloc inconnu.');let s=spec[op],n={op};if(Object.hasOwn(s,'value'))n.value=s.value;for(let b of s.branches||[])n[b]=[];return n}
function clean(program){
 let count=0;
 function list(p,depth){
  if(!Array.isArray(p)||depth>5)throw Error('Imbrication limitée à cinq niveaux.');
  return p.map(b=>{if(++count>100)throw Error('Programme limité à 100 blocs.');if(!b||!Object.hasOwn(spec,b.op))throw Error('Bloc inconnu.');let n=node(b.op),s=spec[b.op];if(Object.hasOwn(s,'value')){if(!Number.isFinite(b.value)||Math.abs(b.value)>1000||b.op==='repeat'&&(!Number.isInteger(b.value)||b.value<0||b.value>50))throw Error('Valeur de bloc invalide. Répéter : de 0 à 50 fois.');n.value=b.value}for(let br of s.branches||[])n[br]=list(b[br],depth+1);return n})
 }return list(program,0)
}
const clone=s=>JSON.parse(JSON.stringify(s)),round=n=>Math.round(n*1e8)/1e8;
function execute(program,initial={}){
 let p=clean(program),s={x:0,y:0,d:90,n:initial.n??0,pen:false,said:null,path:[],distance:0},frames=[],steps=0;
 function emit(b,address,description){frames.push({address:address.join('/'),description,state:clone(s)})}
 function run(list,address){
  for(let i=0;i<list.length;i++){
   let b=list[i],v=b.value,at=[...address,i];if(++steps>500)throw Error('Exécution arrêtée : limite de 500 instructions.');
   switch(b.op){
    case 'move':{let from=[s.x,s.y];s.x=round(s.x+v*Math.sin(s.d*Math.PI/180));s.y=round(s.y+v*Math.cos(s.d*Math.PI/180));s.distance+=Math.abs(v);if(s.pen&&v!==0)s.path.push([from,[s.x,s.y]]);emit(b,at,'avancer de '+v+' pas');break}
    case 'turn':s.d=((s.d+v)%360+360)%360;emit(b,at,'tourner de '+v+'°');break;
    case 'direction':s.d=((v%360)+360)%360;emit(b,at,'direction '+v+'°');break;
    case 'pen':s.pen=true;emit(b,at,'stylo baissé');break;
    case 'lift':s.pen=false;emit(b,at,'stylo levé');break;
    case 'set':s.n=v;emit(b,at,'nombre = '+s.n);break;
    case 'add':s.n=round(s.n+v);emit(b,at,'nombre = '+s.n);break;
    case 'mul':s.n=round(s.n*v);emit(b,at,'nombre = '+s.n);break;
    case 'say':s.said=s.n;emit(b,at,'dire '+s.n);break;
    case 'repeat':emit(b,at,'répéter '+v+' fois');for(let j=0;j<v;j++){if(++steps>500)throw Error('Exécution arrêtée : limite de 500 instructions.');run(b.body,[...at,'body'])}break;
    case 'if':{let yes=s.n>v;emit(b,at,'nombre > '+v+' : '+(yes?'vrai':'faux'));run(yes?b.body:b.otherwise,[...at,yes?'body':'otherwise']);break}
   }
   if(!Number.isFinite(s.n)||Math.abs(s.n)>1e12||Math.abs(s.x)>10000||Math.abs(s.y)>10000)throw Error('Valeur ou déplacement trop grand pour cette scène.');
  }
 }run(p,[]);return {state:s,frames,steps}
}
function contains(p,op){return p.some(b=>b.op===op||(spec[b.op].branches||[]).some(k=>contains(b[k],op)))}
function close(a,b){return Math.abs(a-b)<1e-5}
function polygon(s,n,length){
 let path=s.path;if(path.length!==n)return false;
 let vertices=path.map(seg=>seg[0]),end=path[n-1][1];
 if(!close(end[0],vertices[0][0])||!close(end[1],vertices[0][1]))return false;
 if(new Set(vertices.map(v=>v.map(x=>Math.round(x*1e5)).join(','))).size!==n)return false;
 let vec=path.map(([a,b])=>[b[0]-a[0],b[1]-a[1]]);
 if(!path.every(([a,b],i)=>{let next=path[(i+1)%n][0];return close(b[0],next[0])&&close(b[1],next[1])&&close(Math.hypot(...vec[i]),length)}))return false;
 let target=2*Math.PI/n,turns=vec.map(([x,y],i)=>{let [a,b]=vec[(i+1)%n];return Math.atan2(x*b-y*a,x*a+y*b)});
 return turns.every(t=>close(t,target))||turns.every(t=>close(t,-target))
}
const missions=[
 {title:'Le sceau carré',task:'Trace un carré fermé de côté 60 pas. Utilise une boucle et le stylo.',hint:'Répéter quatre fois : avancer de 60 et tourner de 90 degrés. Baisse le stylo avant la boucle.',required:['repeat','pen'],cases:[0],check:s=>polygon(s,4,60)},
 {title:'Le triangle des runes',task:'Trace un triangle équilatéral fermé de côté 70 pas. Utilise une boucle.',hint:'Le tour complet correspond à 360 degrés. L’angle de rotation extérieur est 360 divisé par 3.',required:['repeat','pen'],cases:[0],check:s=>polygon(s,3,70)},
 {title:'Le compteur d’énergie',task:'Quel que soit le nombre initial, ajoute 4 à nombre, cinq fois, en utilisant une boucle. Affiche le résultat.',hint:'Le nombre initial est déjà présent dans la variable. Ne le remplace pas par une valeur fixe.',required:['repeat','say'],cases:[0,3,-2,7],check:(s,n)=>s.n===n+20&&s.said===n+20},
 {title:'La porte conditionnelle',task:'Si nombre est strictement supérieur à 10, ajoute 5 ; sinon retire 2. Affiche la valeur finale. Le programme doit marcher pour plusieurs valeurs de départ.',hint:'Utilise si… sinon… avec le seuil 10. Les deux branches ne sont pas exécutées ensemble.',required:['if','say'],cases:[-3,0,10,11,20],check:(s,n)=>s.n===(n>10?n+5:n-2)&&s.said===s.n},
 {title:'Les engrenages imbriqués',task:'Utilise deux boucles imbriquées : trois séries de quatre ajouts de 2 à nombre. Affiche la valeur finale.',hint:'Place une boucle de quatre répétitions à l’intérieur d’une boucle de trois répétitions.',required:['repeat','say'],cases:[0,5,-4],check:(s,n)=>s.n===n+24&&s.said===s.n,nested:true},
 {title:'La machine à calculer',task:'Pour tout nombre initial, multiplie-le par 3 puis ajoute 2. Si le résultat est supérieur à 13, ajoute encore 5 ; sinon retire 5. Affiche le résultat.',hint:'Les deux premières instructions sont communes. Place ensuite la condition et termine par dire nombre.',required:['mul','add','if','say'],cases:[-3,0,3,4,8],check:(s,n)=>{let a=3*n+2;return s.n===(a>13?a+5:a-5)&&s.said===s.n}}
];
function nestedRepeat(p,inside=false){return p.some(b=>b.op==='repeat'&&inside||(spec[b.op].branches||[]).some(k=>nestedRepeat(b[k],inside||b.op==='repeat')))}
function assess(program,index){let p=clean(program),m=missions[index];if(!m)throw Error('Mission inconnue.');let missing=m.required.filter(op=>!contains(p,op));if(m.nested&&!nestedRepeat(p))missing.push('boucles imbriquées');let tests=m.cases.map(n=>{let s=execute(p,{n}).state;return {n,ok:!!m.check(s,n),state:s}});return {ok:!missing.length&&tests.every(t=>t.ok),missing,tests}}
root.AstreonStudio=Object.freeze({spec,node,clean,execute,assess,missions,polygon});
})(globalThis);