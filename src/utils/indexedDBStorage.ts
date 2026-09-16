// IndexedDB storage utility for large attachments (PDFs, docs, images)
// This eliminates LocalStorage QuotaExceededError and provides offline-first reliability.

const DB_NAME = 'studyflow_files_db';
const DB_VERSION = 1;
const STORE_NAME = 'attachments';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported on this browser'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredFileEntry {
  id: string;
  name: string;
  type: string;
  mimeType: string;
  blob: Blob;
  size: number;
  uploadedAt: number;
}

export async function saveFileToIndexedDB(
  id: string,
  file: File | Blob,
  metadata?: { name?: string; type?: string }
): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const entry: StoredFileEntry = {
      id,
      name: metadata?.name || (file instanceof File ? file.name : 'attachment'),
      type: metadata?.type || 'circular',
      mimeType: file.type || 'application/octet-stream',
      blob: file,
      size: file.size,
      uploadedAt: Date.now(),
    };
    const req = store.put(entry);
    req.onsuccess = () => {
      // Return custom protocol identifier for internal resolution
      resolve(`idb://${id}`);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getFileFromIndexedDB(id: string): Promise<StoredFileEntry | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error fetching file from IndexedDB:', err);
    return null;
  }
}

export async function createBlobUrlFromIndexedDB(id: string): Promise<string | null> {
  const entry = await getFileFromIndexedDB(id);
  if (!entry || !entry.blob) return null;
  return URL.createObjectURL(entry.blob);
}

export async function deleteFileFromIndexedDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete file from IndexedDB:', err);
  }
}
