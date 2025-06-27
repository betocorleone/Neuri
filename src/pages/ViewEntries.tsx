import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDisplayDate, getLocaleFromLanguage } from '../utils/dateUtils';
import { Calendar, Search, Filter } from 'lucide-react';

const ViewEntries: React.FC = () => {
  const { entries } = useDiary();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, seizures, no-seizures

  // Get the current locale for date formatting
  const locale = getLocaleFromLanguage(language);

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.observations.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           formatDisplayDate(entry.date, locale).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'seizures' && entry.hadSeizure) ||
                           (filterType === 'no-seizures' && !entry.hadSeizure);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const getEmotionLabel = (emotion: string) => {
    const emotionKeys: { [key: string]: string } = {
      'very-happy': 'emotion.veryHappy',
      'happy': 'emotion.happy',
      'neutral': 'emotion.neutral',
      'sad': 'emotion.sad',
      'angry': 'emotion.angry',
      'scared': 'emotion.scared'
    };
    return t(emotionKeys[emotion] || 'emotion.neutral');
  };

  const getSymptomLabel = (symptom: string) => {
    const symptomKeys: { [key: string]: string } = {
      'headache': 'symptom.headache',
      'fatigue': 'symptom.fatigue',
      'crying': 'symptom.crying',
      'irritability': 'symptom.irritability',
      'confusion': 'symptom.confusion',
      'nausea': 'symptom.nausea',
      'dizziness': 'symptom.dizziness',
      'sleep-issues': 'symptom.sleepIssues',
      'appetite-loss': 'symptom.appetiteLoss',
      'memory-issues': 'symptom.memoryIssues'
    };
    return t(symptomKeys[symptom] || symptom);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('entries.title')}</h1>
            <p className="text-gray-600">{t('entries.subtitle')}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('entries.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm lg:text-base"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full lg:w-auto pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white text-sm lg:text-base"
            >
              <option value="all">{t('entries.filter.all')}</option>
              <option value="seizures">{t('entries.filter.seizures')}</option>
              <option value="no-seizures">{t('entries.filter.noSeizures')}</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {t('entries.showing')} {filteredEntries.length} {t('entries.of')} {entries.length} {t('entries.title').toLowerCase()}
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-center">
            <div className="text-4xl lg:text-6xl mb-4">📝</div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">{t('entries.noEntries')}</h3>
            <p className="text-gray-600 text-sm lg:text-base">
              {entries.length === 0 
                ? t('entries.noEntriesDesc')
                : t('entries.noSearchResults')
              }
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
                {/* Date and Emotion */}
                <div className="flex items-center space-x-4">
                  <div className="text-4xl lg:text-6xl">{getEmotionEmoji(entry.emotion)}</div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                      {formatDisplayDate(entry.date, locale)}
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base">{getEmotionLabel(entry.emotion)}</p>
                  </div>
                </div>

                {/* Entry Details */}
                <div className="flex-1 space-y-3 lg:space-y-4">
                  {/* Seizure Status */}
                  <div className="flex items-center space-x-2">
                    {entry.hadSeizure ? (
                      <>
                        <span className="text-xl lg:text-2xl">⚡</span>
                        <span className="font-semibold text-red-600 text-sm lg:text-base">{t('home.seizureRegistered')}</span>
                        {entry.seizureTime && (
                          <span className="text-gray-600 text-sm lg:text-base">{t('entries.seizureAt')} {entry.seizureTime}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-xl lg:text-2xl">✅</span>
                        <span className="font-semibold text-green-600 text-sm lg:text-base">{t('home.noSeizures')}</span>
                      </>
                    )}
                  </div>

                  {/* Symptoms */}
                  {entry.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">{t('entries.symptomsObserved')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.symptoms.map((symptom) => (
                          <span
                            key={symptom}
                            className="bg-purple-100 text-purple-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium"
                          >
                            {getSymptomLabel(symptom)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {entry.observations && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">{t('entries.observations')}</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm lg:text-base">
                        {entry.observations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewEntries;