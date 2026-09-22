const CACHE_NAME='barokah-telur-pwa-v3';
const APP_SHELL=[
  './',
  './index.html',
  './manifest.json',
  './assets/logo-barokah-telur.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  // Always prefer the network for HTML/navigation so old UI cannot remain stuck.
  if(event.request.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname==='/'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)).catch(()=>{});
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(()=>caches.match(event.request).then(cached=>cached || caches.match('./index.html')))
  );
});
