/* IndexedDB wrapper: draft content + uploaded media blobs.
   localStorage is avoided because images/videos exceed its ~5MB quota. */
(function (PF) {
  'use strict';
  const { dbName, dbVersion, stores, mediaScheme } = PF.config.storage;
  let dbPromise = null;

  function open() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion);
      req.onupgradeneeded = () => {
        Object.values(stores).forEach((name) => {
          if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name);
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(store, mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const result = fn(t.objectStore(store));
      t.oncomplete = () => resolve(result && 'result' in result ? result.result : result);
      t.onerror = () => reject(t.error);
    });
  }

  const get = (store, key) => tx(store, 'readonly', (s) => s.get(key)).catch(() => undefined);
  const put = (store, key, value) => tx(store, 'readwrite', (s) => s.put(value, key));
  const del = (store, key) => tx(store, 'readwrite', (s) => s.delete(key));
  const keys = (store) => tx(store, 'readonly', (s) => s.getAllKeys()).catch(() => []);

  /* ---------- Media ---------- */
  const urlCache = new Map();
  const isLocalMedia = (src) => typeof src === 'string' && src.startsWith(mediaScheme);

  async function saveMedia(file) {
    const id = PF.uid('m');
    await put(stores.media, id, file);
    return mediaScheme + id;
  }

  /** Resolve any media src to something an <img>/<video> can load. */
  async function resolveMedia(src) {
    if (!isLocalMedia(src)) return src;
    if (urlCache.has(src)) return urlCache.get(src);
    const blob = await get(stores.media, src.slice(mediaScheme.length));
    if (!blob) return '';
    const url = URL.createObjectURL(blob);
    urlCache.set(src, url);
    return url;
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  /** Deep-walk content and replace idb:// refs with data: URLs (for export). */
  async function inlineMedia(content) {
    const out = PF.clone(content);
    const jobs = [];
    (function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      for (const [k, v] of Object.entries(node)) {
        if (isLocalMedia(v)) {
          jobs.push(get(stores.media, v.slice(mediaScheme.length))
            .then((blob) => (blob ? blobToDataURL(blob) : ''))
            .then((data) => { node[k] = data; }));
        } else walk(v);
      }
    })(out);
    await Promise.all(jobs);
    return out;
  }

  /** Remove blobs no longer referenced by the content. */
  async function pruneMedia(content) {
    const json = JSON.stringify(content);
    const all = await keys(stores.media);
    await Promise.all(all.filter((k) => !json.includes(mediaScheme + k)).map((k) => del(stores.media, k)));
  }

  PF.db = { get, put, del, keys, saveMedia, resolveMedia, inlineMedia, pruneMedia, isLocalMedia };
})(window.PF);
