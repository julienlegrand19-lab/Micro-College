/* V28 – Native fullscreen with a resilient viewport fallback. */
(function(root){
'use strict';
function attach({play,button,isPlaying,release,doc=root.document,win=root}){
 let wanted=false,wasNative=false,pending=false,serial=0;
 const native=()=>doc.fullscreenElement||doc.webkitFullscreenElement||null;
 function size(){const v=win.visualViewport;const h=v?.height||win.innerHeight;if(Number.isFinite(h)&&h>0)play.style.setProperty('--game-height',Math.round(h)+'px')}
 function style(on){play.classList.toggle('gamefull',on);doc.body.classList.toggle('gamefullbody',on);button.textContent=on?'⛶ Quitter':'⛶ Plein écran';button.setAttribute('aria-pressed',String(on));if(on)size();else play.style.removeProperty('--game-height')}
 function exitNative(){if(native()!==play)return;try{const f=doc.exitFullscreen||doc.webkitExitFullscreen;const p=f?.call(doc);p?.catch?.(()=>{})}catch{}}
 function leave(){serial++;wanted=false;pending=false;wasNative=false;style(false);exitNative();release()}
 function changed(){if(native()===play){if(!wanted||!isPlaying()){exitNative();return}wasNative=true;style(true)}else if(wasNative){leave()}else if(wanted&&isPlaying()){style(true)}release()}
 async function toggle(){if(!isPlaying())return;release();if(wanted||native()===play){leave();return}wanted=true;wasNative=false;style(true);const ticket=++serial;
 const fn=play.requestFullscreen||play.webkitRequestFullscreen;if(!fn)return;pending=true;
 try{await fn.call(play);if(ticket!==serial||!wanted||!isPlaying()){exitNative();return}if(native()===play)wasNative=true}catch{/* Browser refuses native fullscreen: retain viewport mode. */}finally{if(ticket===serial){pending=false;if(wanted&&isPlaying())style(true)}}
 }
 function resized(){if(wanted&&isPlaying())size();release()}
 doc.addEventListener('fullscreenchange',changed);doc.addEventListener('webkitfullscreenchange',changed);
 win.addEventListener('resize',resized);win.addEventListener('orientationchange',resized);win.visualViewport?.addEventListener('resize',resized);
 return {toggle,leave,changed,get mode(){return wanted?(native()===play?'native':'viewport'):'off'},get pending(){return pending}}
}
root.MicroFullscreen={attach};
})(globalThis);
