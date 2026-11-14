/* Service worker do Painel Financeiro MM: permite instalar como app e abrir sem internet.
   - Página e dados (dados.bin): busca primeiro na rede (sempre a versão mais nova) e guarda uma cópia para uso offline.
   - Bibliotecas, fontes e ícones: usa a cópia guardada e atualiza em segundo plano.
   - Chamadas à API do GitHub (publicação) nunca passam pelo cache. */
const VERSAO = "painel-mm-v4";
const BASICOS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(BASICOS)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function redePrimeiro(req, chave) {
  const cache = await caches.open(VERSAO);
  try {
    const r = await fetch(req, { cache: "no-store" });
    if (r && r.ok) cache.put(chave, r.clone());
    return r;
  } catch (err) {
    const c = await cache.match(chave);
    if (c) return c;
    throw err;
  }
}
async function cacheDepoisRede(req) {
  const cache = await caches.open(VERSAO);
  const c = await cache.match(req);
  const busca = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) cache.put(req, r.clone()); return r; }).catch(() => c);
  return c || busca;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname === "api.github.com" || url.hostname === "api.anthropic.com") return;
  const local = url.origin === self.location.origin;
  if (local && (req.mode === "navigate" || url.pathname.endsWith("/index.html"))) {
    e.respondWith(redePrimeiro(req, "./index.html"));
  } else if (local && url.pathname.endsWith("/dados.bin")) {
    e.respondWith(redePrimeiro(req, "./dados.bin"));
  } else if (local || /(^|\.)(jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
    e.respondWith(cacheDepoisRede(req));
  }
});
