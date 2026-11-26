/* Local encrypted profiles. No passwords or progress are sent to a server. */
(function(root){
 const PREFIX='royaume-vault-v1:',LEGACY={relatifs:'royaume-profils-v8',pyramides:'royaume-pyramides-profils-v1'};
 const norm=name=>'p:'+String(name).trim().normalize('NFC').toLocaleLowerCase('fr');
 function createVault(store,crypt,encode,decode,b64,unb64){
  const enc=new encode(),dec=new decode(),sub=crypt.subtle;
  const keyPath=(id,slot)=>PREFIX+encodeURIComponent(id)+':'+slot;
  const json=(key,fallback=null)=>{const raw=store.getItem(key);return raw===null?fallback:JSON.parse(raw)};
  const pack=bytes=>b64(Array.from(new Uint8Array(bytes),x=>String.fromCharCode(x)).join(''));
  const unpack=str=>Uint8Array.from(unb64(str),c=>c.charCodeAt(0));
  const random=n=>crypt.getRandomValues(new Uint8Array(n));
  async function derive(password,salt,iterations){
   const raw=await sub.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
   return sub.deriveKey({name:'PBKDF2',salt:unpack(salt),iterations,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])
  }
  async function seal(key,data,id,slot){
   const iv=random(12),cipher=await sub.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(id+'|'+slot+'|1')},key,enc.encode(JSON.stringify(data)));
   return {iv:pack(iv),cipher:pack(cipher)}
  }
  async function unseal(key,record,id,slot){
   if(!record||!record.iv||!record.cipher)throw Error('Sauvegarde absente ou endommagée.');
   const bytes=await sub.decrypt({name:'AES-GCM',iv:unpack(record.iv),additionalData:enc.encode(id+'|'+slot+'|1')},key,unpack(record.cipher));
   return JSON.parse(dec.decode(bytes))
  }
  const exists=name=>!!store.getItem(keyPath(norm(name),'header'));
  function list(){const out=[];for(let i=0;i<store.length;i++){const k=store.key(i);if(k?.startsWith(PREFIX)&&k.endsWith(':header')){try{const h=json(k);if(h?.name)out.push(h.name)}catch{}}}return out.sort((a,b)=>a.localeCompare(b,'fr'))}
  function legacy(name){const id=norm(name),result={};for(const [chapter,k] of Object.entries(LEGACY)){try{const p=json(k,{});if(p&&Object.prototype.hasOwnProperty.call(p,id))result[chapter]=p[id]}catch{}}return result}
  function removeLegacy(name,chapters){const id=norm(name);for(const ch of chapters){const k=LEGACY[ch];try{const p=json(k,{});if(p&&Object.prototype.hasOwnProperty.call(p,id)){delete p[id];store.setItem(k,JSON.stringify(p))}}catch{}}}
  async function open(name,password,{create=false,appearance=null,migrate=false}={}){
   name=String(name).trim().slice(0,24);if(!name)throw Error('Choisis un pseudo.');
   const id=norm(name),headerPath=keyPath(id,'header');let header=json(headerPath),key;
   if(create){
    if(header)throw Error('Ce pseudo existe déjà. Connecte-toi avec son mot de passe.');
    if(typeof password!=='string'||password.length<8||password.length>128)throw Error('Choisis un mot de passe de 8 à 128 caractères, réservé au jeu.');
    const salt=pack(random(16)),iterations=210000;key=await derive(password,salt,iterations);
    const old=migrate?legacy(name):{},first=old.relatifs||old.pyramides||{};
    const identity={name,appearance:{character:first.character||'ranger',...(appearance||{})}};
    const identityRecord=await seal(key,identity,id,'identity');
    const slots={};for(const [ch,p] of Object.entries(old)){slots[ch]=await seal(key,p,id,ch)}
    if(store.getItem(headerPath))throw Error('Ce pseudo vient d’être créé. Connecte-toi.');
    // Write the header last: a partly created profile is not listed.
    for(const [ch,record] of Object.entries(slots))store.setItem(keyPath(id,ch),JSON.stringify(record));
    store.setItem(keyPath(id,'identity'),JSON.stringify(identityRecord));
    header={version:1,name,salt,iterations};store.setItem(headerPath,JSON.stringify(header));
    if(migrate)removeLegacy(name,Object.keys(old));
   }else{
    if(!header)throw Error('Ce pseudo n’existe pas encore sur cet appareil.');
    if(header.version!==1||header.iterations!==210000)throw Error('Format de sauvegarde incompatible.');
    key=await derive(password,header.salt,header.iterations);
   }
   let identity;
   try{identity=await unseal(key,json(keyPath(id,'identity')),id,'identity')}catch{throw Error('Mot de passe incorrect ou sauvegarde endommagée.')}
   let queue=Promise.resolve(),failure=null,closed=false;
   async function read(ch){if(!Object.prototype.hasOwnProperty.call(LEGACY,ch))throw Error('Chapitre inconnu');const record=json(keyPath(id,ch));return record?unseal(key,record,id,ch):null}
   function write(ch,progress,appearance){
    if(closed)return Promise.reject(Error('Profil verrouillé.'));
    if(!Object.prototype.hasOwnProperty.call(LEGACY,ch))return Promise.reject(Error('Chapitre inconnu'));
    const data=JSON.parse(JSON.stringify(progress));const ident={name:identity.name,appearance:JSON.parse(JSON.stringify(appearance))};
    const task=queue.then(async()=>{const [p,i]=await Promise.all([seal(key,data,id,ch),seal(key,ident,id,'identity')]);store.setItem(keyPath(id,ch),JSON.stringify(p));store.setItem(keyPath(id,'identity'),JSON.stringify(i));identity=ident;failure=null});
    queue=task.catch(e=>{failure=e});return task
   }
   return {id,name:identity.name,appearance:identity.appearance,read,write,flush:async()=>{await queue;if(failure)throw failure},close(){closed=true;key=null}}
  }
  return {norm,list,exists,legacy,open}
 }
 root.RoyaumeVaultFactory=createVault;
 if(root.crypto?.subtle&&root.localStorage)root.RoyaumeVault=createVault(root.localStorage,root.crypto,root.TextEncoder,root.TextDecoder,root.btoa.bind(root),root.atob.bind(root));
})(globalThis);