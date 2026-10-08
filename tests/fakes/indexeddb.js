/** Just enough IndexedDB for extension/background/idb-keystore.js. Values are kept by reference. */
const databases = new Map();

function request(run) {
  const req = { result: undefined, error: null, onsuccess: null, onerror: null };
  queueMicrotask(() => {
    try {
      req.result = run();
      req.onsuccess?.();
    } catch (err) {
      req.error = err;
      req.onerror?.();
    }
  });
  return req;
}

export function installFakeIndexedDb() {
  globalThis.indexedDB = {
    open(name) {
      const req = { result: null, error: null };
      queueMicrotask(() => {
        let db = databases.get(name);
        const fresh = !db;
        if (fresh) {
          db = { stores: new Map() };
          databases.set(name, db);
        }
        const handle = {
          createObjectStore(store) {
            db.stores.set(store, new Map());
            return {};
          },
          transaction(store) {
            const map = db.stores.get(store);
            const tx = { oncomplete: null, onerror: null, onabort: null, error: null };
            const finish = () => queueMicrotask(() => queueMicrotask(() => tx.oncomplete?.()));
            tx.objectStore = () => ({
              get: (key) => {
                const r = request(() => map.get(key));
                finish();
                return r;
              },
              put: (value, key) => {
                const r = request(() => {
                  map.set(key, value);
                  return key;
                });
                finish();
                return r;
              },
              delete: (key) => {
                const r = request(() => map.delete(key));
                finish();
                return r;
              },
            });
            return tx;
          },
          close() {},
        };
        req.result = handle;
        if (fresh) req.onupgradeneeded?.();
        req.onsuccess?.();
      });
      return req;
    },
  };
}

export function resetFakeIndexedDb() {
  databases.clear();
}

export function peekFakeKeystore() {
  return databases.get("csnyExtension.keystore")?.stores.get("keys");
}
