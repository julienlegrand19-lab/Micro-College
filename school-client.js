(function(){
'use strict';
const raw=window.MICRO_COLLEGE_API||'';
const base=typeof raw==='string'&&/^https:\/\/[a-z0-9.-]+(?::443)?$/i.test(raw)?raw:'';
async function api(path,method='GET',body,token){
 if(!base)throw Error('Mode classe non configuré. Demande au professeur.');
 const headers={'Accept':'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(token)headers.Authorization='Bearer '+token;
 const res=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',credentials:'omit',redirect:'error'});
 let data;try{data=await res.json()}catch{throw Error('Réponse du service invalide.')}
 if(!res.ok)throw Error(data.error||'Connexion impossible.');return data
}
window.MicroCollegeSchool={api,configured:!!base};
if(new URLSearchParams(location.search).get('school')!=='1')return;
window.RoyaumeVault={list:()=>[],open:async(name,password,options={})=>{
 if(options.create)throw Error('Les comptes en ligne sont créés par ton professeur.');
 const a=await api('/student/login','POST',{name,password});let token=a.token,queue=Promise.resolve(),failure=null,closed=false;
 function read(ch){if(closed)return Promise.reject(Error('Session fermée.'));return api('/student/'+ch,'GET',undefined,token).then(d=>d.progress)}
 function write(ch,progress,appearance){if(closed)return Promise.reject(Error('Session fermée.'));const payload=JSON.parse(JSON.stringify({progress,appearance}));const task=queue.then(()=>api('/student/'+ch,'PUT',payload,token)).then(()=>{failure=null});queue=task.catch(e=>{failure=e});return task}
 return {id:'p:'+a.id,name:a.name,appearance:a.appearance||{},read,write,flush:async()=>{await queue;if(failure)throw failure},close(){if(closed)return;closed=true;const t=token;token=null;api('/student/logout','POST',{},t).catch(()=>{})}}
}};
window.MicroCollegeSchool.online=true;
document.addEventListener('DOMContentLoaded',()=>{for(const link of document.querySelectorAll('a[href]')){const u=new URL(link.href,location.href);if(u.origin===location.origin&&/\/(campagne|pyramides|litteral)\.html$/.test(u.pathname)){u.searchParams.set('school','1');link.href=u.href}}const create=document.getElementById('createProfile');if(create)create.hidden=true;for(const id of ['passwordConfirm','importLegacy','profileSelect']){const el=document.getElementById(id);if(el){el.hidden=true;const label=document.querySelector('label[for="'+id+'"]');if(label)label.hidden=true;if(id==='importLegacy')el.closest('label').hidden=true}}const note=document.getElementById('nameNote');if(note)note.textContent='Utilise le pseudo et le mot de passe remis par ton professeur. Ta progression est enregistrée sur le serveur de classe. Ne réutilise pas un mot de passe personnel.';const info=document.getElementById('saveInfo');if(info&&!base)info.textContent='Le mode classe n’est pas encore activé.'});
})();