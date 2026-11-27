/* Astréon workshops: pure mission engine, no network or student data. */
(function(root){
'use strict';
const potions=[
 {name:'Élixir de lumière',total:12,parts:[1,2,3],den:6,colors:['Lune','Soleil','Cristal']},
 {name:'Potion du rempart',total:24,parts:[3,2,3],den:8,colors:['Lune','Soleil','Cristal']},
 {name:'Élixir de renaissance',total:30,parts:[2,3,5],den:10,colors:['Lune','Soleil','Cristal']}
];
const bridges=[
 {name:'Le passage du ruisseau',base:12,small:4,large:12,height:3},
 {name:'Le pont des gorges',base:20,small:8,large:20,height:6},
 {name:'Le viaduc des gardiens',base:30,small:12,large:30,height:8}
];
// The right triangle is measured in metres; the requested aim is rounded to a whole degree.
const stars=[
 {name:'L’étoile de l’aube',distance:20,height:15},
 {name:'La constellation du dragon',distance:30,height:40},
 {name:'Le phare céleste',distance:25,height:12}
];
const mazes=[
 {name:'La porte mécanique',grid:['#####','#S..#','###.#','#..G#','#####'],dir:1},
 {name:'Le couloir des runes',grid:['######','#S...#','#.##.#','#.#..#','#...G#','######'],dir:1},
 {name:'Le labyrinthe de cuivre',grid:['#######','#S..#.#','###.#.#','#...#.#','#.###.#','#....G#','#######'],dir:1}
];
function potionGoal(m){return m.parts.map(p=>m.total*p/m.den)}
function potionOK(m,a){return a.length===3&&a.every((n,i)=>n===potionGoal(m)[i])}
function bridgeGoal(m){return m.large*m.height/m.small}
function starGoal(m){return Math.round(Math.atan2(m.height,m.distance)*180/Math.PI)}
function simulate(m,commands){
 let x=0,y=0,d=m.dir;for(let j=0;j<m.grid.length;j++){let i=m.grid[j].indexOf('S');if(i>=0){x=i;y=j;break}}
 let path=[[x,y]],states=[{x,y,d}],hit=false;
 for(let op of commands){if(op==='L')d=(d+3)%4;else if(op==='R')d=(d+1)%4;else if(op==='F'){
  let nx=x+[0,1,0,-1][d],ny=y+[-1,0,1,0][d];if(!m.grid[ny]||!m.grid[ny][nx]||m.grid[ny][nx]==='#'){hit=true;break}x=nx;y=ny;path.push([x,y])
 }else throw Error('Bloc inconnu');states.push({x,y,d})}
 return {x,y,d,path,states,hit,won:!hit&&m.grid[y][x]==='G'}
}
function shortest(m){let start=simulate(m,[]),queue=[[]],seen=new Set([start.x+':'+start.y+':'+start.d]);while(queue.length){let cmds=queue.shift(),s=simulate(m,cmds);if(s.won)return cmds;for(let op of ['F','L','R']){let next=[...cmds,op],t=simulate(m,next),id=t.x+':'+t.y+':'+t.d;if(!t.hit&&!seen.has(id)){seen.add(id);queue.push(next)}}}return null}
root.AstreonWorkshops=Object.freeze({potions,bridges,stars,mazes,potionGoal,potionOK,bridgeGoal,starGoal,simulate,shortest});
})(globalThis);