import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Plus, BarChart3, List, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView = 'home', onViewChange }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleViewChange = (view: string) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  const handleLogout = () => {
    if (confirm(t('profile.confirmLogout'))) {
      logout();
    }
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-purple-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 lg:w-16 lg:h-16">
              <img 
                src="/Logo Neuri-.png" 
                alt="Neuri Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Neuri</h1>
              <p className="text-sm lg:text-base text-gray-600">
                {user ? `${t('home.welcome').replace('👋', '').replace('¡', '').replace('!', '')}, ${user.name}` : t('app.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2">
            <button
              onClick={() => handleViewChange('home')}
              className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-200 text-sm lg:text-base ${
                currentView === 'home'
                  ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105'
              }`}
            >
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">{t('nav.home')}</span>
            </button>
            
            <button
              onClick={() => handleViewChange('add')}
              className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-200 text-sm lg:text-base ${
                currentView === 'add'
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'
              }`}
            >
              <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">{t('nav.add')}</span>
            </button>

            <button
              onClick={() => handleViewChange('entries')}
              className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-200 text-sm lg:text-base ${
                currentView === 'entries'
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105'
              }`}
            >
              <List className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">{t('nav.entries')}</span>
            </button>
            
            <button
              onClick={() => handleViewChange('reports')}
              className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-200 text-sm lg:text-base ${
                currentView === 'reports'
                  ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:scale-105'
              }`}
            >
              <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium">{t('nav.reports')}</span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewChange('profile')}
                className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-200 text-sm lg:text-base ${
                  currentView === 'profile'
                    ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200 hover:scale-105'
                }`}
              >
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium hidden sm:inline">{t('nav.profile')}</span>
              </button>

              <button
                onClick={() => handleViewChange('settings')}
                className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all duration-200 text-sm lg:text-base ${
                  currentView === 'settings'
                    ? 'bg-gray-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium hidden sm:inline">{t('nav.settings')}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105 transition-all duration-200 text-sm lg:text-base"
                title={t('nav.logout')}
              >
                <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;