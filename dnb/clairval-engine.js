/* Clairval — original top-down exploration engine. Local, no network. */
(function(root){
'use strict';
const W=26,H=20,T=40,spawn=[5,10],bridgeRows=[9,10];
const sites=[
 {id:'potion',name:'Herboristerie de Lyra',npc:'Lyra',x:4,y:6,building:[2,2,5,4],color:'#418d72',hero:'mage',chapter:'Fractions'},
 {id:'ladder',name:'Atelier d’Orion',npc:'Orion',x:8,y:6,building:[7,3,4,3],color:'#a47d4c',hero:'ranger',chapter:'Pythagore'},
 {id:'bridge',name:'Le pont de Nahla',npc:'Nahla',x:10,y:9,color:'#bd9455',hero:'scout',chapter:'Thalès',requires:['potion','ladder']},
 {id:'stars',name:'Observatoire d’Hipparque',npc:'Hipparque',x:17,y:6,building:[15,2,5,4],color:'#637fc0',hero:'mage',chapter:'Trigonométrie'},
 {id:'forge',name:'Forge de Bram',npc:'Bram',x:22,y:7,building:[21,3,4,4],color:'#ad694f',hero:'knight',chapter:'Double distributivité'},
 {id:'mirror',name:'Sanctuaire d’Euclide',npc:'Euclide',x:21,y:17,building:[19,13,5,4],color:'#967cba',hero:'mage',chapter:'Identités remarquables'},
 {id:'robot',name:'Laboratoire d’Ada',npc:'Ada',x:15,y:17,building:[14,13,4,4],color:'#418b9f',hero:'scout',chapter:'Scratch'}
];
const trees=[[1,1],[2,8],[1,13],[3,15],[5,18],[8,17],[10,14],[1,18],[14,1],[23,1],[24,12],[18,10],[25,18],[13,18],[9,1],[7,13],[3,12],[16,8],[23,9],[7,19],[15,11]];
const secrets=[{id:'spring',name:'Source de jade',x:2,y:17},{id:'rune',name:'Rune de la colline',x:9,y:2},{id:'shell',name:'Coquillage d’or',x:24,y:18}];
const finale={id:'final',name:'Le coffre de l’Aube',x:24,y:10};
const residents=[{id:'guide',name:'Le garde de Clairval',x:6,y:9,npc:'Garde',hero:'knight',color:'#496f91'},{id:'merchant',name:'Le marchand ambulant',x:4,y:13,npc:'Marchand',hero:'scout',color:'#af7651'}];
const ids=sites.map(s=>s.id);
function hash(s){let n=2166136261;for(let c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0}
function fresh(seed){return {version:1,seed:seed>>>0,pos:spawn.slice(),done:[],found:[],final:false}}
function clean(raw,seed){let s=fresh(Number.isInteger(raw?.seed)?raw.seed:seed);s.done=[...new Set((Array.isArray(raw?.done)?raw.done:[]).filter(x=>ids.includes(x)))];if(!s.done.includes('potion')||!s.done.includes('ladder'))s.done=s.done.filter(x=>['potion','ladder'].includes(x));if(!s.done.includes('bridge'))s.done=s.done.filter(x=>['potion','ladder'].includes(x));s.found=[...new Set((Array.isArray(raw?.found)?raw.found:[]).filter(x=>secrets.some(t=>t.id===x)))];s.final=s.done.length===7&&raw?.final===true;if(Array.isArray(raw?.pos)&&raw.pos.length===2&&raw.pos.every(Number.isInteger)&&walkable(raw.pos[0],raw.pos[1],s))s.pos=raw.pos.slice();return s}
function walkable(x,y,s){if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=W||y>=H)return false;if(x===11||x===12)return bridgeRows.includes(y)&&s.done.includes('bridge');if(trees.some(t=>t[0]===x&&t[1]===y))return false;return !sites.some(q=>q.building&&x>=q.building[0]&&x<q.building[0]+q.building[2]&&y>=q.building[1]&&y<q.building[1]+q.building[3])}
function adjacent(a,b){return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])<=1}
function path(from,to,s){if(!walkable(...from,s)||!walkable(...to,s))return null;let q=[from],seen=new Map([[from.join(','),null]]);for(let n=0;n<q.length;n++){let p=q[n],key=p.join(',');if(p[0]===to[0]&&p[1]===to[1]){let route=[];for(let k=key;seen.get(k)!==null;k=seen.get(k))route.push(k.split(',').map(Number));return route.reverse()}for(let [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){let t=[p[0]+dx,p[1]+dy],k=t.join(',');if(!seen.has(k)&&walkable(...t,s)){seen.set(k,key);q.push(t)}}}return null}
function canQuest(id,s){let q=sites.find(x=>x.id===id);return !!q&&(q.requires||[]).every(x=>s.done.includes(x))&&(q.x<11||s.done.includes('bridge'))}
function mission(id,seed){
 let n=hash(seed+':'+id),k=2+n%4,a=2+n%5,b=3+(n>>>4)%5,ang=[30,35,40,45,50][n%5],h=10*k;
 switch(id){
 case 'potion':return {intro:'Le village manque d’élixir. Prépare le mélange demandé par Lyra pour soigner les habitants.',task:'Prépare '+12*k+' doses : 1/6 de rosée, 1/3 de miel et 1/2 de nectar.',labels:['Rosée','Miel','Nectar'],expected:[2*k,4*k,6*k],kind:'dose',max:12*k,hint:'Divise le nombre total de doses par 6, par 3 et par 2.',success:'Les habitants ont retrouvé leurs forces. Lyra te confie le sceau de la vie.'};
 case 'ladder':return {intro:'La cloche du village est inaccessible. Orion veut construire une échelle.',task:'Le pied de l’échelle est à '+3*k+' m du mur vertical. La fenêtre est à '+4*k+' m du sol. Choisis la longueur de l’échelle, du sol à la fenêtre.',labels:['Longueur (m)'],expected:[5*k],kind:'ladder',max:8*k,base:3*k,height:4*k,hint:'Le mur et le sol sont perpendiculaires : utilise le théorème de Pythagore.',success:'La cloche sonne de nouveau ! Orion peut prévenir les voyageurs.'};
 case 'bridge':return {intro:'Les ouvriers attendent les soins de Lyra et les outils d’Orion. Nahla te confie le dernier support du pont.',task:'Les supports verticaux sont parallèles. Le premier mesure '+a+' m, à '+b+' m de l’origine. Le second se trouve à '+b*k+' m de l’origine. Règle sa hauteur pour atteindre le tablier.',labels:['Hauteur (m)'],expected:[a*k],kind:'bridge',max:a*k+8,small:b,large:b*k,height:a,hint:'Utilise Thalès : hauteur du grand support / hauteur du petit = '+b*k+' / '+b+'.',success:'Le pont est réparé. Tu peux explorer la rive orientale !'};
 case 'stars':return {intro:'Un rayon doit atteindre une balise pour éclairer le sanctuaire.',task:'La balise se trouve à '+h+' m horizontalement et à '+Math.round(h*Math.tan(ang*Math.PI/180)*10)/10+' m au-dessus du télescope. Oriente-le au degré près.',labels:['Angle (°)'],expected:[ang],kind:'stars',max:90,distance:h,height:Math.round(h*Math.tan(ang*Math.PI/180)*10)/10,hint:'Calcule l’arc tangente du rapport hauteur / distance horizontale, en degrés.',success:'La balise s’allume et révèle le sceau des étoiles.'};
 case 'forge':return {intro:'Bram fabrique une plaque rectangulaire pour réparer les machines de la rive.',task:'Les côtés mesurent (x + '+a+') et (2x + '+b+') mètres. Règle les trois engrenages pour obtenir l’aire sous la forme Ax² + Bx + C.',labels:['A','B','C'],expected:[2,b+2*a,a*b],kind:'coeff',hint:'Multiplie chacun des deux termes du premier facteur par chacun des deux termes du second, puis réduis.',success:'Les roues tournent ensemble. La forge est de nouveau en activité.'};
 case 'mirror':return {intro:'Le miroir du sanctuaire est composé de deux carrés superposés.',task:'On retire un carré de côté (x − '+a+') d’un carré de côté (x + '+a+'), avec x > '+a+'. L’aire restante vaut Kx. Trouve K puis l’aire pour x = '+(a+3)+'.',labels:['K','Aire (cm²)'],expected:[4*a,4*a*(a+3)],kind:'coeff',hint:'Développe les deux carrés à l’aide des identités remarquables, puis soustrais les expressions.',success:'Les reflets s’alignent. Le sceau du miroir apparaît.'};
 case 'robot':return {intro:'Ada a besoin d’un programme pour que son automate délimite un carré de protection.',task:'Programme une boucle pour tracer un carré fermé de côté '+20*k+' pas. Choisis le nombre de répétitions, la longueur et l’angle de rotation à droite.',labels:['Répétitions','Avancer (pas)','Tourner (°)'],expected:[4,20*k,90],kind:'robot',hint:'Un tour complet fait 360°. Un carré possède quatre côtés de même longueur.',success:'L’automate trace le carré et déverrouille le dernier sceau.'};
 default:throw Error('Mission inconnue')
 }
}
function check(m,raw){if(!Array.isArray(raw)||raw.length!==m.expected.length)return false;return raw.every((v,i)=>{let s=String(v??'').trim().replace(',','.');return /^[-+]?\d+(?:\.\d+)?$/.test(s)&&Number(s)===m.expected[i]})}
function complete(s,id,answers){if(!canQuest(id,s)||!check(mission(id,s.seed),answers))return false;if(!s.done.includes(id))s.done.push(id);return true}
root.ClairvalEngine=Object.freeze({W,H,T,spawn,sites,trees,secrets,finale,residents,ids,hash,fresh,clean,walkable,adjacent,path,canQuest,mission,check,complete});
})(globalThis);