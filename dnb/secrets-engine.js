/* Astréon V1.24 — spatial puzzle rooms, local inventory. */
(function(root){
'use strict';
const W=11,H=9,T=48;
const rooms=[
 {id:'cave',name:'La citerne oubliée',theme:['#bee5d5','#78b8b2','#377b80'],kind:'crate',start:[5,7],gate:[7,3],key:[2,2],chest:[8,1],box:[5,5],plates:[[4,4],[5,4],[6,4]],labels:[6,8,10],target:1,clue:'Le réservoir contient 12 litres. Les deux tiers alimentent la source. Pousse la caisse sur la dalle portant cette quantité.',hint:'Calcule 12 × 2/3. Place-toi derrière la caisse pour la pousser.',map:['###########','#.........#','#.........#','#######G###','#.........#','#.........#','#..#...#..#','#.........#','###########']},
 {id:'temple',name:'Les cloches de pierre',theme:['#f0dfb8','#d0b786','#9a7951'],kind:'sequence',start:[5,7],gate:[8,3],key:[8,2],chest:[2,1],switches:[[2,5],[5,5],[8,5]],labels:['5 et 12','3 et 4','6 et 8'],target:[1,2,0],clue:'Chaque cloche porte les deux côtés de l’angle droit d’un triangle rectangle. Fais sonner les cloches dans l’ordre croissant des hypoténuses.',hint:'Calcule les racines carrées de 5²+12², 3²+4² et 6²+8².',map:['###########','#.........#','#.........#','########G##','#.........#','#.........#','#..#...#..#','#.........#','###########']},
 {id:'vault',name:'Les lanternes du miroir',theme:['#e4e0f3','#b4afd9','#7773a9'],kind:'lights',start:[5,7],gate:[2,3],key:[3,1],chest:[8,2],switches:[[2,5],[5,4],[8,6]],labels:['A','B','C'],target:[1,0,1],clue:'Développe (x + 3)² sous la forme Ax² + Bx + C. Une lanterne doit briller si son coefficient est impair. Chaque levier inverse sa lanterne et la suivante (C agit aussi sur A).',hint:'Les coefficients sont 1, 6, 9. Il faut allumer A et C seulement.',map:['###########','#.........#','#.........#','##G########','#.........#','#..#...#..#','#.........#','#.........#','###########']}
];
const same=(a,b)=>a&&b&&a[0]===b[0]&&a[1]===b[1],near=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])<=1;
function room(id){return rooms.find(r=>r.id===id)}
function fresh(r){return {pos:r.start.slice(),box:r.box?.slice()||null,sequence:[],lights:[0,0,0],open:false,key:false,found:false}}
function floor(r,s,p){let [x,y]=p,t=r.map[y]?.[x];return Number.isInteger(x)&&Number.isInteger(y)&&!!t&&t!=='#'&&(t!=='G'||s.open)}
function clean(r,a){let s=fresh(r);if(!a)return s;if(a.found===true){s.open=s.key=s.found=true}else{s.open=a.open===true;s.key=s.open&&a.key===true}
 if(r.kind==='crate'&&Array.isArray(a.box)&&a.box.length===2&&floor(r,s,a.box)&&!same(a.box,r.key)&&!same(a.box,r.chest))s.box=a.box.slice();
 if(r.kind==='sequence'&&Array.isArray(a.sequence)&&a.sequence.length<=3&&a.sequence.every((v,i)=>v===r.target[i]))s.sequence=a.sequence.slice();
 if(r.kind==='lights'&&Array.isArray(a.lights)&&a.lights.length===3&&a.lights.every(n=>n===0||n===1))s.lights=a.lights.slice();
 if(Array.isArray(a.pos)&&a.pos.length===2&&floor(r,s,a.pos)&&!same(a.pos,s.box))s.pos=a.pos.slice();return s
}
function refresh(r,s){if(r.kind==='crate'&&same(s.box,r.plates[r.target])||r.kind==='sequence'&&s.sequence.length===3||r.kind==='lights'&&s.lights.every((n,i)=>n===r.target[i]))s.open=true}
function move(r,s,dx,dy){if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)+Math.abs(dy)!==1)return 'blocked';let p=[s.pos[0]+dx,s.pos[1]+dy];if(!floor(r,s,p))return 'blocked';if(same(p,s.box)){let b=[p[0]+dx,p[1]+dy];if(!floor(r,s,b)||same(b,r.gate)||same(b,r.key)||same(b,r.chest))return 'blocked';s.box=b;refresh(r,s)}s.pos=p;if(s.open&&!s.key&&same(p,r.key)){s.key=true;return 'key'}return 'move'}
function interact(r,s){if(near(s.pos,r.chest)){if(!s.key)return 'locked';if(s.found)return 'found';s.found=true;return 'reward'}let i=(r.switches||[]).findIndex(p=>same(s.pos,p));if(i<0)return 'none';if(s.open)return 'open';if(r.kind==='sequence'){if(i===r.target[s.sequence.length])s.sequence.push(i);else{s.sequence=i===r.target[0]?[i]:[];return 'wrong'}}else if(r.kind==='lights'){s.lights[i]^=1;s.lights[(i+1)%3]^=1}refresh(r,s);return s.open?'open':'switch'}
function path(r,s,to){if(!floor(r,s,to)||same(to,s.box))return null;let queue=[s.pos],seen=new Map([[s.pos.join(),null]]);for(let n=0;n<queue.length;n++){let p=queue[n],k=p.join();if(same(p,to)){let out=[];for(let j=k;seen.get(j)!==null;j=seen.get(j))out.push(j.split(',').map(Number));return out.reverse()}for(let [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){let q=[p[0]+dx,p[1]+dy],id=q.join();if(floor(r,s,q)&&!same(q,s.box)&&!seen.has(id)){seen.set(id,k);queue.push(q)}}}return null}
function eligible(r,areas){return areas?.[r.id]?.solved===3&&areas[r.id].relic===true}
root.AstreonSecrets=Object.freeze({W,H,T,rooms,room,fresh,clean,floor,move,interact,path,near,same,eligible});
})(globalThis);