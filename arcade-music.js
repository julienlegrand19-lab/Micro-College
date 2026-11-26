/* Bande originale du Royaume : compositions originales synthétisées en Web Audio. */
(function(root){
'use strict';
const key='micro-college-arcade-music-v1';
// Each theme has a 32-step lead, eight bass roots, its own tempo and instrumentation.
// 0 = silence. MIDI pitches, original motifs.
const themes={
 arcade:{name:'Arcade',bpm:125,lead:[72,76,79,76,74,77,81,77,71,74,79,74,69,72,76,72,72,76,84,79,74,77,81,77,71,74,83,79,72,76,79,0],bass:[48,50,43,45,48,50,43,48],wave:'triangle',beat:'light'},
 'relatifs:0':{name:'Les lucioles',bpm:102,lead:[67,71,74,79,76,74,71,0,69,72,76,81,79,76,72,0,74,76,79,83,81,79,76,74,72,71,69,74,67,0,71,0],bass:[43,47,45,48,50,47,45,43],wave:'sine',beat:'light'},
 'relatifs:1':{name:'Échos du basalte',bpm:91,lead:[55,0,58,62,60,0,58,55,53,0,57,60,62,0,60,57,55,62,67,65,63,62,58,0,57,60,62,58,55,0,0,0],bass:[43,43,41,41,39,39,38,43],wave:'triangle',beat:'heavy'},
 'relatifs:2':{name:'Le cœur des machines',bpm:133,lead:[64,64,67,0,71,67,64,59,62,62,65,0,69,65,62,57,60,67,72,67,60,64,67,0,59,62,66,69,67,64,62,0],bass:[40,40,38,38,36,36,35,40],wave:'square',beat:'machine'},
 'relatifs:3':{name:'Orbites lointaines',bpm:80,lead:[69,0,76,81,0,83,76,0,67,0,74,79,0,81,74,0,65,0,72,77,79,0,84,0,64,71,76,0,74,0,69,0],bass:[45,45,43,43,41,41,40,45],wave:'sine',beat:'space'},
 'relatifs:4':{name:'La marche du dragon',bpm:120,lead:[62,65,69,62,70,69,65,62,60,64,67,60,69,67,64,60,58,62,65,70,69,65,62,58,57,60,64,69,67,65,62,0],bass:[38,38,36,36,34,34,33,38],wave:'sawtooth',beat:'heavy'},
 'relatifs:5':{name:'Le temple de l’Éclipse',bpm:111,lead:[66,69,73,78,77,73,69,66,65,68,72,77,76,72,68,65,64,68,71,76,74,71,68,64,61,65,68,73,72,68,66,0],bass:[42,42,41,41,40,40,37,42],wave:'triangle',beat:'heavy'},
 'pyramides:0':{name:'Le soleil du Nil',bpm:106,lead:[62,65,66,69,72,69,66,65,60,62,65,66,69,66,65,62,58,62,65,69,70,69,65,62,57,60,62,65,66,65,62,0],bass:[38,38,36,36,34,34,33,38],wave:'triangle',beat:'desert'},
 'pyramides:1':{name:'Les obélisques endormis',bpm:86,lead:[64,0,65,68,71,0,68,65,62,0,64,65,69,0,65,64,60,64,65,69,72,69,65,64,59,62,64,68,65,64,0,0],bass:[40,40,38,38,36,36,35,40],wave:'sine',beat:'desert'},
 'pyramides:2':{name:'La danse des papyrus',bpm:122,lead:[69,72,73,76,73,72,69,67,65,69,72,73,76,73,72,69,67,70,72,77,76,72,70,67,64,67,69,73,72,69,67,0],bass:[45,45,41,41,43,43,40,45],wave:'triangle',beat:'desert'},
 'pyramides:3':{name:'Sous les sables',bpm:98,lead:[57,60,64,65,64,60,57,0,58,61,65,68,65,61,58,0,55,58,62,65,62,58,55,0,56,60,63,67,63,60,57,0],bass:[33,33,34,34,31,31,32,33],wave:'triangle',beat:'heavy'},
 'pyramides:4':{name:'Le sceptre éternel',bpm:118,lead:[60,61,64,67,68,67,64,61,58,61,63,67,70,67,63,61,56,60,61,65,68,65,61,60,55,59,62,65,67,64,60,0],bass:[36,36,34,34,32,32,31,36],wave:'sawtooth',beat:'desert'},
 'litteral:0':{name:'Les jardins des lettres',bpm:96,lead:[72,76,79,0,81,79,76,72,74,77,81,0,84,81,77,74,71,74,77,79,81,79,77,74,72,76,79,84,79,76,72,0],bass:[48,48,50,50,47,47,43,48],wave:'sine',beat:'light'},
 'litteral:1':{name:'La forge des coefficients',bpm:128,lead:[60,64,67,60,67,71,67,64,62,65,69,62,69,72,69,65,64,67,71,64,71,76,71,67,59,62,67,71,67,62,60,0],bass:[36,36,38,38,40,40,43,36],wave:'square',beat:'machine'},
 'litteral:2':{name:'Les miroirs',bpm:88,lead:[76,0,79,83,0,86,83,79,74,0,77,81,0,84,81,77,72,0,76,79,0,83,79,76,71,74,77,81,79,74,72,0],bass:[48,48,50,50,45,45,43,48],wave:'sine',beat:'space'},
 'litteral:3':{name:'La balance ancienne',bpm:104,lead:[57,60,64,67,64,60,57,0,59,62,65,69,65,62,59,0,60,64,67,72,67,64,60,0,55,59,62,67,62,59,57,0],bass:[33,33,35,35,36,36,31,33],wave:'triangle',beat:'heavy'},
 'litteral:4':{name:'Le grimoire restauré',bpm:116,lead:[65,68,72,77,76,72,68,65,63,67,70,75,74,70,67,63,61,65,68,73,72,68,65,61,60,64,67,72,71,67,65,0],bass:[41,41,39,39,37,37,36,41],wave:'triangle',beat:'heavy'},
 menu:{name:'Le royaume',bpm:80,lead:[60,0,67,0,72,0,67,0,62,0,69,0,74,0,69,0,64,0,71,0,76,0,71,0,65,0,67,0,72,0,60,0],bass:[48,48,50,50,52,52,53,48],wave:'sine',beat:'space'},
 victory:{name:'La lumière retrouvée',bpm:115,lead:[72,76,79,84,83,79,76,74,77,81,84,86,84,81,77,0,76,79,84,88,86,84,79,76,74,77,81,79,76,74,72,0],bass:[48,48,53,53,52,52,55,48],wave:'triangle',beat:'light'}
};
function resolve(id,mode){
 const t=themes[id]||themes.arcade;
 if(mode==='boss')return {...t,name:t.name+' — combat',bpm:Math.round(t.bpm*1.26),wave:'triangle',beat:'heavy',lead:t.lead.map((n,i)=>n?(i%4===3?n+7:n):0)};
 if(mode==='puzzle'||mode==='pause')return {...t,name:t.name+' — réflexion',bpm:Math.round(t.bpm*.68),wave:'sine',beat:'none',lead:t.lead.map((n,i)=>i%2===0?n:0)};
 return t
}
root.RoyaumeMusicThemes={themes,resolve};
if(!root.document)return;
const document=root.document;
let enabled=true;try{enabled=root.localStorage.getItem(key)!=='off'}catch{}
let ctx=null,master=null,bus=null,timer=null,next=0,step=0,started=false,starting=false,id='arcade',mode='explore',track=resolve(id,mode),generation=0;
const button=document.createElement('button');button.type='button';button.id='arcadeMusic';button.className='quiet';button.style.cssText='font:700 14px system-ui,sans-serif;color:inherit;background:#213550;border:1px solid #56728c;border-radius:12px;padding:10px 12px;min-height:44px;cursor:pointer;touch-action:manipulation;white-space:nowrap';
const header=document.querySelector('header');if(header){const group=document.createElement('div');group.style.cssText='display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px';const last=header.lastElementChild;if(last&&last.tagName==='BUTTON')group.append(last);group.append(button);header.append(group)}
function paint(){button.textContent=enabled?'♫ Musique : ON':'♪ Musique : OFF';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Couper la musique et les effets sonores':'Activer la musique et les effets sonores');button.title=track.name}
function fadeBus(){if(!ctx||!bus)return;const old=bus;bus=null;try{old.gain.cancelScheduledValues(ctx.currentTime);old.gain.setTargetAtTime(.0001,ctx.currentTime,.035);root.setTimeout(()=>{try{old.disconnect()}catch{}},350)}catch{}}
function newBus(){if(!ctx||!master)return;fadeBus();bus=ctx.createGain();bus.gain.value=.0001;bus.connect(master);bus.gain.setTargetAtTime(mode==='puzzle'||mode==='pause'?.42:1,ctx.currentTime,.08)}
function tone(midi,t,duration,kind,volume){if(!midi||!ctx||!bus)return;const osc=ctx.createOscillator(),g=ctx.createGain();osc.type=kind;osc.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+Math.min(.025,duration/3));g.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(g);g.connect(bus);osc.start(t);osc.stop(t+duration+.02);osc.onended=()=>{try{osc.disconnect();g.disconnect()}catch{}}}
function drum(t,low,vol){if(!ctx||!bus)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(low?125:310,t);o.frequency.exponentialRampToValueAtTime(low?42:120,t+.09);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.10);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.12);o.onended=()=>{try{o.disconnect();g.disconnect()}catch{}}}
function tick(){if(!enabled||document.hidden||!ctx||ctx.state!=='running'||!bus)return;const interval=30/track.bpm;if(next<ctx.currentTime)next=ctx.currentTime+.035;while(next<ctx.currentTime+.12){const i=step%32,n=track.lead[i],b=track.bass[Math.floor(i/4)];tone(n,next,interval*.82,track.wave,track.wave==='square'||track.wave==='sawtooth'?.048:.12);if(i%2===0)tone(b,next,interval*1.6,'triangle',.065);if(track.beat==='space'&&i%4===0)tone(b+19,next,interval*3,'sine',.025);if(track.beat==='desert'&&(i%4===0||i%8===5))drum(next,i%4===0,.11);if(track.beat==='heavy'&&(i%2===0))drum(next,i%4===0,.12);if(track.beat==='machine'){drum(next,i%4===0,.075);if(i%2===1)tone(b+12,next,interval*.35,'square',.024)}if(track.beat==='light'&&i%4===0)drum(next,true,.045);step++;next+=interval}}
function stop(){generation++;if(timer!==null){root.clearInterval(timer);timer=null}fadeBus()}
async function start(){if(!enabled||document.hidden||starting||timer!==null)return;const token=generation;starting=true;try{const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio)return;if(!ctx){ctx=new Audio();master=ctx.createGain();master.gain.value=.23;master.connect(ctx.destination)}await ctx.resume();if(!enabled||document.hidden||token!==generation)return;started=true;newBus();next=ctx.currentTime+.04;timer=root.setInterval(tick,45);tick()}catch{}finally{starting=false}}
function setTheme(newId,newMode='explore'){if(!themes[newId])newId='arcade';if(!['explore','boss','puzzle','pause'].includes(newMode))newMode='explore';if(id===newId&&mode===newMode)return false;id=newId;mode=newMode;track=resolve(id,mode);step=0;paint();if(ctx&&timer!==null){newBus();next=ctx.currentTime+.045;tick()}return true}
root.RoyaumeMusic={setTheme,getTheme:()=>({id,mode,name:track.name})};
button.addEventListener('click',()=>{enabled=!enabled;try{root.localStorage.setItem(key,enabled?'on':'off')}catch{}paint();if(enabled)start();else stop()});
document.addEventListener('click',e=>{if(e.target!==button&&enabled&&timer===null)start()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(started&&enabled)start()});
root.addEventListener('pagehide',stop);root.addEventListener('pageshow',()=>{if(started&&enabled)start()});paint();
})(globalThis);