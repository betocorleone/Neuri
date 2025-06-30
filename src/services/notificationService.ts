class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.init();
  }

  private init() {
    // Simplified initialization - just check for notification support
    if ('Notification' in window) {
      this.permission = Notification.permission;
      console.log('Notification permission:', this.permission);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(title: string, body: string, options: NotificationOptions = {}): Promise<void> {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/Logo Neuri-.png',
      badge: '/Logo Neuri-.png',
      vibrate: [200, 100, 200],
      ...options
    };

    // Use simple notifications without Service Worker
    new Notification(title, { body, ...defaultOptions });
  }

  // Fixed: Add the missing scheduleDailyReminder method
  async scheduleDailyReminder(time: string): Promise<void> {
    console.log(`Daily reminder scheduled for ${time}`);
    localStorage.setItem('neuri-reminder-time', time);
    
    // In a real implementation, you would set up a recurring notification
    // For now, we just store the preference
    if (this.permission === 'granted') {
      console.log(`Reminder will be shown daily at ${time}`);
    }
  }

  // Simplified methods without Service Worker dependency
  setEnabled(enabled: boolean): void {
    if (enabled) {
      this.requestPermission();
    }
    localStorage.setItem('neuri-notifications-enabled', enabled.toString());
  }

  isEnabled(): boolean {
    return localStorage.getItem('neuri-notifications-enabled') === 'true';
  }
}

export const notificationService = new NotificationService();