import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocaleFromLanguage } from '../utils/dateUtils';
import { User, Baby, Calendar, Mail, Save, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    childName: user?.childName || '',
    childAge: user?.childAge?.toString() || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get the current locale for date formatting
  const locale = getLocaleFromLanguage(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      setMessage(t('profile.nameRequired'));
      return;
    }
    
    if (!formData.childName.trim()) {
      setMessage(t('profile.childNameRequired'));
      return;
    }
    
    const age = parseInt(formData.childAge);
    if (!formData.childAge || isNaN(age) || age < 1 || age > 18) {
      setMessage(t('profile.ageRequired'));
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const success = await updateProfile({
        name: formData.name.trim(),
        childName: formData.childName.trim(),
        childAge: age
      });

      if (success) {
        setMessage(t('profile.updated'));
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(t('profile.error'));
      }
    } catch (error) {
      setMessage(t('profile.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      childName: user?.childName || '',
      childAge: user?.childAge?.toString() || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const handleLogout = () => {
    if (confirm(t('profile.confirmLogout'))) {
      logout();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear any error message when user starts typing
    if (message && (message.includes(t('common.error')) || message.includes(t('profile.nameRequired')) || message.includes(t('profile.ageRequired')))) {
      setMessage('');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
    setMessage('');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 opacity-0 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('profile.title')}</h1>
            <p className="text-gray-600">{t('profile.subtitle')}</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 opacity-0 animate-fade-in ${
            message.includes(t('common.error')) || message.includes(t('profile.nameRequired')) || message.includes(t('profile.ageRequired'))
              ? 'bg-red-50 border border-red-200 text-red-600' 
              : 'bg-green-50 border border-green-200 text-green-600'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('profile.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500">{t('profile.emailNote')}</p>
          </div>

          {/* Parent Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('profile.name')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-purple-500 focus:outline-none bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
                required
              />
            </div>
          </div>

          {/* Child Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('profile.childName')}
            </label>
            <div className="relative">
              <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.childName}
                onChange={(e) => handleInputChange('childName', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-purple-500 focus:outline-none bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
                required
              />
            </div>
          </div>

          {/* Child Age */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('profile.childAge')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                min="1"
                max="18"
                value={formData.childAge}
                onChange={(e) => handleInputChange('childAge', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-colors duration-200 ${
                  isEditing 
                    ? 'border-gray-200 focus:border-purple-500 focus:outline-none bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                >
                  {t('profile.edit')}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('profile.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{isLoading ? t('profile.saving') : t('profile.save')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {t('profile.cancel')}
                </button>
              </>
            )}
          </div>
        </form>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('profile.accountInfo')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">{t('profile.accountCreated')}:</p>
              <p className="font-medium text-gray-800">
                {user.createdAt.toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">{t('profile.userId')}:</p>
              <p className="font-medium text-gray-800 font-mono text-xs">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;