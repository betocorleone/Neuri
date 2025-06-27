export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateString: string, locale?: string): string => {
  const date = new Date(dateString + 'T00:00:00'); // Ensure we're in local timezone
  
  // Use the provided locale or default to Spanish
  const currentLocale = locale || 'es-ES';
  
  return date.toLocaleDateString(currentLocale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timeString: string): string => {
  return timeString;
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

// Get today's date in YYYY-MM-DD format (local timezone)
export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current day name in the specified language
export const getTodayDisplayName = (locale?: string): string => {
  const today = new Date();
  const currentLocale = locale || 'es-ES';
  return today.toLocaleDateString(currentLocale, { weekday: 'long' });
};

// Helper function to get locale from language code
export const getLocaleFromLanguage = (language: 'es' | 'en'): string => {
  return language === 'es' ? 'es-ES' : 'en-US';
};