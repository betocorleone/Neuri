import React, { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  message?: string;
  onNavigateHome?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  show, 
  onComplete, 
  message = '¡Registro guardado exitosamente!',
  onNavigateHome
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setProgress(0);
      
      // Smooth progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 70);

      // Complete animation and navigate
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        if (onNavigateHome) {
          onNavigateHome();
        }
        if (onComplete) {
          setTimeout(onComplete, 300);
        }
      }, 3500);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete, onNavigateHome]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-400/90 via-pink-400/90 to-indigo-400/90 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden">
        
        {/* Main character - single consistent animal */}
        <div className="relative mb-6">
          <div className="text-8xl mb-4 relative z-10">
            🐱
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
            {message}
          </h2>
          
          <div className="flex justify-center space-x-2 mb-4">
            <span className="text-2xl">🎉</span>
            <span className="text-2xl">🌟</span>
            <span className="text-2xl">✅</span>
          </div>

          <p className="text-lg text-gray-600 font-medium">
            ¡Muy bien hecho!
          </p>
        </div>

        {/* Progress indicator */}
        <div>
          <p className="text-sm text-gray-500 mb-3">Regresando al inicio...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Soft border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 opacity-30"></div>
      </div>
    </div>
  );
};

export default SuccessAnimation;