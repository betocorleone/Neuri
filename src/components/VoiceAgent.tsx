import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import { VoiceService } from '../services/VoiceService';
import { AIPatternAnalyzer } from '../services/AIPatternAnalyzer';
import { DailyEntry } from '../types';

interface VoiceAgentProps {
  onEntryCreated?: (entry: DailyEntry) => void;
  onNavigateToView?: (view: string) => void;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ onEntryCreated, onNavigateToView }) => {
  const { user } = useAuth();
  const { entries, addEntry } = useDiary();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: 'agent' | 'user', message: string}>>([]);
  const [currentStep, setCurrentStep] = useState<'greeting' | 'emotion' | 'seizure' | 'symptoms' | 'observations' | 'complete'>('greeting');
  const [entryData, setEntryData] = useState<Partial<DailyEntry>>({});
  const [patterns, setPatterns] = useState<any>(null);
  
  const voiceService = useRef(new VoiceService());
  const patternAnalyzer = useRef(new AIPatternAnalyzer());
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (user && entries.length > 0) {
      const analysisResult = patternAnalyzer.current.analyzePatterns(entries);
      setPatterns(analysisResult);
    }
  }, [entries, user]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        handleUserResponse(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentStep]); // Add currentStep as dependency

  const speak = async (text: string) => {
    setIsSpeaking(true);
    await voiceService.current.speak(text);
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const addToConversation = (type: 'agent' | 'user', message: string) => {
    setConversation(prev => [...prev, { type, message }]);
  };

  const handleUserResponse = async (response: string) => {
    console.log('Handling user response:', response, 'Current step:', currentStep);
    addToConversation('user', response);
    
    switch (currentStep) {
      case 'greeting':
        await handleGreetingResponse(response);
        break;
      case 'emotion':
        await handleEmotionResponse(response);
        break;
      case 'seizure':
        await handleSeizureResponse(response);
        break;
      case 'symptoms':
        await handleSymptomsResponse(response);
        break;
      case 'observations':
        await handleObservationsResponse(response);
        break;
    }
  };

  const handleGreetingResponse = async (response: string) => {
    const childName = user?.childName || 'pequeño';
    let message = '';
    
    if (response.toLowerCase().includes('bien') || response.toLowerCase().includes('bueno')) {
      message = `¡Qué alegría escuchar eso, ${childName}! Ahora vamos a registrar cómo te sientes hoy. ¿Estás muy feliz, feliz, normal, triste, enojada o asustada?`;
    } else if (response.toLowerCase().includes('mal') || response.toLowerCase().includes('triste')) {
      message = `Oh, lo siento mucho ${childName}. Vamos a registrar cómo te sientes para que podamos ayudarte mejor. ¿Dirías que estás triste, enojada, asustada o de otra manera?`;
    } else {
      message = `Entiendo, ${childName}. Ahora cuéntame, ¿cómo te sientes hoy? Puedes decir: muy feliz, feliz, normal, triste, enojada o asustada.`;
    }
    
    addToConversation('agent', message);
    await speak(message);
    setCurrentStep('emotion');
    console.log('Step changed to emotion');
  };

  const handleEmotionResponse = async (response: string) => {
    console.log('Processing emotion response:', response);
    
    const emotions = {
      'muy feliz': 'very-happy',
      'muy contenta': 'very-happy',
      'súper feliz': 'very-happy',
      'feliz': 'happy',
      'contenta': 'happy',
      'alegre': 'happy',
      'normal': 'neutral',
      'bien': 'neutral',
      'regular': 'neutral',
      'triste': 'sad',
      'enojada': 'angry',
      'enojado': 'angry',
      'molesta': 'angry',
      'asustada': 'scared',
      'asustado': 'scared',
      'con miedo': 'scared'
    };

    let detectedEmotion = null;
    const lowerResponse = response.toLowerCase();
    
    // Check for exact matches first, then partial matches
    for (const [key, value] of Object.entries(emotions)) {
      if (lowerResponse.includes(key)) {
        detectedEmotion = value;
        break;
      }
    }

    // If no emotion detected, ask again
    if (!detectedEmotion) {
      const message = `No estoy seguro de entender cómo te sientes. ¿Puedes decirme si estás muy feliz, feliz, normal, triste, enojada o asustada? Usa una de esas palabras por favor.`;
      addToConversation('agent', message);
      await speak(message);
      return; // Stay in emotion step
    }

    setEntryData(prev => ({ ...prev, emotion: detectedEmotion }));
    console.log('Emotion detected:', detectedEmotion);
    
    const emotionLabels = {
      'very-happy': 'muy feliz',
      'happy': 'feliz',
      'neutral': 'normal',
      'sad': 'triste',
      'angry': 'enojada',
      'scared': 'asustada'
    };
    
    const message = `Perfecto, he registrado que te sientes ${emotionLabels[detectedEmotion as keyof typeof emotionLabels]}. Ahora, ¿tuviste alguna convulsión hoy? Puedes responder sí o no.`;
    
    addToConversation('agent', message);
    await speak(message);
    setCurrentStep('seizure');
    console.log('Step changed to seizure');
  };

  const handleSeizureResponse = async (response: string) => {
    const lowerResponse = response.toLowerCase();
    const hadSeizure = lowerResponse.includes('sí') || lowerResponse.includes('si') || 
                      lowerResponse.includes('yes') || lowerResponse.includes('tuve') ||
                      lowerResponse.includes('hubo');
    
    setEntryData(prev => ({ ...prev, hadSeizure }));
    console.log('Seizure status:', hadSeizure);
    
    let message = '';
    if (hadSeizure) {
      message = `Entiendo, voy a registrar que tuviste una convulsión. Ahora, ¿tienes algún síntoma? Por ejemplo: dolor de cabeza, cansancio, llanto, mareos, náuseas, o puedes decir "ninguno".`;
    } else {
      message = `¡Excelente! Me alegra saber que no tuviste convulsiones hoy. Ahora, ¿tienes algún síntoma? Por ejemplo: dolor de cabeza, cansancio, llanto, mareos, náuseas, o puedes decir "ninguno".`;
    }
    
    addToConversation('agent', message);
    await speak(message);
    setCurrentStep('symptoms');
    console.log('Step changed to symptoms');
  };

  const handleSymptomsResponse = async (response: string) => {
    const lowerResponse = response.toLowerCase();
    
    const symptomMap = {
      'dolor de cabeza': 'headache',
      'cabeza': 'headache',
      'duele la cabeza': 'headache',
      'cansancio': 'fatigue',
      'cansada': 'fatigue',
      'cansado': 'fatigue',
      'llanto': 'crying',
      'llorar': 'crying',
      'llorando': 'crying',
      'irritabilidad': 'irritability',
      'irritable': 'irritability',
      'molesta': 'irritability',
      'confusión': 'confusion',
      'confundida': 'confusion',
      'confundido': 'confusion',
      'náuseas': 'nausea',
      'nausea': 'nausea',
      'ganas de vomitar': 'nausea',
      'mareos': 'dizziness',
      'mareada': 'dizziness',
      'mareado': 'dizziness',
      'sueño': 'sleep-issues',
      'dormir': 'sleep-issues',
      'insomnio': 'sleep-issues',
      'apetito': 'appetite-loss',
      'comer': 'appetite-loss',
      'hambre': 'appetite-loss',
      'memoria': 'memory-issues',
      'recordar': 'memory-issues',
      'olvido': 'memory-issues'
    };

    const detectedSymptoms: string[] = [];
    
    if (lowerResponse.includes('ninguno') || lowerResponse.includes('no tengo') || 
        lowerResponse.includes('no siento') || lowerResponse.includes('nada')) {
      // No symptoms
    } else {
      for (const [key, value] of Object.entries(symptomMap)) {
        if (lowerResponse.includes(key)) {
          detectedSymptoms.push(value);
        }
      }
    }

    setEntryData(prev => ({ ...prev, symptoms: detectedSymptoms }));
    console.log('Symptoms detected:', detectedSymptoms);
    
    let message = '';
    if (detectedSymptoms.length > 0) {
      message = `He registrado tus síntomas. ¿Hay algo más que quieras contarme sobre cómo te sentiste hoy? Cualquier cosa especial que pasó o que notaste.`;
    } else {
      message = `Perfecto, no tienes síntomas molestos hoy. ¿Hay algo especial que quieras contarme sobre tu día? Algo divertido que hiciste o que te gustó.`;
    }
    
    addToConversation('agent', message);
    await speak(message);
    setCurrentStep('observations');
    console.log('Step changed to observations');
  };

  const handleObservationsResponse = async (response: string) => {
    setEntryData(prev => ({ ...prev, observations: response }));
    console.log('Final entry data:', { ...entryData, observations: response });
    
    // Create the entry
    const finalEntry = {
      date: new Date().toISOString().split('T')[0],
      hadSeizure: entryData.hadSeizure || false,
      symptoms: entryData.symptoms || [],
      emotion: entryData.emotion || 'neutral',
      observations: response
    };

    await addEntry(finalEntry);
    console.log('Entry created:', finalEntry);
    
    let message = `¡Perfecto! He guardado toda la información de tu día. `;
    
    // Add pattern insights if available
    if (patterns && patterns.insights.length > 0) {
      const insight = patterns.insights[0];
      message += `Te tengo una observación interesante: ${insight}. `;
    }
    
    message += `¡Gracias por contarme sobre tu día! ¿Te gustaría ver tu registro o hacer algo más?`;
    
    addToConversation('agent', message);
    await speak(message);
    setCurrentStep('complete');
    console.log('Step changed to complete');
    
    if (onEntryCreated) {
      onEntryCreated(finalEntry as DailyEntry);
    }
  };

  const startConversation = async () => {
    setIsOpen(true);
    setConversation([]);
    setCurrentStep('greeting');
    setEntryData({});
    console.log('Starting new conversation');
    
    const childName = user?.childName || 'pequeño';
    const greeting = `¡Hola ${childName}! Soy tu asistente de voz y estoy aquí para ayudarte a registrar cómo te sientes hoy. ¿Cómo estás?`;
    
    addToConversation('agent', greeting);
    await speak(greeting);
  };

  const showPatterns = async () => {
    if (!patterns) return;
    
    let message = 'He estado analizando tus registros y encontré algunos patrones interesantes: ';
    
    if (patterns.insights.length > 0) {
      message += patterns.insights.slice(0, 2).join('. ') + '.';
    } else {
      message += 'Aún necesito más información para encontrar patrones, pero estás haciendo un gran trabajo registrando tus días.';
    }
    
    addToConversation('agent', message);
    await speak(message);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={startConversation}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <MessageCircle className="h-6 w-6" />
          </div>
        </button>
      )}

      {/* Voice Agent Interface */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Asistente de Voz</h3>
                <p className="text-xs text-gray-600">
                  {isSpeaking ? 'Hablando...' : isListening ? 'Escuchando...' : `Paso: ${currentStep}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-48">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${
                  msg.type === 'agent'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800 ml-4'
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white hover:bg-green-600'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            {patterns && (
              <button
                onClick={showPatterns}
                disabled={isSpeaking}
                className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
                title="Ver patrones"
              >
                <Sparkles className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={() => voiceService.current.toggleMute()}
              className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200"
            >
              {voiceService.current.isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>

          {/* Pattern Insights */}
          {patterns && patterns.insights.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Patrones Detectados</h4>
              <p className="text-xs text-blue-700">{patterns.insights[0]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;