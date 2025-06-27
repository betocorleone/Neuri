import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { localStorageService } from '../services/localStorageService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  childName: string;
  childAge: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      // Initialize demo data
      localStorageService.initializeDemoData();
      
      const user = localStorageService.getCurrentUser();
      
      if (user) {
        setAuthState({
          user: {
            ...user,
            createdAt: new Date(user.createdAt)
          },
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await localStorageService.login(email, password);
      
      setAuthState({
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt)
        },
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await localStorageService.register(userData);
      
      setAuthState({
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt)
        },
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorageService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await localStorageService.updateProfile(userData);
      
      setAuthState(prev => ({
        ...prev,
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt)
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};