import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NotificationSettings from '../components/NotificationSettings';
import MultiProfileSelector from '../components/MultiProfileSelector';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Settings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 lg:space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-gray-500 to-slate-500 p-3 rounded-full">
            <SettingsIcon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('settings.title')}</h1>
            <p className="text-gray-600">{t('settings.subtitle')}</p>
          </div>
        </div>

        {/* Language Settings */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Multi-Profile Management */}
      <MultiProfileSelector />

      {/* Notification Settings */}
      <NotificationSettings />
    </div>
  );
};

export default Settings;