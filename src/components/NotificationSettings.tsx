import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Bell, BellOff, Clock, AlertTriangle } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import AnimatedButton from './AnimatedButton';

const NotificationSettings: React.FC = () => {
  const { t } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [patternAlerts, setPatternAlerts] = useState(true);
  const [seizureAlerts, setSeizureAlerts] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load current settings
    setIsEnabled(notificationService.isEnabled());
    setReminderTime(localStorage.getItem('neuri-reminder-time') || '20:00');
    setPatternAlerts(localStorage.getItem('neuri-pattern-alerts') !== 'false');
    setSeizureAlerts(localStorage.getItem('neuri-seizure-alerts') !== 'false');
    setPermission(Notification.permission);
  }, []);

  const handleEnableNotifications = async () => {
    if (!isEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setIsEnabled(true);
        setPermission('granted');
        notificationService.setEnabled(true);
        
        // Schedule daily reminder
        await notificationService.scheduleDailyReminder(reminderTime);
        
        // Show confirmation
        await notificationService.showNotification(
          t('notifications.activated'),
          t('notifications.activatedDesc')
        );
      }
    } else {
      setIsEnabled(false);
      notificationService.setEnabled(false);
    }
  };

  const handleTimeChange = async (newTime: string) => {
    setReminderTime(newTime);
    localStorage.setItem('neuri-reminder-time', newTime);
    
    if (isEnabled) {
      // Reschedule with new time
      await notificationService.scheduleDailyReminder(newTime);
    }
  };

  const handlePatternAlertsChange = (enabled: boolean) => {
    setPatternAlerts(enabled);
    localStorage.setItem('neuri-pattern-alerts', enabled.toString());
  };

  const handleSeizureAlertsChange = (enabled: boolean) => {
    setSeizureAlerts(enabled);
    localStorage.setItem('neuri-seizure-alerts', enabled.toString());
  };

  const testNotification = async () => {
    await notificationService.showNotification(
      t('notifications.testTitle'),
      t('notifications.testDesc')
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
          <Bell className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{t('notifications.title')}</h2>
          <p className="text-gray-600">{t('notifications.subtitle')}</p>
        </div>
      </div>

      {/* Permission Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        permission === 'granted' 
          ? 'bg-green-50 border border-green-200' 
          : permission === 'denied'
          ? 'bg-red-50 border border-red-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center space-x-2">
          {permission === 'granted' && <span className="text-green-600">✅</span>}
          {permission === 'denied' && <span className="text-red-600">❌</span>}
          {permission === 'default' && <span className="text-yellow-600">⚠️</span>}
          
          <span className={`font-medium ${
            permission === 'granted' ? 'text-green-800' : 
            permission === 'denied' ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {t('notifications.status')}: {
              permission === 'granted' ? t('notifications.granted') :
              permission === 'denied' ? t('notifications.denied') : t('notifications.pending')
            }
          </span>
        </div>
        
        {permission === 'denied' && (
          <p className="text-red-600 text-sm mt-2">
            {t('notifications.blocked')}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isEnabled ? (
              <Bell className="h-5 w-5 text-blue-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{t('nav.settings')}</h3>
              <p className="text-sm text-gray-600">
                {isEnabled ? t('notifications.enabled') : t('notifications.disabled')}
              </p>
            </div>
          </div>
          
          <AnimatedButton
            onClick={handleEnableNotifications}
            variant={isEnabled ? 'secondary' : 'primary'}
            className="px-4 py-2 rounded-lg"
          >
            {isEnabled ? t('notifications.disable') : t('notifications.enable')}
          </AnimatedButton>
        </div>

        {/* Daily Reminder Time */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">{t('notifications.dailyReminder')}</h3>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">{t('notifications.reminderTime')}</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={!isEnabled}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
          
          <p className="text-xs text-gray-500">
            {t('notifications.reminderDesc')}
          </p>
        </div>

        {/* Pattern Alerts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">{t('notifications.patternAlerts')}</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {t('notifications.patternDesc')}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={patternAlerts}
                onChange={(e) => handlePatternAlertsChange(e.target.checked)}
                disabled={!isEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Seizure Alerts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚡</span>
            <h3 className="font-semibold text-gray-800">{t('notifications.seizureAlerts')}</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {t('notifications.seizureDesc')}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seizureAlerts}
                onChange={(e) => handleSeizureAlertsChange(e.target.checked)}
                disabled={!isEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Test Button */}
        {isEnabled && (
          <div className="pt-4 border-t border-gray-200">
            <AnimatedButton
              onClick={testNotification}
              variant="secondary"
              className="w-full py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>{t('notifications.test')}</span>
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;