const CACHE='jibli-shell-v2';
const CORE=['./','./index.html','./livreur.html','./manifest.webmanifest','./icons/icon.svg','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png'];
const SHELL=new Set(CORE.map(path=>new URL(path,self.location.href).pathname));
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('jibli-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
  // Keep the offline cache limited to the public static shell. Never cache API responses,
  // admin pages, arbitrary same-origin URLs, or authenticated user data.
  if(!SHELL.has(u.pathname))return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).catch(()=>{
    if(e.request.mode==='navigate')return caches.match('./index.html');
    throw new Error('Offline and resource is not cached');
  })));
});
