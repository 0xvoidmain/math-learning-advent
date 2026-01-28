const DB_NAME = 'MathQuestDB'
const DB_VERSION = 1
const SESSIONS_STORE = 'quiz-sessions'
const SETTINGS_STORE = 'settings'

let dbInstance: IDBDatabase | null = null

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open database'))
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        const sessionsStore = db.createObjectStore(SESSIONS_STORE, { keyPath: 'id' })
        sessionsStore.createIndex('completedAt', 'completedAt', { unique: false })
      }

      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' })
      }
    }
  })
}

export async function getAllSessions<T>(): Promise<T[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readonly')
    const store = transaction.objectStore(SESSIONS_STORE)
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result || [])
    }

    request.onerror = () => {
      reject(new Error('Failed to get sessions'))
    }
  })
}

export async function addSession<T>(session: T): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readwrite')
    const store = transaction.objectStore(SESSIONS_STORE)
    const request = store.add(session)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error('Failed to add session'))
    }
  })
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SETTINGS_STORE], 'readonly')
    const store = transaction.objectStore(SETTINGS_STORE)
    const request = store.get(key)

    request.onsuccess = () => {
      const result = request.result
      resolve(result ? result.value : undefined)
    }

    request.onerror = () => {
      reject(new Error('Failed to get setting'))
    }
  })
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SETTINGS_STORE], 'readwrite')
    const store = transaction.objectStore(SETTINGS_STORE)
    const request = store.put({ key, value })

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error('Failed to set setting'))
    }
  })
}

export async function clearAllData(): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE, SETTINGS_STORE], 'readwrite')
    
    const sessionsRequest = transaction.objectStore(SESSIONS_STORE).clear()
    const settingsRequest = transaction.objectStore(SETTINGS_STORE).clear()

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      reject(new Error('Failed to clear data'))
    }
  })
}
