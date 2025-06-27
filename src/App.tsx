import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import VoiceAgent from './components/VoiceAgent';
import OfflineIndicator from './components/OfflineIndicator';
import Home from './pages/Home';
import AddEntry from './pages/AddEntry';
import ViewEntries from './pages/ViewEntries';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/Logo Neuri-.png" 
              alt="Neuri Logo" 
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authView) {
      case 'login':
        return (
          <Login
            onSuccess={() => setCurrentView('home')}
            onRegister={() => setAuthView('register')}
            onBackToLanding={() => setAuthView('landing')}
          />
        );
      case 'register':
        return (
          <Register
            onSuccess={() => setCurrentView('home')}
            onBackToLogin={() => setAuthView('login')}
          />
        );
      default:
        return (
          <Landing
            onGetStarted={() => setAuthView('register')}
            onLogin={() => setAuthView('login')}
          />
        );
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'add':
        return <AddEntry onNavigateHome={() => setCurrentView('home')} />;
      case 'entries':
        return <ViewEntries />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onViewChange={setCurrentView} />;
    }
  };

  return (
    <DiaryProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <OfflineIndicator />
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main className="container mx-auto px-4 py-6">
          {renderCurrentView()}
        </main>
        <VoiceAgent 
          onEntryCreated={() => setCurrentView('home')}
          onNavigateToView={setCurrentView}
        />
      </div>
    </DiaryProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;