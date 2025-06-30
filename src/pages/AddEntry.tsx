import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import { useLanguage } from '../context/LanguageContext';
import EmotionSelector from '../components/EmotionSelector';
import SymptomSelector from '../components/SymptomSelector';
import AnimatedButton from '../components/AnimatedButton';
import SuccessAnimation from '../components/SuccessAnimation';
import { Save, Calendar } from 'lucide-react';
import { getTodayDate } from '../utils/dateUtils';
import { soundManager } from '../utils/soundUtils';

interface AddEntryProps {
  onNavigateHome?: () => void;
}

const AddEntry: React.FC<AddEntryProps> = ({ onNavigateHome }) => {
  const { addEntry, getEntryByDate } = useDiary();
  const { t } = useLanguage();
  const [date, setDate] = useState(getTodayDate());
  const [hadSeizure, setHadSeizure] = useState(false);
  const [seizureTime, setSeizureTime] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [emotion, setEmotion] = useState('');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const existingEntry = getEntryByDate(date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emotion) {
      soundManager.playNotificationSound();
      alert(t('addEntry.selectEmotion'));
      return;
    }

    setIsSubmitting(true);

    try {
      await addEntry({
        date,
        hadSeizure,
        seizureTime: hadSeizure ? seizureTime : undefined,
        symptoms,
        emotion,
        observations
      });

      // Play success sound and show animation
      soundManager.playSuccessSound();
      setShowSuccess(true);

      // Reset form after animation starts
      setTimeout(() => {
        setDate(getTodayDate());
        setHadSeizure(false);
        setSeizureTime('');
        setSymptoms([]);
        setEmotion('');
        setObservations('');
      }, 1000);

    } catch (error) {
      soundManager.playNotificationSound();
      alert(t('addEntry.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeizureToggle = (value: boolean) => {
    setHadSeizure(value);
    soundManager.playClickSound();
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <SuccessAnimation 
        show={showSuccess} 
        onComplete={() => setShowSuccess(false)}
        onNavigateHome={handleNavigateHome}
        message={t('addEntry.success')}
      />
      
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3 mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 animate-slide-in">{t('addEntry.title')}</h1>
            <p className="text-gray-600 animate-slide-in delay-100">{t('addEntry.subtitle')}</p>
          </div>
        </div>

        {existingEntry && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 font-medium text-sm lg:text-base">
              {t('addEntry.existingEntry')}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Date Selection */}
          <div className="space-y-3 animate-slide-in delay-200">
            <label className="block text-lg font-semibold text-gray-700">
              {t('addEntry.date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-base lg:text-lg transition-all duration-200 hover:border-purple-300"
              required
            />
          </div>

          {/* Seizure Information */}
          <div className="space-y-4 animate-slide-in delay-300">
            <label className="block text-lg font-semibold text-gray-700">
              {t('addEntry.seizure.question')}
            </label>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <AnimatedButton
                onClick={() => handleSeizureToggle(false)}
                variant="emotion"
                isSelected={!hadSeizure}
                className={`p-3 lg:p-4 rounded-xl border-2 ${
                  !hadSeizure
                    ? 'bg-green-100 border-green-300 text-green-800 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl mb-2">✅</div>
                  <div className="font-semibold text-sm lg:text-base">{t('common.no')}</div>
                </div>
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => handleSeizureToggle(true)}
                variant="emotion"
                isSelected={hadSeizure}
                className={`p-3 lg:p-4 rounded-xl border-2 ${
                  hadSeizure
                    ? 'bg-red-100 border-red-300 text-red-800 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl mb-2">⚡</div>
                  <div className="font-semibold text-sm lg:text-base">{t('common.yes')}</div>
                </div>
              </AnimatedButton>
            </div>
          </div>

          {/* Seizure Time */}
          {hadSeizure && (
            <div className="space-y-3 animate-slide-in delay-400">
              <label className="block text-lg font-semibold text-gray-700">
                {t('addEntry.seizure.time')}
              </label>
              <input
                type="time"
                value={seizureTime}
                onChange={(e) => setSeizureTime(e.target.value)}
                className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-base lg:text-lg transition-all duration-200 hover:border-purple-300"
              />
            </div>
          )}

          {/* Emotion Selection */}
          <div className="animate-slide-in delay-500">
            <EmotionSelector
              selectedEmotion={emotion}
              onEmotionChange={setEmotion}
            />
          </div>

          {/* Symptoms Selection */}
          <div className="animate-slide-in delay-600">
            <SymptomSelector
              selectedSymptoms={symptoms}
              onSymptomsChange={setSymptoms}
            />
          </div>

          {/* Observations */}
          <div className="space-y-3 animate-slide-in delay-700">
            <label className="block text-lg font-semibold text-gray-700">
              {t('addEntry.observations.title')}
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder={t('addEntry.observations.placeholder')}
              rows={4}
              className="w-full p-3 lg:p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-base lg:text-lg resize-none transition-all duration-200 hover:border-purple-300"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 animate-slide-in delay-800">
            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="w-full py-3 lg:py-4 px-6 lg:px-8 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              <Save className="h-5 w-5 lg:h-6 lg:w-6" />
              <span>{isSubmitting ? t('addEntry.saving') : t('addEntry.save')}</span>
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntry;