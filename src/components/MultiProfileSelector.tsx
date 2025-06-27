import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import { useLanguage } from '../context/LanguageContext';
import { Baby, Plus, User } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  profilePicture?: string;
  isActive: boolean;
}

interface MultiProfileSelectorProps {
  onProfileChange?: (profileId: string) => void;
}

const MultiProfileSelector: React.FC<MultiProfileSelectorProps> = ({ onProfileChange }) => {
  const { user } = useAuth();
  const { refreshEntries } = useDiary();
  const { t } = useLanguage();
  
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string>('default');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: '', age: '' });

  // Fixed: Load profiles only once when user ID changes, prevent circular dependencies
  useEffect(() => {
    if (!user?.id) {
      setProfiles([]);
      setActiveProfile('default');
      return;
    }

    console.log('🔄 Loading profiles for user:', user.id);
    
    // Create a stable reference to avoid re-running effect
    const userId = user.id;
    const savedProfiles = localStorage.getItem(`neuri-profiles-${userId}`);
    const currentActiveProfile = localStorage.getItem('neuri-active-profile') || 'default';
    
    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles);
        const updatedProfiles = parsed.map((p: ChildProfile) => ({
          ...p,
          isActive: p.id === currentActiveProfile
        }));
        setProfiles(updatedProfiles);
        setActiveProfile(currentActiveProfile);
        console.log('✅ Profiles loaded from storage:', updatedProfiles.length);
      } catch (error) {
        console.error('Error parsing profiles:', error);
        // Create default profile if parsing fails
        createDefaultProfile(userId);
      }
    } else {
      createDefaultProfile(userId);
    }

    // Fixed: Move function inside useEffect to avoid closure issues
    function createDefaultProfile(currentUserId: string) {
      const defaultProfile: ChildProfile = {
        id: 'default',
        name: user.childName,
        age: user.childAge,
        isActive: true
      };
      setProfiles([defaultProfile]);
      setActiveProfile('default');
      localStorage.setItem('neuri-active-profile', 'default');
      localStorage.setItem(`neuri-profiles-${currentUserId}`, JSON.stringify([defaultProfile]));
      console.log('✅ Default profile created');
    }
  }, [user?.id, user?.childName, user?.childAge]); // Fixed: Only depend on stable values

  const saveProfiles = (profilesToSave: ChildProfile[]) => {
    if (!user?.id) return;
    localStorage.setItem(`neuri-profiles-${user.id}`, JSON.stringify(profilesToSave));
  };

  const handleAddProfile = () => {
    if (!newProfile.name.trim() || !newProfile.age) return;

    const age = parseInt(newProfile.age);
    if (age < 1 || age > 18) {
      alert(t('profiles.ageRange'));
      return;
    }

    const newProfileData: ChildProfile = {
      id: `profile-${Date.now()}`,
      name: newProfile.name.trim(),
      age,
      isActive: false
    };

    const updatedProfiles = [...profiles, newProfileData];
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
    
    setNewProfile({ name: '', age: '' });
    setShowAddForm(false);
  };

  const handleProfileSwitch = (profileId: string) => {
    const updatedProfiles = profiles.map(p => ({
      ...p,
      isActive: p.id === profileId
    }));
    
    setProfiles(updatedProfiles);
    setActiveProfile(profileId);
    saveProfiles(updatedProfiles);
    
    // Store the active profile globally
    localStorage.setItem('neuri-active-profile', profileId);
    
    if (onProfileChange) {
      onProfileChange(profileId);
    }
    
    // Fixed: Use a more reliable reload method
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      alert(t('profiles.keepOne'));
      return;
    }

    if (confirm(t('profiles.confirmDelete'))) {
      // Delete profile data
      localStorage.removeItem(`neuri-entries-${user?.id}-${profileId}`);
      
      const updatedProfiles = profiles.filter(p => p.id !== profileId);
      
      // If deleting active profile, make first profile active
      if (profileId === activeProfile && updatedProfiles.length > 0) {
        updatedProfiles[0].isActive = true;
        setActiveProfile(updatedProfiles[0].id);
        localStorage.setItem('neuri-active-profile', updatedProfiles[0].id);
      }
      
      setProfiles(updatedProfiles);
      saveProfiles(updatedProfiles);
      
      // Refresh the page to update data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const getActiveProfile = () => {
    return profiles.find(p => p.id === activeProfile);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 flex items-center">
          <User className="h-5 w-5 mr-2 text-purple-500" />
          {t('profiles.title')}
        </h3>
        <AnimatedButton
          onClick={() => setShowAddForm(!showAddForm)}
          variant="secondary"
          className="px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t('profiles.add')}</span>
        </AnimatedButton>
      </div>

      {/* Active Profile Display */}
      {getActiveProfile() && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Baby className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-800">{t('profiles.activeProfile')}</h4>
              <p className="text-purple-600">
                {getActiveProfile()!.name} - {getActiveProfile()!.age} {t('profiles.years')}
              </p>
              <p className="text-xs text-purple-500">
                ID: {getActiveProfile()!.id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Profile Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">{t('profiles.addNew')}</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profiles.childName')}
              </label>
              <input
                type="text"
                value={newProfile.name}
                onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Ej: María"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profiles.age')}
              </label>
              <input
                type="number"
                min="1"
                max="18"
                value={newProfile.age}
                onChange={(e) => setNewProfile(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Ej: 8"
              />
            </div>
            <div className="flex space-x-2">
              <AnimatedButton
                onClick={handleAddProfile}
                variant="primary"
                className="px-4 py-2 rounded-lg text-sm"
              >
                {t('profiles.add')}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setShowAddForm(false)}
                variant="secondary"
                className="px-4 py-2 rounded-lg text-sm"
              >
                {t('common.cancel')}
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}

      {/* Profiles List */}
      <div className="space-y-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
              profile.isActive
                ? 'border-purple-300 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                profile.isActive ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Baby className={`h-5 w-5 ${
                  profile.isActive ? 'text-purple-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <p className={`font-medium ${
                  profile.isActive ? 'text-purple-800' : 'text-gray-800'
                }`}>
                  {profile.name}
                </p>
                <p className={`text-sm ${
                  profile.isActive ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {profile.age} {t('profiles.years')}
                </p>
                <p className="text-xs text-gray-400">
                  {profile.id}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!profile.isActive && (
                <AnimatedButton
                  onClick={() => handleProfileSwitch(profile.id)}
                  variant="secondary"
                  className="px-3 py-1 rounded text-sm"
                >
                  {t('profiles.activate')}
                </AnimatedButton>
              )}
              
              {profile.id !== 'default' && profiles.length > 1 && (
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title={t('profiles.delete')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Baby className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>{t('profiles.noProfiles')}</p>
          <p className="text-sm">{t('profiles.addFirst')}</p>
        </div>
      )}
    </div>
  );
};

export default MultiProfileSelector;