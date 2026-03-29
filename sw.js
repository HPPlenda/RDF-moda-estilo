const CACHE_NAME = 'pwa-offline-v1';
// Adicione aqui os arquivos que você quer que funcionem offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // '/css/style.css', // adicione seus caminhos reais aqui
  // '/js/main.js'
];

// Instalação: Salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta as chamadas: Tenta rede, se falhar, vai no cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});