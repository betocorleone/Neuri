import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{t('settings.language')}</span>
      </div>
      
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setLanguage('es')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            language === 'es'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('settings.spanish')}
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            language === 'en'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('settings.english')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;