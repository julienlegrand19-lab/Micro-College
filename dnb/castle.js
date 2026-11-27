/* Astréon V1.19 — decorative castle and earned appearance options. */
(function(root){
'use strict';
const colors=[['#8193aa','Acier'],['#496c90','Bleu royal'],['#6f8768','Forêt'],['#875d9c','Améthyste'],['#a64f50','Pourpre'],['#c4a164','Or ancien'],['#47515d','Obsidienne']];
const skins=[['#e1b68c','Clair doré'],['#f0d0b6','Clair'],['#c39170','Cuivré'],['#ad795b','Brun'],['#80543f','Brun profond'],['#5e3d30','Foncé']];
const hairs=[['#514039','Châtain'],['#30283c','Noir'],['#b28b4f','Blond'],['#965634','Roux'],['#c5c6ce','Argent']];
const buildings=[
 {id:'keep',title:'Le donjon',desc:'Ton refuge de départ.',need:0},
 {id:'library',title:'Bibliothèque',desc:'Réussir une première compétence sans aide dans le carnet.',need:1},
 {id:'forge',title:'Forge',desc:'Obtenir 3 sceaux ou réussites distinctes.',need:3},
 {id:'garden',title:'Jardin des runes',desc:'Obtenir 6 réussites distinctes.',need:6},
 {id:'observatory',title:'Observatoire',desc:'Obtenir 10 réussites distinctes.',need:10},
 {id:'walls',title:'Remparts royaux',desc:'Obtenir 16 réussites distinctes.',need:16},
 {id:'palace',title:'Palais de l’Aube',desc:'Obtenir 24 réussites distinctes.',need:24}
];
function count(s){
 const wins=Array.from({length:6},(_,i)=>Number(s.wins?.[i]===true)).reduce((a,b)=>a+b,0);
 const boss=Array.from({length:6},(_,i)=>Number(s.pedBoss?.[i]?.won===true)).reduce((a,b)=>a+b,0);
 let skills=0;for(let w=0;w<6;w++)for(let i=0;i<4;i++){let p=s.revisionBook?.skills?.[w+':'+i];if(Number.isFinite(p?.ok)&&p.ok>0)skills++}
 const distinct=(a,max,valid)=>new Set((Array.isArray(a)?a:[]).filter(valid)).size;
 const scratch=distinct(s.scratch,16,n=>Number.isInteger(n)&&n>=0&&n<16),studio=distinct(s.studio,6,n=>Number.isInteger(n)&&n>=0&&n<6),workshops=distinct(s.workshops,12,n=>typeof n==='string'&&/^[0-3]:[0-2]$/.test(n));
 return {wins,boss,skills,scratch,studio,workshops,total:wins+boss+skills+scratch+studio+workshops}
}
function unlocked(p,b){return b.id==='library'?p.skills>=1:p.total>=b.need}
function clean(a,p){let valid=(list,v,limit=list.length)=>list.slice(0,limit).some(x=>x[0]===v)?v:undefined;return {outfit:valid(colors,a?.outfit,Math.min(colors.length,3+Math.floor(p.total/4))),skin:valid(skins,a?.skin),hair:valid(hairs,a?.hair),banner:valid(colors,a?.banner,Math.min(colors.length,3+Math.floor(p.total/4)))||colors[1][0]}}
function svg(p,banner='#496c90'){
 let has=id=>unlocked(p,buildings.find(b=>b.id===id)),flag=/^#[0-9a-f]{6}$/i.test(banner)?banner:'#496c90';
 let tower=(x,y,w,h,roof=true)=>'<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="url(#stone)" stroke="#42515c" stroke-width="2"/><path d="'+Array.from({length:Math.floor(h/13)},(_,i)=>'M'+x+' '+(y+i*13)+'h'+w).join(' ')+'" stroke="#526571" opacity=".5"/>'+Array.from({length:Math.floor(h/31)},(_,i)=>'<path d="M'+(x+w/2-5)+' '+(y+19+i*31)+'v-10q5-8 10 0v10Z" fill="#eac47f" stroke="#424c55"/>').join('')+(roof?'<path d="M'+(x-8)+' '+y+'L'+(x+w/2)+' '+(y-33)+'L'+(x+w+8)+' '+y+'Z" fill="url(#roof)" stroke="#263b4b" stroke-width="2"/>':'<path d="M'+(x-4)+' '+(y+5)+'v-14h11v7h10v-7h11v7h10v-7h11v14Z" fill="#9ba9ad"/>')+'</g>';
 let house=(x,y,w,h)=>'<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#a5a18e" stroke="#48565a" stroke-width="2"/><path d="M'+(x-7)+' '+y+'L'+(x+w/2)+' '+(y-25)+'L'+(x+w+7)+' '+y+'Z" fill="url(#roof)" stroke="#31424b" stroke-width="2"/><rect x="'+(x+9)+'" y="'+(y+13)+'" width="12" height="17" rx="3" fill="#f3d099"/><path d="M'+(x+w-24)+' '+(y+h)+'v-24q9-12 18 0v24" fill="#48545a"/></g>';
 let s='<svg viewBox="0 0 760 405" role="img" aria-label="Château personnel et bâtiments débloqués"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#193753"/><stop offset="1" stop-color="#d5aa86"/></linearGradient><linearGradient id="stone" x2="1" y2=".3"><stop stop-color="#b9c3c0"/><stop offset=".6" stop-color="#85979e"/><stop offset="1" stop-color="#556b7c"/></linearGradient><linearGradient id="roof" x2="1" y2="1"><stop stop-color="#66899c"/><stop offset="1" stop-color="#263c53"/></linearGradient><linearGradient id="grass" x2="0" y2="1"><stop stop-color="#637b69"/><stop offset="1" stop-color="#263e3a"/></linearGradient></defs><rect width="760" height="405" fill="url(#sky)"/><circle cx="613" cy="73" r="37" fill="#f5d6a0" opacity=".8"/><path d="M0 215L123 91 215 190 320 118 440 224 540 115 760 201V405H0Z" fill="#506d7b"/><path d="M0 256Q120 191 240 246T480 239T760 224V405H0Z" fill="#344e59"/><path d="M0 310Q180 262 380 295T760 285V405H0Z" fill="url(#grass)"/><path d="M330 405L366 310H405L455 405Z" fill="#ab9d7e" opacity=".8"/>';
 if(has('walls'))s+='<path d="M115 315V247H134V234H150V247H166V234H182V247H200V315M560 315V247H578V234H594V247H610V234H626V247H645V315" fill="url(#stone)" stroke="#435660" stroke-width="2"/>'+tower(83,231,51,84,false)+tower(626,231,51,84,false);
 if(has('library'))s+=house(220,257,93,65)+'<text x="266" y="280" text-anchor="middle" fill="#f3d099" font-size="16">✦</text>';
 if(has('forge'))s+=house(450,263,91,59)+'<rect x="520" y="231" width="14" height="40" fill="#696361"/><path d="M527 227Q552 214 540 192" fill="none" stroke="#d3d5d399" stroke-width="7" stroke-linecap="round"/>';
 if(has('palace'))s+=tower(309,125,56,187)+tower(414,125,56,187)+tower(365,104,48,207);
 else s+=tower(340,173,80,138);
 s+='<path d="M360 311V278Q380 250 400 278V311Z" fill="#384754" stroke="#c3a16b" stroke-width="3"/><path d="M380 141V105" stroke="#c7ad79" stroke-width="3"/><path d="M382 106Q403 110 425 105V128Q404 135 382 129Z" fill="'+flag+'" stroke="#e5c28a" stroke-width="1"/>';
 if(has('observatory'))s+=tower(565,190,49,133,false)+'<path d="M560 192Q590 137 619 192Z" fill="#8da7b7" stroke="#405663" stroke-width="2"/><path d="M588 172L628 140" stroke="#dab575" stroke-width="10" stroke-linecap="round"/>';
 if(has('garden'))s+='<ellipse cx="176" cy="347" rx="52" ry="25" fill="#314e3c" stroke="#adad7c" stroke-width="2"/>'+Array.from({length:7},(_,i)=>'<path d="M'+(136+i*13)+' 350l5 -15 5 15Z" fill="'+(i%2?'#b68bd3':'#78b8cf')+'"/>').join('');
 s+='<path d="M0 379Q160 358 285 379T565 382T760 377V405H0Z" fill="#1d3738"/><g fill="#e7d2aa" font-size="11"><text x="15" y="394">Clairval · domaine du Gardien</text></g></svg>';
 return s
}
root.AstreonCastle=Object.freeze({colors,skins,hairs,buildings,count,unlocked,clean,svg});
})(globalThis);