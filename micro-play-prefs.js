/* V29 — local device preferences and adaptive rendering. No profile or server data. */
(function(root){
'use strict';
const defaults={quality:'auto',size:'normal',opacity:'normal',hand:'right',contrast:false,autoFull:true};
const key='micro-college-device-v29';
function normalize(x={}){return {quality:['auto','performance','immersion'].includes(x.quality)?x.quality:defaults.quality,size:['normal','large','compact'].includes(x.size)?x.size:defaults.size,opacity:['normal','solid','light'].includes(x.opacity)?x.opacity:defaults.opacity,hand:x.hand==='left'?'left':'right',contrast:x.contrast===true,autoFull:x.autoFull!==false}}
let prefs=defaults;try{prefs=normalize(JSON.parse(root.localStorage.getItem(key)||'{}'))}catch{prefs=normalize()}
let autoLite=false,slow=0,fast=0,lastDraw=0,lastSample=0;
const api={
 get prefs(){return {...prefs}},get lite(){return prefs.quality==='performance'||(prefs.quality==='auto'&&autoLite)},
 reset(){lastDraw=0;lastSample=0;slow=0;fast=0},
 sample(ms,active=true){if(!active||!Number.isFinite(ms)||ms<5||ms>150){slow=0;fast=0;return}if(prefs.quality!=='auto')return;if(ms>28){slow++;fast=0}else if(ms<19){fast++;slow=Math.max(0,slow-2)}else{slow=Math.max(0,slow-1);fast=0}if(slow>=40){autoLite=true;slow=0;fast=0}if(fast>=240){autoLite=false;fast=0}},
 shouldDraw(t){if(!Number.isFinite(t))return true;if(t<lastDraw)lastDraw=0;if(!api.lite||!lastDraw||t-lastDraw>=30){lastDraw=t;return true}return false},
 camera(x,old,face,vx,dt,boss=false){const lead=boss?0:Math.abs(vx)>5?Math.sign(vx)*105:0;const target=Math.max(0,Math.min(3390,x-384+lead));if(!Number.isFinite(old)||Math.abs(old-target)>750)return target;return old+(target-old)*(1-Math.exp(-Math.max(.001,Math.min(.1,dt||1/60))*9))},
 set(values){prefs=normalize({...prefs,...values});try{root.localStorage.setItem(key,JSON.stringify(prefs))}catch{}apply();return api.prefs},
 isTouch(){return !!root.matchMedia?.('(pointer: coarse)').matches||((root.navigator?.maxTouchPoints||0)>0&&root.innerWidth<1100)}
};
function apply(){const b=root.document?.body;if(!b)return;b.dataset.controlSize=prefs.size;b.dataset.controlOpacity=prefs.opacity;b.dataset.controlHand=prefs.hand;b.dataset.highContrast=String(prefs.contrast);for(const el of root.document.querySelectorAll('[data-device-pref]')){const k=el.dataset.devicePref;if(el.type==='checkbox')el.checked=!!prefs[k];else el.value=prefs[k]}}
function bind(){apply();for(const el of root.document?.querySelectorAll('[data-device-pref]')||[])el.addEventListener('change',()=>api.set({[el.dataset.devicePref]:el.type==='checkbox'?el.checked:el.value}));}
api.bind=bind;api.normalize=normalize;root.MicroPlayPrefs=api;
})(globalThis);
