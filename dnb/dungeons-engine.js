/* V1.23 — room-based adventure, independent of all graded activities. */
(function(root){
'use strict';
const W=11,H=8,T=52;
const data=[
 {id:'cave',name:'La grotte des eaux vives',requires:'potion',relic:'Perle des eaux',theme:['#629c9b','#d0e0b5','#356f76'],rooms:[['Les bassins','dose'],['Le passage submergé','path'],['La chambre des sources','fraction']]},
 {id:'temple',name:'Le temple des hauteurs',requires:'ladder',relic:'Aigle de pierre',theme:['#d4c297','#f2e7cb','#a29375'],rooms:[['La salle du treuil','ladder'],['Les piliers du temple','bridge'],['La chambre du soleil','angle']]},
 {id:'vault',name:'Les archives de cristal',requires:'mirror',relic:'Cristal des anciens',theme:['#b8b2d6','#e2e4f0','#7e83b6'],rooms:[['Les inscriptions','algebra'],['Le miroir brisé','identity'],['L’automate des archives','robot']]}
];
const entry=[5,6],device=[5,3],door=[5,1],chest=[8,2],walls=[[2,2],[2,3],[8,4],[8,5],[3,5]];
function walkable(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=1&&x<W-1&&y>=1&&y<H-1&&!walls.some(p=>p[0]===x&&p[1]===y)}
const adjacent=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])<=1;
function path(from,to){if(!walkable(...from)||!walkable(...to))return null;let queue=[from],seen=new Map([[from.join(),null]]);for(let i=0;i<queue.length;i++){let p=queue[i],key=p.join();if(key===to.join()){let r=[];for(let k=key;seen.get(k)!==null;k=seen.get(k))r.push(k.split(',').map(Number));return r.reverse()}for(let [x,y] of [[1,0],[0,1],[-1,0],[0,-1]]){let q=[p[0]+x,p[1]+y],k=q.join();if(walkable(...q)&&!seen.has(k)){seen.set(k,key);queue.push(q)}}}return null}
function fresh(seed){return {seed:seed>>>0,areas:{}}}
function clean(raw,seed){let s=fresh(Number.isInteger(raw?.seed)?raw.seed:seed);for(let d of data){let a=raw?.areas?.[d.id];if(!a)continue;let solved=Number.isInteger(a.solved)?Math.max(0,Math.min(3,a.solved)):0,room=Number.isInteger(a.room)?Math.max(0,Math.min(2,solved,a.room)):0;s.areas[d.id]={solved,room,relic:solved===3&&a.relic===true,pos:Array.isArray(a.pos)&&a.pos.length===2&&walkable(...a.pos)?a.pos.slice():entry.slice()}}return s}
function area(s,id){return s.areas[id]||(s.areas[id]={room:0,solved:0,relic:false,pos:entry.slice()})}
function allowed(id,done){return data.some(d=>d.id===id&&Array.isArray(done)&&done.includes(d.requires))}
function hash(s){let h=2166136261;for(let c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function puzzle(id,room,seed){let d=data.find(x=>x.id===id);if(!d||!d.rooms[room])throw Error('Salle inconnue');let kind=d.rooms[room][1],n=hash(seed+':'+id+':'+room),k=2+n%4,a=2+n%5,b=3+(n>>>4)%4,angle=[30,35,40,45,50][n%5],distance=10*k;let m={kind,title:d.rooms[room][0]};
 switch(kind){
 case 'dose':return {...m,task:'Les bassins doivent contenir '+12*k+' litres : 1/4 dans le bassin de gauche, 1/3 dans celui du centre, le reste à droite.',labels:['Gauche (L)','Centre (L)','Droite (L)'],expected:[3*k,4*k,5*k],max:12*k,hint:'Calcule d’abord les deux premières fractions du total, puis soustrais.'};
 case 'path':return {...m,task:'Un passage mesure '+20*k+' dalles. Les 3/5 sont inondées. Place le levier sur le nombre de dalles encore sèches.',labels:['Dalles sèches'],expected:[8*k],max:20*k,hint:'La fraction restante vaut 2/5.'};
 case 'fraction':return {...m,task:'Les sources remplissent 1/3 et 1/4 du réservoir. Choisis la fraction irréductible représentant la partie déjà remplie.',labels:['Numérateur','Dénominateur'],expected:[7,12],hint:'Utilise 12 comme dénominateur commun.'};
 case 'ladder':return {...m,task:'Le treuil doit tendre un câble depuis un point situé à '+3*k+' m du pied de la tour jusqu’à une poulie à '+4*k+' m de haut. Quelle longueur faut-il ?',labels:['Câble (m)'],expected:[5*k],max:8*k,base:3*k,height:4*k,hint:'Le câble est l’hypoténuse d’un triangle rectangle.'};
 case 'bridge':return {...m,task:'Deux piliers verticaux soutiennent un plan incliné. Le premier mesure '+a+' m à '+b+' m de l’origine. Le second se trouve à '+b*k+' m. Règle sa hauteur.',labels:['Hauteur (m)'],expected:[a*k],max:a*k+8,small:b,large:b*k,height:a,hint:'Les piliers sont parallèles. Utilise le théorème de Thalès.'};
 case 'angle':return {...m,task:'Le miroir doit envoyer un rayon vers une cible située à '+distance+' m horizontalement et '+Math.round(distance*Math.tan(angle*Math.PI/180)*10)/10+' m plus haut. Règle l’angle au degré près.',labels:['Angle (°)'],expected:[angle],max:90,distance,height:Math.round(distance*Math.tan(angle*Math.PI/180)*10)/10,hint:'Utilise arctan(hauteur / distance), en degrés.'};
 case 'algebra':return {...m,task:'La porte porte l’inscription (x + '+a+')(2x − '+b+'). Règle les trois cadrans pour écrire Ax² + Bx + C.',labels:['A','B','C'],expected:[2,2*a-b,-a*b],hint:'Développe quatre produits, puis regroupe les termes de même degré.'};
 case 'identity':return {...m,task:'L’aire du miroir vaut (x + '+a+')². Inscris ses coefficients sous la forme Ax² + Bx + C.',labels:['A','B','C'],expected:[1,2*a,a*a],hint:'(u + v)² = u² + 2uv + v².'};
 case 'robot':return {...m,task:'Programme l’automate pour tracer un hexagone régulier fermé de côté '+20*k+' pas. Règle la boucle, la distance et l’angle extérieur de rotation.',labels:['Répétitions','Avancer (pas)','Tourner à droite (°)'],expected:[6,20*k,60],hint:'Un tour complet fait 360°, partagé en six rotations.'};
 }
}
function check(m,ans){return Array.isArray(ans)&&ans.length===m.expected.length&&ans.every((x,i)=>/^[-+]?\d+(?:[.,]\d+)?$/.test(String(x).trim())&&Number(String(x).replace(',','.'))===m.expected[i])}
function solve(s,id,room,ans){let a=area(s,id);if(room!==a.room||room>a.solved||!check(puzzle(id,room,s.seed),ans))return false;a.solved=Math.max(a.solved,room+1);return true}
function advance(s,id){let a=area(s,id);if(a.room>=2||a.solved<=a.room)return false;a.room++;a.pos=entry.slice();return true}
function collect(s,id){let a=area(s,id);if(a.room!==2||a.solved!==3||!adjacent(a.pos,chest))return false;a.relic=true;return true}
root.AstreonDungeons=Object.freeze({W,H,T,data,entry,device,door,chest,walls,walkable,adjacent,path,fresh,clean,area,allowed,puzzle,check,solve,advance,collect});
})(globalThis);