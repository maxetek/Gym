const VERSION='v10';
const SHELL_CACHE='gym-shell-'+VERSION;
const RUNTIME_CACHE='gym-runtime-'+VERSION;
const SHELL=['./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(
      ks.filter(k=>k.startsWith('gym-')&&k!==SHELL_CACHE&&k!==RUNTIME_CACHE).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const sameOrigin=url.origin===self.location.origin;
  const isStatic=sameOrigin&&(
    ['style','script','image','font'].includes(e.request.destination)||
    /\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/i.test(url.pathname)||
    url.pathname.endsWith('/manifest.json')
  );

  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request)
        .then(res=>{const c=res.clone();caches.open(SHELL_CACHE).then(ca=>ca.put('./index.html',c));return res;})
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  if(!isStatic)return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(res&&res.status===200){const c=res.clone();caches.open(RUNTIME_CACHE).then(ca=>ca.put(e.request,c));}
      return res;
    }))
  );
});
