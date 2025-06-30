// Simple local storage service to replace API calls
export interface User {
  id: string;
  email: string;
  name: string;
  childName: string;
  childAge: number;
  createdAt: Date;
}

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
  profileId?: string; // Add profile ID to entries
}

class LocalStorageService {
  private currentUser: User | null = null;

  // Auth methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Demo account
    if (email === 'demo@neuri.com' && password === 'demo123') {
      const user: User = {
        id: 'demo-user',
        email: 'demo@neuri.com',
        name: 'Usuario Demo',
        childName: 'Sofía',
        childAge: 8,
        createdAt: new Date('2024-01-01')
      };
      
      this.currentUser = user;
      localStorage.setItem('neuri-current-user', JSON.stringify(user));
      localStorage.setItem('neuri-token', 'demo-token');
      
      // Always ensure demo data exists and is complete
      this.ensureDemoDataExists();
      
      // Set default active profile
      if (!localStorage.getItem('neuri-active-profile')) {
        localStorage.setItem('neuri-active-profile', 'default');
      }
      
      return { user, token: 'demo-token' };
    }

    // Check existing users
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Simple password check (in real app, this would be hashed)
    const storedPassword = localStorage.getItem(`neuri-password-${user.id}`);
    if (storedPassword !== password) {
      throw new Error('Contraseña incorrecta');
    }

    this.currentUser = user;
    localStorage.setItem('neuri-current-user', JSON.stringify(user));
    localStorage.setItem('neuri-token', `token-${user.id}`);
    
