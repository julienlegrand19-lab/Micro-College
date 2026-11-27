/* Clairval V1.25 — optional village life, no effect on assessed work. */
(function(root){
'use strict';
const places=[
{id:'shepherd',name:'Maëlle, la bergère',npc:'Maëlle',x:2,y:14,hero:'ranger',color:'#70875b'},
{id:'lostsheep',name:'Biscotte, la brebis',npc:'Biscotte',x:6,y:16,animal:'sheep'},
{id:'courier',name:'Éloi, le messager',npc:'Éloi',x:8,y:11,hero:'scout',color:'#b89555'},
{id:'keeper',name:'Soline, la bibliothécaire',npc:'Soline',x:20,y:10,hero:'mage',color:'#806f9e'}
];
const patrols=[
{id:'gardener',name:'Le jardinier',npc:'Jardinier',hero:'ranger',color:'#5d9468',path:[[1,5],[1,6],[1,7],[1,6]],words:'Les fleurs de la rive ouest ont besoin de lumière et d’eau. Prends le temps de regarder autour de toi.'},
{id:'traveller',name:'La voyageuse',npc:'Voyageuse',hero:'scout',color:'#ad735b',path:[[19,8],[20,8],[21,8],[20,8]],words:'On dit que les donjons cachent d’autres passages derrière leurs trésors.'}
];
const animals=[
{kind:'sheep',path:[[5,14],[6,14],[6,15],[5,15]]},
{kind:'chicken',path:[[2,10],[3,10],[3,11],[2,11]]},
{kind:'chicken',path:[[8,13],[9,13],[9,14],[8,14]]},
{kind:'cat',path:[[17,10],[17,11],[18,11],[18,12]]},
{kind:'butterfly',path:[[14,7],[15,7],[15,8],[14,8]]}
];
const titles={sheep:'Une brebis égarée',letter:'Le courrier des deux rives',market:'Les provisions du marché'};
const weather=[{id:'sun',name:'Soleil doux'},{id:'breeze',name:'Brise et pétales'},{id:'rain',name:'Petite averse lumineuse'}];
function clean(raw){return {sheep:['looking','found','done'].includes(raw?.sheep)?raw.sheep:'new',letter:['carrying','done'].includes(raw?.letter)?raw.letter:'new',market:raw?.market===true,weather:['auto',...weather.map(w=>w.id)].includes(raw?.weather)?raw.weather:'auto'}}
function market(seed){let n=(seed>>>0)%5,a=3+n,b=5+n,total=2*a+3*b,budget=Math.ceil((total+7)/10)*10;return {a,b,total,budget,change:budget-total}}
function progress(s){return Number(s.sheep==='done')+Number(s.letter==='done')+Number(s.market)}
function act(s,id,done,answer,seed){switch(id){
case 'shepherd':if(s.sheep==='new'){s.sheep='looking';return 'start'}if(s.sheep==='found'){s.sheep='done';return 'reward'}return s.sheep==='done'?'done':'looking';
case 'lostsheep':if(s.sheep==='looking'){s.sheep='found';return 'found'}return s.sheep==='new'?'unstarted':s.sheep==='done'?'done':'found';
case 'courier':if(s.letter==='new'){s.letter='carrying';return 'start'}return s.letter==='done'?'done':'carrying';
case 'keeper':if(!done.includes('bridge'))return 'blocked';if(s.letter==='carrying'){s.letter='done';return 'reward'}return s.letter==='done'?'done':'unstarted';
case 'merchant':if(s.market)return 'done';if(typeof answer==='string'&&/^\d+$/.test(answer.trim())&&Number(answer)===market(seed).change){s.market=true;return 'reward'}return 'wrong';
default:return 'none'}}
function position(path,t,offset=0,duration=2100){let f=(Math.max(0,t)+offset)/duration,i=Math.floor(f)%path.length,j=(i+1)%path.length,u=f-Math.floor(f);return [path[i][0]+(path[j][0]-path[i][0])*u,path[i][1]+(path[j][1]-path[i][1])*u]}
function condition(setting,t){return setting==='auto'?weather[Math.floor(Math.max(0,t)/45000)%weather.length]:weather.find(w=>w.id===setting)||weather[0]}
root.ClairvalLife=Object.freeze({places,patrols,animals,titles,weather,clean,market,progress,act,position,condition});
})(globalThis);