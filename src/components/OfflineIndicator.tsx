import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { offlineService } from '../services/offlineService';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending count
    loadPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingCount = async () => {
    try {
      const pending = await offlineService.getPendingSync();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Error loading pending count:', error);
    }
  };

  const syncPendingChanges = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      await offlineService.syncPendingChanges();
      await loadPendingCount();
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && pendingCount === 0) {
    return null; // Don't show indicator when online and no pending changes
  }

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        
        <span className="text-sm font-medium">
          {isOnline ? 'En línea' : 'Sin conexión'}
        </span>

        {pendingCount > 0 && (
          <>
            <span className="text-sm">•</span>
            <span className="text-sm">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
            </span>
          </>
        )}

        {isSyncing && (
          <RefreshCw className="h-4 w-4 animate-spin" />
        )}

        {isOnline && pendingCount > 0 && !isSyncing && (
          <button
            onClick={syncPendingChanges}
            className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
          >
            Sincronizar
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;