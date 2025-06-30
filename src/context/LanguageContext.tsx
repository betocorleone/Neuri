import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionary - Complete with all missing keys
const translations: Record<Language, Record<string, string>> = {
  es: {
    // App general
    'app.title': 'Neuri - Diario de salud',
    'app.subtitle': 'Seguimiento diario con amor',
    'app.loading': 'Cargando...',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.add': 'Agregar',
    'nav.entries': 'Historial',
    'nav.reports': 'Reportes',
    'nav.profile': 'Perfil',
    'nav.settings': 'Config',
    'nav.logout': 'Salir',
    
    // Home
    'home.welcome': '¡Hola! 👋',
    'home.subtitle': 'Bienvenida a tu diario de salud personal',
    'home.today': 'Hoy',
    'home.todayRegistered': '✅ Ya registraste el día de hoy',
    'home.todayPending': '⏰ Aún no has registrado el día de hoy',
    'home.registerNow': 'Registrar ahora',
    'home.stats.daysRecorded': 'Días registrados',
    'home.stats.seizuresRecorded': 'Convulsiones registradas',
    'home.stats.daysWithoutSeizures': 'Días sin convulsiones',
    'home.recentEntries': 'Registros Recientes',
    'home.seizureRegistered': '⚡ Convulsión registrada',
    'home.noSeizures': '✅ Sin convulsiones',
    'home.symptoms': 'síntomas',
    'home.emotionalState': 'Estado emocional',
    'home.seizure': 'Convulsión',
    
    // Add Entry
    'addEntry.title': 'Nuevo Registro',
    'addEntry.subtitle': 'Completa la información del día',
    'addEntry.date': 'Fecha del registro 📅',
    'addEntry.emotion.question': '¿Cómo se sintió hoy? 💝',
    'addEntry.seizure.question': '¿Hubo alguna convulsión? ⚡',
    'addEntry.seizure.time': 'Hora aproximada (opcional) 🕐',
    'addEntry.symptoms.title': 'Síntomas observados 🩺',
    'addEntry.observations.title': 'Observaciones adicionales 📝',
    'addEntry.observations.placeholder': 'Escribe cualquier observación importante del día...',
    'addEntry.save': 'Guardar Registro',
    'addEntry.saving': 'Guardando...',
    'addEntry.existingEntry': '⚠️ Ya existe un registro para esta fecha. Al guardar, se creará un nuevo registro.',
    'addEntry.selectEmotion': 'Por favor selecciona una emoción',
    'addEntry.error': 'Error al guardar el registro. Por favor intenta de nuevo.',
    'addEntry.success': '¡Registro guardado exitosamente! 🎉',
    
    // Entries (View Entries page)
    'entries.title': 'Historial de Registros',
    'entries.subtitle': 'Revisa todos los registros guardados',
    'entries.search': 'Buscar en observaciones o fechas...',
    'entries.filter.all': 'Todos los registros',
    'entries.filter.seizures': 'Solo con convulsiones',
    'entries.filter.noSeizures': 'Sin convulsiones',
    'entries.showing': 'Mostrando',
    'entries.of': 'de',
    'entries.noEntries': 'No hay registros',
    'entries.noEntriesDesc': 'Aún no has creado ningún registro. ¡Comienza agregando tu primer día!',
    'entries.noSearchResults': 'No se encontraron registros que coincidan con tu búsqueda.',
    'entries.seizureAt': 'a las',
    'entries.symptomsObserved': 'Síntomas observados:',
    'entries.observations': 'Observaciones:',
    
    // Reports
    'reports.title': 'Reportes de Salud',
    'reports.subtitle': 'Análisis detallado para',
    'reports.weekly': 'Semanal',
    'reports.monthly': 'Mensual',
    'reports.downloadTxt': 'Descargar TXT',
    'reports.medicalReport': 'Reporte Médico',
    'reports.generating': 'Generando...',
    'reports.period': 'Período:',
    'reports.totalEntries': 'Total de entradas en la base de datos:',
    'reports.filteredEntries': 'Filtradas para este período:',
    'reports.activeProfile': 'Perfil activo:',
    'reports.years': 'años',
    'reports.daysRecorded': 'Días registrados',
    'reports.daysWithSeizures': 'Días con convulsiones',
    'reports.daysWithoutSeizures': 'Días sin convulsiones',
    'reports.seizurePercentage': 'Días sin convulsiones',
    'reports.emotionalState': 'Estado Emocional',
    'reports.mostFrequentSymptoms': 'Síntomas Más Frecuentes',
    'reports.noSymptomsInPeriod': 'No se registraron síntomas en este período',
    'reports.periodEntries': 'Registros del Período',
    'reports.entriesCount': 'entradas',
    'reports.showingEntriesOf': 'Mostrando 10 de',
    'reports.entriesInPeriod': 'registros del período',
    'reports.noDataForPeriod': 'No hay datos para este período',
    'reports.noDataDesc': 'No se encontraron registros para el período seleccionado. Intenta con otra fecha o cambia a vista mensual.',
    'reports.tipChangeView': 'Tip: Cambia a vista "Mensual" para ver más datos, o selecciona una fecha más reciente.',
    'reports.reportGenerated': 'Reporte médico generado exitosamente',
    'reports.reportError': 'Error al generar el reporte médico',
    'reports.symptoms': 'síntomas',
    
    // Emotions
    'emotion.veryHappy': 'Muy Feliz',
    'emotion.happy': 'Feliz',
    'emotion.neutral': 'Normal',
    'emotion.sad': 'Triste',
    'emotion.angry': 'Enojada',
    'emotion.scared': 'Asustada',
    
    // Symptoms
    'symptom.headache': 'Dolor de cabeza',
    'symptom.fatigue': 'Cansancio',
    'symptom.crying': 'Llanto',
    'symptom.irritability': 'Irritabilidad',
    'symptom.confusion': 'Confusión',
    'symptom.nausea': 'Náuseas',
    'symptom.dizziness': 'Mareos',
    'symptom.sleepIssues': 'Problemas de sueño',
    'symptom.appetiteLoss': 'Pérdida de apetito',
    'symptom.memoryIssues': 'Problemas de memoria',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Personaliza tu experiencia en Neuri',
    'settings.language': 'Idioma',
    'settings.spanish': 'Español',
    'settings.english': 'English',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.subtitle': 'Gestiona tu información personal',
    'profile.email': 'Email',
    'profile.emailNote': 'El email no se puede modificar',
    'profile.name': 'Tu nombre',
    'profile.childName': 'Nombre del niño/a',
    'profile.childAge': 'Edad del niño/a',
    'profile.edit': 'Editar Perfil',
    'profile.save': 'Guardar Cambios',
    'profile.saving': 'Guardando...',
    'profile.cancel': 'Cancelar',
    'profile.logout': 'Cerrar Sesión',
    'profile.confirmLogout': '¿Estás seguro que quieres cerrar sesión?',
    'profile.accountInfo': 'Información de la cuenta',
    'profile.accountCreated': 'Cuenta creada',
    'profile.userId': 'ID de usuario',
    'profile.updated': 'Perfil actualizado correctamente',
    'profile.error': 'Error al actualizar el perfil',
    'profile.nameRequired': 'El nombre es requerido',
    'profile.childNameRequired': 'El nombre del niño/a es requerido',
    'profile.ageRequired': 'La edad debe estar entre 1 y 18 años',
    
    // Multi Profile
    'profiles.title': 'Perfiles de Niños',
    'profiles.add': 'Agregar',
    'profiles.activeProfile': 'Perfil Activo',
    'profiles.years': 'años',
    'profiles.addNew': 'Agregar Nuevo Perfil',
    'profiles.childName': 'Nombre del niño/a',
    'profiles.age': 'Edad',
    'profiles.activate': 'Activar',
    'profiles.delete': 'Eliminar perfil',
    'profiles.switchingTo': 'Cambiando a',
    'profiles.noProfiles': 'No hay perfiles configurados',
    'profiles.addFirst': 'Agrega el primer perfil para comenzar',
    'profiles.keepOne': 'Debe mantener al menos un perfil',
    'profiles.confirmDelete': '¿Estás seguro de eliminar este perfil? Se perderán todos los datos asociados.',
    'profiles.ageRange': 'La edad debe estar entre 1 y 18 años',
    
    // Notifications
    'notifications.title': 'Configuración de Notificaciones',
    'notifications.subtitle': 'Personaliza tus recordatorios y alertas',
    'notifications.status': 'Estado de permisos',
    'notifications.granted': 'Concedidos',
    'notifications.denied': 'Denegados',
    'notifications.pending': 'Pendientes',
    'notifications.blocked': 'Las notificaciones están bloqueadas. Puedes habilitarlas en la configuración de tu navegador.',
    'notifications.enable': 'Activar',
    'notifications.disable': 'Desactivar',
    'notifications.enabled': 'Activadas',
    'notifications.disabled': 'Desactivadas',
    'notifications.dailyReminder': 'Recordatorio Diario',
    'notifications.reminderTime': 'Hora del recordatorio:',
    'notifications.reminderDesc': 'Te recordaremos registrar el día de tu pequeño/a a esta hora cada día.',
    'notifications.patternAlerts': 'Alertas de Patrones',
    'notifications.patternDesc': 'Recibir notificaciones cuando se detecten patrones importantes',
    'notifications.seizureAlerts': 'Alertas de Convulsiones',
    'notifications.seizureDesc': 'Recibir recordatorios importantes cuando se registre una convulsión',
    'notifications.test': 'Probar Notificación',
    'notifications.activated': '🎉 ¡Notificaciones Activadas!',
    'notifications.activatedDesc': 'Te recordaremos registrar el día de tu pequeño/a cada día.',
    'notifications.testTitle': '🧪 Notificación de Prueba',
    'notifications.testDesc': 'Las notificaciones están funcionando correctamente.',
    
    // Common
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.close': 'Cerrar',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.all': 'Todos',
    'common.none': 'Ninguno',
    'common.optional': 'opcional',
  },
  en: {
    // App general
    'app.title': 'Neuri - Health Diary',
    'app.subtitle': 'Daily tracking with love',
    'app.loading': 'Loading...',
    
    // Navigation
    'nav.home': 'Home',
    'nav.add': 'Add',
    'nav.entries': 'History',
    'nav.reports': 'Reports',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Home
    'home.welcome': 'Hello! 👋',
    'home.subtitle': 'Welcome to your personal health diary',
    'home.today': 'Today',
    'home.todayRegistered': '✅ You already registered today',
    'home.todayPending': "⏰ You haven't registered today yet",
    'home.registerNow': 'Register now',
    'home.stats.daysRecorded': 'Days recorded',
    'home.stats.seizuresRecorded': 'Seizures recorded',
    'home.stats.daysWithoutSeizures': 'Days without seizures',
    'home.recentEntries': 'Recent Entries',
    'home.seizureRegistered': '⚡ Seizure registered',
    'home.noSeizures': '✅ No seizures',
    'home.symptoms': 'symptoms',
    'home.emotionalState': 'Emotional state',
    'home.seizure': 'Seizure',
    
    // Add Entry
    'addEntry.title': 'New Entry',
    'addEntry.subtitle': 'Complete the day information',
    'addEntry.date': 'Entry date 📅',
    'addEntry.emotion.question': 'How did they feel today? 💝',
    'addEntry.seizure.question': 'Was there any seizure? ⚡',
    'addEntry.seizure.time': 'Approximate time (optional) 🕐',
    'addEntry.symptoms.title': 'Observed symptoms 🩺',
    'addEntry.observations.title': 'Additional observations 📝',
    'addEntry.observations.placeholder': 'Write any important observations from the day...',
    'addEntry.save': 'Save Entry',
    'addEntry.saving': 'Saving...',
    'addEntry.existingEntry': '⚠️ An entry already exists for this date. Saving will create a new entry.',
    'addEntry.selectEmotion': 'Please select an emotion',
    'addEntry.error': 'Error saving entry. Please try again.',
    'addEntry.success': 'Entry saved successfully! 🎉',
    
    // Entries (View Entries page)
    'entries.title': 'Entry History',
    'entries.subtitle': 'Review all saved entries',
    'entries.search': 'Search in observations or dates...',
    'entries.filter.all': 'All entries',
    'entries.filter.seizures': 'Only with seizures',
    'entries.filter.noSeizures': 'Without seizures',
    'entries.showing': 'Showing',
    'entries.of': 'of',
    'entries.noEntries': 'No entries',
    'entries.noEntriesDesc': "You haven't created any entries yet. Start by adding your first day!",
    'entries.noSearchResults': 'No entries found matching your search.',
    'entries.seizureAt': 'at',
    'entries.symptomsObserved': 'Observed symptoms:',
    'entries.observations': 'Observations:',
    
    // Reports
    'reports.title': 'Health Reports',
    'reports.subtitle': 'Detailed analysis for',
    'reports.weekly': 'Weekly',
    'reports.monthly': 'Monthly',
    'reports.downloadTxt': 'Download TXT',
    'reports.medicalReport': 'Medical Report',
    'reports.generating': 'Generating...',
    'reports.period': 'Period:',
    'reports.totalEntries': 'Total entries in database:',
    'reports.filteredEntries': 'Filtered for this period:',
    'reports.activeProfile': 'Active profile:',
    'reports.years': 'years old',
    'reports.daysRecorded': 'Days recorded',
    'reports.daysWithSeizures': 'Days with seizures',
    'reports.daysWithoutSeizures': 'Days without seizures',
    'reports.seizurePercentage': 'Days without seizures',
    'reports.emotionalState': 'Emotional State',
    'reports.mostFrequentSymptoms': 'Most Frequent Symptoms',
    'reports.noSymptomsInPeriod': 'No symptoms recorded in this period',
    'reports.periodEntries': 'Period Entries',
    'reports.entriesCount': 'entries',
    'reports.showingEntriesOf': 'Showing 10 of',
    'reports.entriesInPeriod': 'entries in period',
    'reports.noDataForPeriod': 'No data for this period',
    'reports.noDataDesc': 'No entries found for the selected period. Try another date or switch to monthly view.',
    'reports.tipChangeView': 'Tip: Switch to "Monthly" view to see more data, or select a more recent date.',
    'reports.reportGenerated': 'Medical report generated successfully',
    'reports.reportError': 'Error generating medical report',
    'reports.symptoms': 'symptoms',
    
    // Emotions
    'emotion.veryHappy': 'Very Happy',
    'emotion.happy': 'Happy',
    'emotion.neutral': 'Neutral',
    'emotion.sad': 'Sad',
    'emotion.angry': 'Angry',
    'emotion.scared': 'Scared',
    
    // Symptoms
    'symptom.headache': 'Headache',
    'symptom.fatigue': 'Fatigue',
    'symptom.crying': 'Crying',
    'symptom.irritability': 'Irritability',
    'symptom.confusion': 'Confusion',
    'symptom.nausea': 'Nausea',
    'symptom.dizziness': 'Dizziness',
    'symptom.sleepIssues': 'Sleep issues',
    'symptom.appetiteLoss': 'Loss of appetite',
    'symptom.memoryIssues': 'Memory issues',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your Neuri experience',
    'settings.language': 'Language',
    'settings.spanish': 'Español',
    'settings.english': 'English',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.subtitle': 'Manage your personal information',
    'profile.email': 'Email',
    'profile.emailNote': 'Email cannot be modified',
    'profile.name': 'Your name',
    'profile.childName': 'Child name',
    'profile.childAge': 'Child age',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.saving': 'Saving...',
    'profile.cancel': 'Cancel',
    'profile.logout': 'Sign Out',
    'profile.confirmLogout': 'Are you sure you want to sign out?',
    'profile.accountInfo': 'Account information',
    'profile.accountCreated': 'Account created',
    'profile.userId': 'User ID',
    'profile.updated': 'Profile updated successfully',
    'profile.error': 'Error updating profile',
    'profile.nameRequired': 'Name is required',
    'profile.childNameRequired': 'Child name is required',
    'profile.ageRequired': 'Age must be between 1 and 18 years',
    
    // Multi Profile
    'profiles.title': 'Children Profiles',
    'profiles.add': 'Add',
    'profiles.activeProfile': 'Active Profile',
    'profiles.years': 'years old',
    'profiles.addNew': 'Add New Profile',
    'profiles.childName': 'Child name',
    'profiles.age': 'Age',
    'profiles.activate': 'Activate',
    'profiles.delete': 'Delete profile',
    'profiles.switchingTo': 'Switching to',
    'profiles.noProfiles': 'No profiles configured',
    'profiles.addFirst': 'Add the first profile to get started',
    'profiles.keepOne': 'Must keep at least one profile',
    'profiles.confirmDelete': 'Are you sure you want to delete this profile? All associated data will be lost.',
    'profiles.ageRange': 'Age must be between 1 and 18 years',
    
    // Notifications
    'notifications.title': 'Notification Settings',
    'notifications.subtitle': 'Customize your reminders and alerts',
    'notifications.status': 'Permission status',
    'notifications.granted': 'Granted',
    'notifications.denied': 'Denied',
    'notifications.pending': 'Pending',
    'notifications.blocked': 'Notifications are blocked. You can enable them in your browser settings.',
    'notifications.enable': 'Enable',
    'notifications.disable': 'Disable',
    'notifications.enabled': 'Enabled',
    'notifications.disabled': 'Disabled',
    'notifications.dailyReminder': 'Daily Reminder',
    'notifications.reminderTime': 'Reminder time:',
    'notifications.reminderDesc': "We'll remind you to register your little one's day at this time every day.",
    'notifications.patternAlerts': 'Pattern Alerts',
    'notifications.patternDesc': 'Receive notifications when important patterns are detected',
    'notifications.seizureAlerts': 'Seizure Alerts',
    'notifications.seizureDesc': 'Receive important reminders when a seizure is registered',
    'notifications.test': 'Test Notification',
    'notifications.activated': '🎉 Notifications Activated!',
    'notifications.activatedDesc': "We'll remind you to register your little one's day every day.",
    'notifications.testTitle': '🧪 Test Notification',
    'notifications.testDesc': 'Notifications are working correctly.',
    
    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.none': 'None',
    'common.optional': 'optional',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('neuri-language');
    return (saved as Language) || 'es';
  });

  // Fixed: Memoize the setLanguage function to prevent unnecessary re-renders
  const setLanguage = useCallback((lang: Language) => {
    console.log('🌐 Language changing to:', lang);
    setLanguageState(lang);
    localStorage.setItem('neuri-language', lang);
    
    // Update document title
    document.title = translations[lang]['app.title'];
    console.log('🌐 Language changed successfully to:', lang);
  }, []);

  // Fixed: Simplified translation function with better error handling
  const t = useCallback((key: string): string => {
    const translation = translations[language];
    const result = translation[key];
    
    if (!result) {
      console.warn(`🌐 Missing translation for key: "${key}" in language: ${language}`);
      return key; // Return the key itself if translation is missing
    }
    
    return result;
  }, [language]);

  // Fixed: Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t]);

  useEffect(() => {
    // Set initial document title
    document.title = translations[language]['app.title'];
  }, [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};