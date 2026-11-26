/* V29 — local device preferences and adaptive rendering. No profile or server data. */
(function(root){
'use strict';
const defaults={quality:'auto',size:'normal',opacity:'normal',hand:'right',contrast:false,autoFull:true};
const key='micro-college-device-v29';
function normalize(x={}){return {quality:['auto','performance','immersion'].includes(x.quality)?x.quality:defaults.quality,size:['normal','large','compact'].includes(x.size)?x.size:defaults.size,opacity:['normal','solid','light'].includes(x.opacity)?x.opacity:defaults.opacity,hand:x.hand==='left'?'left':'right',contrast:x.contrast===true,autoFull:x.autoFull!==false}}
let prefs=defaults;try{prefs=normalize(JSON.parse(root.localStorage.getItem(key)||'{}'))}catch{prefs=normalize()}
let autoLite=false,slow=0,fast=0,lastDraw=0,lastSample=0,carry=0,look=0;
const api={
 get prefs(){return {...prefs}},get lite(){return prefs.quality==='performance'||(prefs.quality==='auto'&&autoLite)},
 reset(){lastDraw=0;lastSample=0;slow=0;fast=0;carry=0;look=0},
 steps(ms,active){if(!active||!Number.isFinite(ms)||ms<0||ms>250){carry=0;return 0}carry+=Math.min(ms,100)/1000;const n=Math.min(6,Math.floor((carry+1e-9)*60));carry=Math.max(0,carry-n/60);return n},
 clearSteps(){carry=0},
 palette(zones,sectors,x){let k=0;while(k+1<zones.length&&x>=sectors[k+1][0])k++;for(let j=1;j<zones.length;j++){const edge=sectors[j][0];if(Math.abs(x-edge)>120)continue;const u=Math.max(0,Math.min(1,(x-edge+120)/240)),f=u*u*(3-2*u),a=zones[j-1],b=zones[j],out={...zones[k]};for(const key of Object.keys(a)){if(/^#[0-9a-f]{6}$/i.test(a[key])&&/^#[0-9a-f]{6}$/i.test(b[key]))out[key]='#'+[1,3,5].map(i=>Math.round(parseInt(a[key].slice(i,i+2),16)*(1-f)+parseInt(b[key].slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('')}return out}return zones[k]},
 sample(ms,active=true){if(!active||!Number.isFinite(ms)||ms<5||ms>150){slow=0;fast=0;return}if(prefs.quality!=='auto')return;if(ms>28){slow++;fast=0}else if(ms<19){fast++;slow=Math.max(0,slow-2)}else{slow=Math.max(0,slow-1);fast=0}if(slow>=40){autoLite=true;slow=0;fast=0}if(fast>=240){autoLite=false;fast=0}},
 shouldDraw(t){if(!Number.isFinite(t))return true;if(t<lastDraw)lastDraw=0;if(!api.lite||!lastDraw||t-lastDraw>=30){lastDraw=t;return true}return false},
 camera(x,old,face,vx,dt,boss=false){const lead=boss?0:Math.abs(vx)>5?Math.sign(vx)*105:0;look+=(lead-look)*(1-Math.exp(-Math.max(.001,Math.min(.1,dt||1/60))*5));const target=Math.max(0,Math.min(3390,x-384+look));if(!Number.isFinite(old)||Math.abs(old-target)>750)return target;return old+(target-old)*(1-Math.exp(-Math.max(.001,Math.min(.1,dt||1/60))*9))},
 set(values){prefs=normalize({...prefs,...values});try{root.localStorage.setItem(key,JSON.stringify(prefs))}catch{}apply();return api.prefs},
 isTouch(){return !!root.matchMedia?.('(pointer: coarse)').matches||((root.navigator?.maxTouchPoints||0)>0&&root.innerWidth<1100)}
};
function apply(){const b=root.document?.body;if(!b)return;b.dataset.controlSize=prefs.size;b.dataset.controlOpacity=prefs.opacity;b.dataset.controlHand=prefs.hand;b.dataset.highContrast=String(prefs.contrast);for(const el of root.document.querySelectorAll('[data-device-pref]')){const k=el.dataset.devicePref;if(el.type==='checkbox')el.checked=!!prefs[k];else el.value=prefs[k]}}
function bind(){apply();for(const el of root.document?.querySelectorAll('[data-device-pref]')||[])el.addEventListener('change',()=>api.set({[el.dataset.devicePref]:el.type==='checkbox'?el.checked:el.value}));}
api.bind=bind;api.normalize=normalize;root.MicroPlayPrefs=api;
})(globalThis);
