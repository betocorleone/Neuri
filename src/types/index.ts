export interface DailyEntry {
  id: string;
  date: string;
  hadSeizure: boolean;
  seizureTime?: string;
  symptoms: string[];
  emotion: string;
  observations: string;
  createdAt: Date;
  userId: string;
}

export interface EmotionOption {
  value: string;
  emoji: string;
  label: string;
  color: string;
}

export interface SymptomOption {
  value: string;
  label: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  childName: string;
  childAge: number;
  createdAt: Date;
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}