import React, { useState } from 'react';
import { soundManager } from '../utils/soundUtils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'emotion' | 'symptom';
  isSelected?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary',
  isSelected = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsPressed(true);
    soundManager.playClickSound();
    
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600';
      case 'emotion':
        return isSelected 
          ? 'border-opacity-100 shadow-lg scale-105' 
          : 'bg-white border-gray-200 hover:border-gray-300';
      case 'symptom':
        return isSelected
          ? 'bg-purple-100 border-purple-300 text-purple-800 shadow-md'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50';
      default:
        return 'bg-purple-500 text-white hover:bg-purple-600';
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${className}
        transition-all duration-200 
        transform hover:scale-105 active:scale-95
        ${isPressed ? 'scale-95' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-4 focus:ring-purple-200
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-white before:opacity-0 
        before:transition-opacity before:duration-200
        hover:before:opacity-10
      `}
    >
      <div className={`relative z-10`}>
        {children}
      </div>
    </button>
  );
};

export default AnimatedButton;