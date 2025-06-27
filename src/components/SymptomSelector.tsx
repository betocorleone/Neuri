import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SymptomOption } from '../types';
import AnimatedButton from './AnimatedButton';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ selectedSymptoms, onSymptomsChange }) => {
  const { t } = useLanguage();

  const symptoms: SymptomOption[] = [
    { value: 'headache', label: t('symptom.headache') },
    { value: 'fatigue', label: t('symptom.fatigue') },
    { value: 'crying', label: t('symptom.crying') },
    { value: 'irritability', label: t('symptom.irritability') },
    { value: 'confusion', label: t('symptom.confusion') },
    { value: 'nausea', label: t('symptom.nausea') },
    { value: 'dizziness', label: t('symptom.dizziness') },
    { value: 'sleep-issues', label: t('symptom.sleepIssues') },
    { value: 'appetite-loss', label: t('symptom.appetiteLoss') },
    { value: 'memory-issues', label: t('symptom.memoryIssues') },
  ];

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      onSymptomsChange(selectedSymptoms.filter(s => s !== symptom));
    } else {
      onSymptomsChange([...selectedSymptoms, symptom]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-gray-700">
        {t('addEntry.symptoms.title')}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {symptoms.map((symptom) => (
          <AnimatedButton
            key={symptom.value}
            onClick={() => handleSymptomToggle(symptom.value)}
            variant="symptom"
            isSelected={selectedSymptoms.includes(symptom.value)}
            className={`p-2 lg:p-3 rounded-lg border-2 text-left ${
              selectedSymptoms.includes(symptom.value)
                ? 'bg-purple-100 border-purple-300 text-purple-800 shadow-md'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                selectedSymptoms.includes(symptom.value)
                  ? 'bg-purple-500 border-purple-500'
                  : 'border-gray-300'
              }`}>
                {selectedSymptoms.includes(symptom.value) && (
                  <svg className="w-2 h-2 lg:w-3 lg:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-medium text-sm lg:text-base">{symptom.label}</span>
            </div>
          </AnimatedButton>
        ))}
      </div>
    </div>
  );
};

export default SymptomSelector;