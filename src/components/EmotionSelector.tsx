import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EmotionOption } from '../types';
import AnimatedButton from './AnimatedButton';

interface EmotionSelectorProps {
  selectedEmotion: string;
  onEmotionChange: (emotion: string) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedEmotion, onEmotionChange }) => {
  const { t } = useLanguage();

  const emotions: EmotionOption[] = [
    { value: 'very-happy', emoji: '😊', label: t('emotion.veryHappy'), color: 'bg-green-100 border-green-300 text-green-800' },
    { value: 'happy', emoji: '🙂', label: t('emotion.happy'), color: 'bg-lime-100 border-lime-300 text-lime-800' },
    { value: 'neutral', emoji: '😐', label: t('emotion.neutral'), color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { value: 'sad', emoji: '😢', label: t('emotion.sad'), color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { value: 'angry', emoji: '😠', label: t('emotion.angry'), color: 'bg-red-100 border-red-300 text-red-800' },
    { value: 'scared', emoji: '😨', label: t('emotion.scared'), color: 'bg-purple-100 border-purple-300 text-purple-800' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-700">
        {t('addEntry.emotion.question')}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {emotions.map((emotion) => (
          <AnimatedButton
            key={emotion.value}
            onClick={() => onEmotionChange(emotion.value)}
            variant="emotion"
            isSelected={selectedEmotion === emotion.value}
            className={`p-3 lg:p-4 rounded-xl border-2 ${
              selectedEmotion === emotion.value
                ? `${emotion.color} border-opacity-100 shadow-lg scale-105`
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl lg:text-4xl mb-2">{emotion.emoji}</div>
              <div className="text-xs lg:text-sm font-medium">{emotion.label}</div>
            </div>
          </AnimatedButton>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;