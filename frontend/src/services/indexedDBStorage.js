/**
 * IndexedDB Persistent Media Storage for MUSIFY
 * Solves browser session blob URL revocation so user-uploaded audio & covers
 * persist and play flawlessly across page reloads and refreshes.
 */

const DB_NAME = 'musify_persistent_media';
const DB_VERSION = 1;
const STORE_AUDIO = 'audio_files';
const STORE_COVERS = 'cover_files';

function getDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_AUDIO)) {
        db.createObjectStore(STORE_AUDIO);
      }
      if (!db.objectStoreNames.contains(STORE_COVERS)) {
        db.createObjectStore(STORE_COVERS);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save audio file Blob/File to IndexedDB
 */
export async function saveAudioToIndexedDB(key, fileOrBlob) {
  if (!fileOrBlob) return;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUDIO, 'readwrite');
      const store = tx.objectStore(STORE_AUDIO);
      store.put(fileOrBlob, String(key).toLowerCase().trim());
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Save audio notice:', err);
  }
}

/**
 * Save cover image Blob/File to IndexedDB
 */
export async function saveCoverToIndexedDB(key, fileOrBlob) {
  if (!fileOrBlob) return;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_COVERS, 'readwrite');
      const store = tx.objectStore(STORE_COVERS);
      store.put(fileOrBlob, String(key).toLowerCase().trim());
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Save cover notice:', err);
  }
}

/**
 * Retrieve persistent audio file and return a fresh, living object URL
 */
export async function getAudioObjectURL(keys) {
  try {
    const db = await getDB();
    const keyList = Array.isArray(keys) ? keys : [keys];
    for (const k of keyList) {
      if (!k) continue;
      const normalized = String(k).toLowerCase().trim();
      const blob = await new Promise((resolve) => {
        const tx = db.transaction(STORE_AUDIO, 'readonly');
        const store = tx.objectStore(STORE_AUDIO);
        const req = store.get(normalized);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
      if (blob && (blob instanceof Blob || blob instanceof File)) {
        return URL.createObjectURL(blob);
      }
    }
  } catch (err) {
    console.warn('[IndexedDB] Retrieve audio notice:', err);
  }
  return null;
}

/**
 * Retrieve persistent cover image and return a fresh, living object URL
 */
export async function getCoverObjectURL(keys) {
  try {
    const db = await getDB();
    const keyList = Array.isArray(keys) ? keys : [keys];
    for (const k of keyList) {
      if (!k) continue;
      const normalized = String(k).toLowerCase().trim();
      const blob = await new Promise((resolve) => {
        const tx = db.transaction(STORE_COVERS, 'readonly');
        const store = tx.objectStore(STORE_COVERS);
        const req = store.get(normalized);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
      if (blob && (blob instanceof Blob || blob instanceof File)) {
        return URL.createObjectURL(blob);
      }
    }
  } catch (err) {
    console.warn('[IndexedDB] Retrieve cover notice:', err);
  }
  return null;
}