    return { user, token: `token-${user.id}` };
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    childName: string;
    childAge: number;
  }): Promise<{ user: User; token: string }> {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Este email ya está registrado');
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      childName: userData.childName,
      childAge: userData.childAge,
      createdAt: new Date()
    };

    // Save user
    users.push(user);
    localStorage.setItem('neuri-users', JSON.stringify(users));
    localStorage.setItem(`neuri-password-${user.id}`, userData.password);
    
    this.currentUser = user;
    localStorage.setItem('neuri-current-user', JSON.stringify(user));
    localStorage.setItem('neuri-token', `token-${user.id}`);
    
    return { user, token: `token-${user.id}` };
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('neuri-current-user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  async updateProfile(userData: Partial<User>): Promise<{ user: User }> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
    
    const updatedUser = { ...this.currentUser, ...userData };
    
    // Update in users list
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
      localStorage.setItem('neuri-users', JSON.stringify(users));
    }
    
    this.currentUser = updatedUser;
    localStorage.setItem('neuri-current-user', JSON.stringify(updatedUser));
    
    return { user: updatedUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('neuri-current-user');
    localStorage.removeItem('neuri-token');
    localStorage.removeItem('neuri-active-profile');
  }

  // Profile-specific diary methods
  async getEntriesForProfile(profileId: string): Promise<{ entries: DailyEntry[] }> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
    
    // For demo user, ensure data exists before returning
    if (this.currentUser.id === 'demo-user') {
      this.ensureDemoDataExists();
    }
    
    const entries = this.getUserEntriesForProfile(this.currentUser.id, profileId);
    console.log(`📊 Retrieved ${entries.length} entries for profile ${profileId}`);
    return { entries };
  }

  async createEntryForProfile(entryData: {
    date: string;
    hadSeizure: boolean;
    seizureTime?: string;
    symptoms: string[];
    emotion: string;
    observations: string;
  }, profileId: string): Promise<{ entry: DailyEntry }> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
    
    const entry: DailyEntry = {
      id: `entry-${Date.now()}`,
      ...entryData,
      userId: this.currentUser.id,
      profileId,
      createdAt: new Date()
    };

    const entries = this.getUserEntriesForProfile(this.currentUser.id, profileId);
    entries.push(entry);
    localStorage.setItem(`neuri-entries-${this.currentUser.id}-${profileId}`, JSON.stringify(entries));
    
    return { entry };
  }

  async updateEntryForProfile(id: string, entryData: Partial<DailyEntry>, profileId: string): Promise<{ entry: DailyEntry }> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
    
    const entries = this.getUserEntriesForProfile(this.currentUser.id, profileId);
    const entryIndex = entries.findIndex(e => e.id === id);
    
    if (entryIndex === -1) throw new Error('Entrada no encontrada');
    
    const updatedEntry = { ...entries[entryIndex], ...entryData };
    entries[entryIndex] = updatedEntry;
    
    localStorage.setItem(`neuri-entries-${this.currentUser.id}-${profileId}`, JSON.stringify(entries));
    
    return { entry: updatedEntry };
  }

  async deleteEntryForProfile(id: string, profileId: string): Promise<void> {
    if (!this.currentUser) throw new Error('No hay usuario logueado');
    
    const entries = this.getUserEntriesForProfile(this.currentUser.id, profileId);
    const filteredEntries = entries.filter(e => e.id !== id);
    
    localStorage.setItem(`neuri-entries-${this.currentUser.id}-${profileId}`, JSON.stringify(filteredEntries));
  }

  // Legacy methods for backward compatibility
  async getEntries(): Promise<{ entries: DailyEntry[] }> {
    const profileId = localStorage.getItem('neuri-active-profile') || 'default';
    return this.getEntriesForProfile(profileId);
  }

  async createEntry(entryData: {
    date: string;
    hadSeizure: boolean;
    seizureTime?: string;
    symptoms: string[];
    emotion: string;
    observations: string;
  }): Promise<{ entry: DailyEntry }> {
    const profileId = localStorage.getItem('neuri-active-profile') || 'default';
    return this.createEntryForProfile(entryData, profileId);
  }

  async updateEntry(id: string, entryData: Partial<DailyEntry>): Promise<{ entry: DailyEntry }> {
    const profileId = localStorage.getItem('neuri-active-profile') || 'default';
    return this.updateEntryForProfile(id, entryData, profileId);
  }

  async deleteEntry(id: string): Promise<void> {
    const profileId = localStorage.getItem('neuri-active-profile') || 'default';
    return this.deleteEntryForProfile(id, profileId);
  }

  // Helper methods
  private getUsers(): User[] {
    const stored = localStorage.getItem('neuri-users');
    return stored ? JSON.parse(stored) : [];
  }

  private getUserEntriesForProfile(userId: string, profileId: string): DailyEntry[] {
    const stored = localStorage.getItem(`neuri-entries-${userId}-${profileId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Get current date in YYYY-MM-DD format
  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get date N days ago
  private getDateDaysAgo(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Ensure demo data exists (called on demo login and when accessing demo data)
  private ensureDemoDataExists() {
    const defaultProfileKey = 'neuri-entries-demo-user-default';
    const secondProfileKey = 'neuri-entries-demo-user-profile-second';
    const profilesKey = 'neuri-profiles-demo-user';
    
    // Check if demo data exists
    const defaultEntries = localStorage.getItem(defaultProfileKey);
    const secondEntries = localStorage.getItem(secondProfileKey);
    const profiles = localStorage.getItem(profilesKey);
    
    // If any demo data is missing, recreate all of it
    if (!defaultEntries || !secondEntries || !profiles) {
      console.log('🔄 Creating/restoring demo data...');
      this.createDemoData();
    } else {
      // Verify data integrity
      const defaultData = JSON.parse(defaultEntries);
      const secondData = JSON.parse(secondEntries);
      
      if (defaultData.length < 60 || secondData.length < 20) {
        console.log('🔄 Demo data incomplete, recreating...');
        this.createDemoData();
      } else {
        console.log(`✅ Demo data verified: ${defaultData.length} entries for Sofía, ${secondData.length} entries for Diego`);
      }
    }
  }

  // Create comprehensive demo data
  private createDemoData() {
    // Create comprehensive demo entries spanning the last 60 days for default profile (Sofía)
    const demoEntries: DailyEntry[] = [];
    
    // Generate entries for the last 60 days with realistic patterns
    for (let i = 0; i < 60; i++) {
      const date = this.getDateDaysAgo(i);
      const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
      
      // Seizure pattern: roughly every 7-10 days, more likely on stressful days (Mondays, Fridays)
      const seizureRisk = i % 8 === 0 || i % 11 === 0 || (dayOfWeek === 1 && Math.random() < 0.3) || (dayOfWeek === 5 && Math.random() < 0.2);
      const hadSeizure = seizureRisk && Math.random() < 0.7;
      
      // Emotion patterns: generally happier on weekends, more stressed on school days
      let emotion = 'neutral';
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        emotion = Math.random() < 0.6 ? 'happy' : Math.random() < 0.3 ? 'very-happy' : 'neutral';
      } else if (hadSeizure) {
        emotion = Math.random() < 0.5 ? 'sad' : Math.random() < 0.3 ? 'scared' : 'angry';
      } else if (dayOfWeek === 1) { // Monday blues
        emotion = Math.random() < 0.4 ? 'sad' : Math.random() < 0.3 ? 'angry' : 'neutral';
      } else {
        const rand = Math.random();
        if (rand < 0.3) emotion = 'happy';
        else if (rand < 0.5) emotion = 'very-happy';
        else if (rand < 0.7) emotion = 'neutral';
        else if (rand < 0.85) emotion = 'sad';
        else if (rand < 0.95) emotion = 'angry';
        else emotion = 'scared';
      }
      
      // Symptoms: more likely after seizures or on stressful days
      const symptoms: string[] = [];
      if (hadSeizure) {
        symptoms.push('confusion', 'fatigue');
        if (Math.random() < 0.7) symptoms.push('headache');
        if (Math.random() < 0.5) symptoms.push('nausea');
        if (Math.random() < 0.4) symptoms.push('dizziness');
        if (Math.random() < 0.3) symptoms.push('memory-issues');
      } else {
        if (Math.random() < 0.2) symptoms.push('headache');
        if (Math.random() < 0.15) symptoms.push('fatigue');
        if (Math.random() < 0.1) symptoms.push('irritability');
        if (emotion === 'sad' && Math.random() < 0.4) symptoms.push('crying');
        if (dayOfWeek === 1 && Math.random() < 0.2) symptoms.push('sleep-issues');
        if (Math.random() < 0.05) symptoms.push('appetite-loss');
      }
      
      // Seizure times: more common in afternoon/evening
      let seizureTime = '';
      if (hadSeizure) {
        const hour = Math.random() < 0.3 ? 
          8 + Math.floor(Math.random() * 4) : // Morning 8-11
          Math.random() < 0.5 ? 
            12 + Math.floor(Math.random() * 6) : // Afternoon 12-17
            18 + Math.floor(Math.random() * 4); // Evening 18-21
        const minute = Math.floor(Math.random() * 60);
        seizureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      }
      
      // Observations based on the day's events
      const observations = this.generateObservation(i, dayOfWeek, hadSeizure, emotion, symptoms, 'Sofía');
      
      demoEntries.push({
        id: `entry-sofia-${i}`,
        date,
        hadSeizure,
        seizureTime: hadSeizure ? seizureTime : undefined,
        symptoms,
        emotion,
        observations,
        userId: 'demo-user',
        profileId: 'default',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      });
    }
    
    // Create entries for Diego (second profile) - 20 days with different patterns
    const secondProfileEntries: DailyEntry[] = [];
    for (let i = 0; i < 20; i++) {
      const date = this.getDateDaysAgo(i);
      const dayOfWeek = new Date(date).getDay();
      
      // Diego has fewer seizures and different patterns
      const hadSeizure = i % 15 === 0; // Less frequent seizures
      
      // Diego is generally happier and younger
      let emotion = 'happy';
      if (hadSeizure) {
        emotion = Math.random() < 0.6 ? 'scared' : 'sad';
      } else if (dayOfWeek === 0 || dayOfWeek === 6) {
        emotion = Math.random() < 0.7 ? 'very-happy' : 'happy';
      } else {
        const rand = Math.random();
        if (rand < 0.5) emotion = 'happy';
        else if (rand < 0.7) emotion = 'very-happy';
        else if (rand < 0.85) emotion = 'neutral';
        else emotion = 'sad';
      }
      
      // Fewer symptoms for Diego
      const symptoms: string[] = [];
      if (hadSeizure) {
        symptoms.push('confusion');
        if (Math.random() < 0.5) symptoms.push('fatigue');
      } else {
        if (Math.random() < 0.1) symptoms.push('fatigue');
        if (emotion === 'sad' && Math.random() < 0.3) symptoms.push('crying');
      }
      
      const observations = this.generateObservation(i, dayOfWeek, hadSeizure, emotion, symptoms, 'Diego');
      
      secondProfileEntries.push({
        id: `entry-diego-${i}`,
        date,
        hadSeizure,
        seizureTime: hadSeizure ? '15:30' : undefined,
        symptoms,
        emotion,
        observations,
        userId: 'demo-user',
        profileId: 'profile-second',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      });
    }
    
    // Save all demo data
    localStorage.setItem('neuri-entries-demo-user-default', JSON.stringify(demoEntries));
    localStorage.setItem('neuri-entries-demo-user-profile-second', JSON.stringify(secondProfileEntries));
    
    // Set up demo profiles
    const demoProfiles = [
      { id: 'default', name: 'Sofía', age: 8, isActive: true },
      { id: 'profile-second', name: 'Diego', age: 6, isActive: false }
    ];
    localStorage.setItem('neuri-profiles-demo-user', JSON.stringify(demoProfiles));
    
    // Ensure default profile is active
    if (!localStorage.getItem('neuri-active-profile')) {
      localStorage.setItem('neuri-active-profile', 'default');
    }
    
    console.log(`✅ Demo data created: ${demoEntries.length} entries for Sofía, ${secondProfileEntries.length} entries for Diego`);
  }

  // Initialize demo data with comprehensive entries spanning 60 days
  initializeDemoData() {
    const users = this.getUsers();
    if (users.length === 0) {
      console.log('🚀 Initializing demo data for first time...');
      
      // Create demo user
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@neuri.com',
        name: 'Usuario Demo',
        childName: 'Sofía',
        childAge: 8,
        createdAt: new Date('2024-01-01')
      };
      
      localStorage.setItem('neuri-users', JSON.stringify([demoUser]));
      localStorage.setItem('neuri-password-demo-user', 'demo123');
      
      // Create the initial demo data
      this.createDemoData();
    } else {
      console.log('📊 Demo user already exists');
      // Still ensure demo data exists and is complete
      if (this.currentUser?.id === 'demo-user') {
        this.ensureDemoDataExists();
      }
    }
  }

  private generateObservation(daysAgo: number, dayOfWeek: number, hadSeizure: boolean, emotion: string, symptoms: string[], childName: string): string {
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    
    if (hadSeizure) {
      const seizureObservations = [
        `${childName} tuvo una convulsión durante la ${daysAgo < 7 ? 'tarde' : 'mañana'}. Duró aproximadamente ${2 + Math.floor(Math.random() * 3)} minutos. Se sintió ${emotion === 'scared' ? 'muy asustada' : emotion === 'sad' ? 'triste' : 'confundida'} después.`,
        `Convulsión ${dayOfWeek === 1 ? 'en el colegio' : dayOfWeek === 6 || dayOfWeek === 0 ? 'en casa' : 'durante las actividades diarias'}. ${symptoms.includes('confusion') ? 'Mucha confusión posterior.' : 'Recuperación gradual.'} ${symptoms.includes('nausea') ? 'Sintió náuseas después.' : ''}`,
        `Episodio convulsivo ${dayOfWeek < 5 ? 'durante el día escolar' : 'en fin de semana'}. ${symptoms.includes('memory-issues') ? 'Problemas para recordar lo que pasó antes.' : 'Memoria clara del evento.'} ${emotion === 'scared' ? 'Muy asustada por lo ocurrido.' : ''}`,
        `Convulsión ${Math.random() < 0.5 ? 'mientras jugaba' : 'durante el descanso'}. ${symptoms.includes('headache') ? 'Dolor de cabeza persistente después.' : 'Sin dolor posterior.'} ${symptoms.includes('fatigue') ? 'Muy cansada el resto del día.' : ''}`
      ];
      return seizureObservations[Math.floor(Math.random() * seizureObservations.length)];
    }

    // Non-seizure observations based on emotion and day
    const happyObservations = [
      `Excelente día ${dayOfWeek === 0 || dayOfWeek === 6 ? 'en familia' : 'en el colegio'} para ${childName}. Muy activa y ${dayOfWeek === 6 ? 'jugando en el parque' : dayOfWeek === 0 ? 'disfrutando en casa' : 'participando en clase'}.`,
      `Día fantástico ${dayOfWeek < 5 ? 'aprendiendo cosas nuevas' : 'divirtiéndose'}. ${dayOfWeek === 5 ? 'Emocionada por el fin de semana.' : dayOfWeek === 6 ? 'Día de aventuras.' : 'Muy contenta y sonriente.'}`,
      `Jornada maravillosa ${dayOfWeek === 1 ? 'empezando la semana' : dayOfWeek === 5 ? 'terminando la semana escolar' : 'disfrutando el día'}. ${Math.random() < 0.5 ? 'Hizo nuevos amigos.' : 'Jugó mucho y se divirtió.'}`,
      `Día increíble ${dayOfWeek < 5 ? 'en el colegio' : 'en casa'}. ${dayOfWeek === 0 ? 'Día familiar perfecto.' : dayOfWeek === 6 ? 'Aventuras y diversión.' : 'Muy participativa y alegre.'}`
    ];

    const neutralObservations = [
      `Día ${dayOfWeek === 1 ? 'tranquilo empezando la semana' : dayOfWeek === 5 ? 'normal terminando las clases' : 'regular sin eventos especiales'} para ${childName}. ${symptoms.includes('fatigue') ? 'Un poco cansada.' : symptoms.includes('headache') ? 'Leve dolor de cabeza.' : 'Estado general bueno.'}`,
      `Jornada ${dayOfWeek < 5 ? 'escolar' : 'de descanso'} sin complicaciones. ${symptoms.includes('sleep-issues') ? 'Algunas dificultades para dormir.' : symptoms.includes('appetite-loss') ? 'Poco apetito en el almuerzo.' : 'Todo dentro de lo normal.'}`,
      `Día ${dayOfWeek === 0 || dayOfWeek === 6 ? 'de fin de semana' : 'de semana'} estándar. ${Math.random() < 0.3 ? 'Actividades rutinarias.' : Math.random() < 0.5 ? 'Tiempo en familia.' : 'Día sin eventos destacables.'}`,
      `${dayNames[dayOfWeek]} típico para ${childName}. ${symptoms.length > 0 ? 'Algunos síntomas menores.' : 'Sin síntomas preocupantes.'} ${dayOfWeek < 5 ? 'Cumplió con sus tareas escolares.' : 'Tiempo de relajación.'}`
    ];

    const sadObservations = [
      `Día ${dayOfWeek === 1 ? 'difícil empezando la semana' : 'complicado emocionalmente'} para ${childName}. ${symptoms.includes('crying') ? 'Lloró varias veces sin razón aparente.' : 'Se sintió triste la mayor parte del día.'} ${dayOfWeek < 5 ? 'Le costó concentrarse en el colegio.' : 'Necesitó mucho apoyo emocional.'}`,
      `Jornada ${dayOfWeek < 5 ? 'escolar' : 'en casa'} difícil. ${symptoms.includes('irritability') ? 'Muy irritable y sensible.' : 'Estado de ánimo bajo.'} ${Math.random() < 0.5 ? 'Extrañaba a su abuela.' : 'Se sintió incomprendida.'}`,
      `${dayNames[dayOfWeek]} melancólico. ${symptoms.includes('crying') ? 'Episodios de llanto.' : 'Muy callada y pensativa.'} ${dayOfWeek === 0 || dayOfWeek === 6 ? 'Necesitó mucho tiempo en familia.' : 'Los maestros notaron su tristeza.'}`,
      `Día emocionalmente desafiante para ${childName}. ${symptoms.includes('fatigue') ? 'Cansancio emocional evidente.' : 'Baja energía general.'} ${dayOfWeek < 5 ? 'Dificultades en las actividades escolares.' : 'Prefirió estar sola.'}`
    ];

    const angryObservations = [
      `Día ${dayOfWeek === 1 ? 'frustrante empezando la semana' : 'con muchas rabietas'} para ${childName}. ${symptoms.includes('irritability') ? 'Extremadamente irritable.' : 'Varios episodios de enojo.'} ${dayOfWeek < 5 ? 'Problemas de comportamiento en el colegio.' : 'Conflictos familiares menores.'}`,
      `Jornada ${dayOfWeek < 5 ? 'escolar' : 'en casa'} tensa. ${symptoms.includes('headache') ? 'Dolor de cabeza por la tensión.' : 'Mucha frustración acumulada.'} ${Math.random() < 0.5 ? 'No quería hacer las tareas.' : 'Discutió con sus hermanos.'}`,
      `${dayNames[dayOfWeek]} complicado por su mal humor. ${symptoms.includes('irritability') ? 'Irritabilidad constante.' : 'Explosiones de ira.'} ${dayOfWeek < 5 ? 'Los maestros tuvieron que intervenir.' : 'Necesitó tiempo para calmarse.'}`,
      `Día desafiante con problemas de conducta para ${childName}. ${symptoms.includes('sleep-issues') ? 'Mala noche anterior afectó su humor.' : 'Frustración por límites establecidos.'} ${dayOfWeek === 5 ? 'Cansancio de la semana escolar.' : 'Necesitó estrategias de calma.'}`
    ];

    const scaredObservations = [
      `Día ${dayOfWeek < 5 ? 'escolar' : 'en casa'} con mucha ansiedad para ${childName}. ${Math.random() < 0.5 ? 'Pesadillas la noche anterior.' : 'Miedos inexplicables.'} ${symptoms.includes('sleep-issues') ? 'Dificultades para dormir.' : 'Necesitó mucha tranquilización.'}`,
      `Jornada ${dayOfWeek === 1 ? 'comenzando la semana con temores' : 'llena de preocupaciones'}. ${Math.random() < 0.3 ? 'Miedo a tener una convulsión.' : Math.random() < 0.5 ? 'Ansiedad por actividades nuevas.' : 'Inseguridad general.'} ${dayOfWeek < 5 ? 'Los maestros la consolaron.' : 'Familia muy comprensiva.'}`,
      `${dayNames[dayOfWeek]} con episodios de miedo. ${symptoms.includes('nausea') ? 'Náuseas por la ansiedad.' : 'Síntomas físicos del estrés.'} ${dayOfWeek === 0 || dayOfWeek === 6 ? 'Tiempo extra de cuidados familiares.' : 'Apoyo adicional en el colegio.'}`,
      `Día emocionalmente intenso por sus temores. ${Math.random() < 0.4 ? 'Miedo a estar sola.' : 'Preocupación por su salud.'} ${symptoms.includes('fatigue') ? 'El estrés la agotó.' : 'Necesitó mucha contención emocional.'}`
    ];

    switch (emotion) {
      case 'very-happy':
      case 'happy':
        return happyObservations[Math.floor(Math.random() * happyObservations.length)];
      case 'sad':
        return sadObservations[Math.floor(Math.random() * sadObservations.length)];
      case 'angry':
        return angryObservations[Math.floor(Math.random() * angryObservations.length)];
      case 'scared':
        return scaredObservations[Math.floor(Math.random() * scaredObservations.length)];
      default:
        return neutralObservations[Math.floor(Math.random() * neutralObservations.length)];
    }
  }
}

export const localStorageService = new LocalStorageService();