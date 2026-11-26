/* Musique originale 8-bit, synthétisée localement, sans fichier audio externe. */
(function(){
'use strict';
const key='micro-college-arcade-music-v1';
let enabled=true;try{enabled=localStorage.getItem(key)!=='off'}catch(e){}
let ctx=null,master=null,timer=null,next=0,step=0,started=false;
const melody=[72,76,79,76,74,77,81,77,71,74,79,74,69,72,76,72,72,76,84,79,74,77,81,77,71,74,83,79,72,76,79,0];
const bass=[48,50,43,45,48,50,43,48];
const interval=.24;
const button=document.createElement('button');button.type='button';button.id='arcadeMusic';button.className='quiet';button.style.cssText='font:700 14px system-ui,sans-serif;color:inherit;background:#213550;border:1px solid #56728c;border-radius:12px;padding:10px 12px;min-height:44px;cursor:pointer;touch-action:manipulation;white-space:nowrap';
const header=document.querySelector('header');if(header){const group=document.createElement('div');group.style.cssText='display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px';const last=header.lastElementChild;if(last&&last.tagName==='BUTTON')group.append(last);group.append(button);header.append(group)}
function paint(){button.textContent=enabled?'♫ Musique : ON':'♪ Musique : OFF';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Couper la musique arcade':'Activer la musique arcade')}
function tone(midi,t,duration,kind,volume){if(!midi||!ctx||!master)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind;osc.frequency.value=440*Math.pow(2,(midi-69)/12);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.018);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+duration+.02)}
function tick(){if(!enabled||document.hidden||!ctx||ctx.state!=='running')return;if(next<ctx.currentTime)next=ctx.currentTime+.04;while(next<ctx.currentTime+.12){const i=step%melody.length;tone(melody[i],next,.19,'triangle',.13);if(i%2===0)tone(bass[Math.floor(i/4)],next,.17,'square',.035);if(i%4===2)tone(melody[i]-12,next,.10,'sine',.025);step++;next+=interval}}
function stop(){if(timer!==null){clearInterval(timer);timer=null}if(ctx&&master){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(.0001,ctx.currentTime,.025)}}
async function start(){if(!enabled||document.hidden)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!ctx){ctx=new Audio();master=ctx.createGain();master.gain.value=.16;master.connect(ctx.destination)}await ctx.resume();if(!enabled||document.hidden)return;started=true;master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(.16,ctx.currentTime,.05);if(timer===null){next=ctx.currentTime+.05;timer=setInterval(tick,50);tick()}}catch(e){/* La musique reste facultative sur les appareils incompatibles. */}}
button.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'on':'off')}catch(e){}paint();if(enabled)start();else stop()});
document.addEventListener('click',e=>{if(e.target!==button&&enabled&&timer===null)start()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(started&&enabled)start()});
window.addEventListener('pagehide',stop);window.addEventListener('pageshow',()=>{if(started&&enabled)start()});paint();
})();