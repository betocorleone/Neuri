import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyEntry } from '../types';
import { useAuth } from './AuthContext';
import { localStorageService } from '../services/localStorageService';

interface DiaryContextType {
  entries: DailyEntry[];
  addEntry: (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DailyEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryByDate: (date: string) => DailyEntry | undefined;
  refreshEntries: () => Promise<void>;
  isLoading: boolean;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

interface DiaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load entries when user is authenticated or active profile changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [isAuthenticated, user]);

  // Listen for profile changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'neuri-active-profile' && isAuthenticated && user) {
        console.log('🔄 Active profile changed, reloading entries...');
        loadEntries();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated, user]);

  const getCurrentProfileId = (): string => {
    return localStorage.getItem('neuri-active-profile') || 'default';
  };

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const profileId = getCurrentProfileId();
      console.log('📊 Loading entries for profile:', profileId);
      
      const response = await localStorageService.getEntriesForProfile(profileId);
      
      const formattedEntries = response.entries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt)
      }));
      
      console.log(`✅ Loaded ${formattedEntries.length} entries for profile ${profileId}`);
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEntries = async () => {
    await loadEntries();
  };

  const addEntry = async (entryData: Omit<DailyEntry, 'id' | 'createdAt' | 'userId'>) => {
    try {
      const profileId = getCurrentProfileId();
      console.log('➕ Adding entry for profile:', profileId);
      
      const response = await localStorageService.createEntryForProfile(entryData, profileId);
      
      const newEntry: DailyEntry = {
        ...response.entry,
        createdAt: new Date(response.entry.createdAt)
      };
      
      setEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  };

  const updateEntry = async (id: string, entryData: Partial<DailyEntry>) => {
    try {
      const profileId = getCurrentProfileId();
      const response = await localStorageService.updateEntryForProfile(id, entryData, profileId);
      
      const updatedEntry: DailyEntry = {
        ...response.entry,
        createdAt: new Date(response.entry.createdAt)
      };
      
      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const profileId = getCurrentProfileId();
      await localStorageService.deleteEntryForProfile(id, profileId);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };

  const getEntryByDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  return (
    <DiaryContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntryByDate,
      refreshEntries,
      isLoading
    }}>
      {children}
    </DiaryContext.Provider>
  );
};