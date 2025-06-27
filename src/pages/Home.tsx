import React from 'react';
import { useDiary } from '../context/DiaryContext';
import { useLanguage } from '../context/LanguageContext';
import AnimatedButton from '../components/AnimatedButton';
import { Calendar, TrendingUp, Heart, Plus } from 'lucide-react';
import { formatDisplayDate, getTodayDate, getLocaleFromLanguage } from '../utils/dateUtils';

interface HomeProps {
  onViewChange?: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onViewChange }) => {
  const { entries } = useDiary();
  const { t, language } = useLanguage();
  
  const today = getTodayDate();
  const todayEntry = entries.find(entry => entry.date === today);
  
  const recentEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalSeizures = entries.filter(entry => entry.hadSeizure).length;
  const totalDays = entries.length;

  const handleRegisterClick = () => {
    if (onViewChange) {
      onViewChange('add');
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emotions: { [key: string]: string } = {
      'very-happy': '😊',
      'happy': '🙂',
      'neutral': '😐',
      'sad': '😢',
      'angry': '😠',
      'scared': '😨'
    };
    return emotions[emotion] || '😐';
  };

  // Get the current locale for date formatting
  const locale = getLocaleFromLanguage(language);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border-l-4 border-purple-500 animate-slide-in">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 lg:p-4 rounded-full">
            <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('home.welcome')}</h2>
            <p className="text-base lg:text-lg text-gray-600">{t('home.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 animate-slide-in delay-100">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-purple-500" />
          <span className="truncate">{t('home.today')} - {formatDisplayDate(today, locale)}</span>
        </h3>
        
        {todayEntry ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium">{t('home.todayRegistered')}</p>
            <div className="mt-2 text-sm text-green-700">
              <p>Estado emocional: {todayEntry.emotion}</p>
              <p>Convulsión: {todayEntry.hadSeizure ? t('common.yes') : t('common.no')}</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 font-medium">{t('home.todayPending')}</p>
            <AnimatedButton 
              onClick={handleRegisterClick}
              variant="primary"
              className="mt-3 px-4 lg:px-6 py-2 rounded-full flex items-center space-x-2 text-sm lg:text-base"
            >
              <Plus className="h-4 w-4" />
              <span>{t('home.registerNow')}</span>
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center animate-slide-in delay-200 hover:scale-105 transition-transform duration-200">
          <div className="bg-blue-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
          <h4 className="text-xl lg:text-2xl font-bold text-gray-800">{totalDays}</h4>
          <p className="text-sm lg:text-base text-gray-600">{t('home.stats.daysRecorded')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center animate-slide-in delay-300 hover:scale-105 transition-transform duration-200">
          <div className="bg-red-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <span className="text-xl lg:text-2xl">⚡</span>
          </div>
          <h4 className="text-xl lg:text-2xl font-bold text-gray-800">{totalSeizures}</h4>
          <p className="text-sm lg:text-base text-gray-600">{t('home.stats.seizuresRecorded')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center sm:col-span-2 lg:col-span-1 animate-slide-in delay-400 hover:scale-105 transition-transform duration-200">
          <div className="bg-green-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
          <h4 className="text-xl lg:text-2xl font-bold text-gray-800">
            {totalDays > 0 ? Math.round(((totalDays - totalSeizures) / totalDays) * 100) : 0}%
          </h4>
          <p className="text-sm lg:text-base text-gray-600">{t('home.stats.daysWithoutSeizures')}</p>
        </div>
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 animate-slide-in delay-500">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">{t('home.recentEntries')}</h3>
          <div className="space-y-3 lg:space-y-4">
            {recentEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="border border-gray-200 rounded-xl p-3 lg:p-4 hover:shadow-md transition-all duration-200 hover:scale-102 animate-slide-in"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="text-xl lg:text-2xl">
                      {getEmotionEmoji(entry.emotion)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm lg:text-base">{formatDisplayDate(entry.date, locale)}</p>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {entry.hadSeizure ? t('home.seizureRegistered') : t('home.noSeizures')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    {entry.symptoms.length > 0 && (
                      <p className="text-xs lg:text-sm text-gray-600">{entry.symptoms.length} {t('home.symptoms')}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;