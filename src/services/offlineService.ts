interface PendingEntry {
  id: string;
  data: any;
  timestamp: number;
  action: 'create' | 'update' | 'delete';
}

class OfflineService {
  private dbName = 'neuri-offline-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
    this.setupOnlineListener();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores
        if (!db.objectStoreNames.contains('entries')) {
          const entriesStore = db.createObjectStore('entries', { keyPath: 'id' });
          entriesStore.createIndex('date', 'date', { unique: false });
          entriesStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      };
    });
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored - syncing pending changes');
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost - switching to offline mode');
    });
  }

  // Cache management
  async cacheEntry(entry: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readwrite');
      const store = transaction.objectStore('entries');
      
      const request = store.put({
        ...entry,
        id: entry.id || entry._id,
        cachedAt: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedEntries(userId: string): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readonly');
      const store = transaction.objectStore('entries');
      const index = store.index('userId');
      
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async cacheUserProfile(user: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfile'], 'readwrite');
      const store = transaction.objectStore('userProfile');
      
      const request = store.put({
        ...user,
        cachedAt: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedUserProfile(userId: string): Promise<any | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfile'], 'readonly');
      const store = transaction.objectStore('userProfile');
      
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Pending sync management
  async addPendingSync(entry: PendingEntry): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingSync(): Promise<PendingEntry[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingSync(id: string): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sync functionality
  async syncPendingChanges(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Still offline, cannot sync');
      return;
    }

    try {
      const pendingChanges = await this.getPendingSync();
      console.log(`Syncing ${pendingChanges.length} pending changes`);

      for (const change of pendingChanges) {
        try {
          await this.syncSingleChange(change);
          await this.removePendingSync(change.id);
          console.log(`Synced change ${change.id}`);
        } catch (error) {
          console.error(`Failed to sync change ${change.id}:`, error);
          // Keep the change for next sync attempt
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  }

  private async syncSingleChange(change: PendingEntry): Promise<void> {
    const { apiService } = await import('./api');

    switch (change.action) {
      case 'create':
        await apiService.createEntry(change.data);
        break;
      case 'update':
        await apiService.updateEntry(change.data.id, change.data);
        break;
      case 'delete':
        await apiService.deleteEntry(change.data.id);
        break;
    }
  }

  // Offline entry management
  async createOfflineEntry(entryData: any): Promise<string> {
    const offlineId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const entry = {
      ...entryData,
      id: offlineId,
      createdAt: new Date(),
      isOffline: true
    };

    // Cache the entry
    await this.cacheEntry(entry);

    // Add to pending sync
    await this.addPendingSync({
      id: offlineId,
      data: entryData,
      timestamp: Date.now(),
      action: 'create'
    });

    return offlineId;
  }

  async updateOfflineEntry(id: string, entryData: any): Promise<void> {
    // Update cached entry
    const cachedEntries = await this.getCachedEntries(entryData.userId || 'unknown');
    const entryIndex = cachedEntries.findIndex(e => e.id === id);
    
    if (entryIndex !== -1) {
      const updatedEntry = { ...cachedEntries[entryIndex], ...entryData };
      await this.cacheEntry(updatedEntry);
    }

    // Add to pending sync
    await this.addPendingSync({
      id: `update-${id}-${Date.now()}`,
      data: { id, ...entryData },
      timestamp: Date.now(),
      action: 'update'
    });
  }

  async deleteOfflineEntry(id: string): Promise<void> {
    // Remove from cache
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readwrite');
      const store = transaction.objectStore('entries');
      
      const request = store.delete(id);

      request.onsuccess = async () => {
        // Add to pending sync
        await this.addPendingSync({
          id: `delete-${id}-${Date.now()}`,
          data: { id },
          timestamp: Date.now(),
          action: 'delete'
        });
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Connection status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    if (!this.db) await this.initDB();

    const stores = ['entries', 'pendingSync', 'userProfile'];
    
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
}

export const offlineService = new OfflineService();