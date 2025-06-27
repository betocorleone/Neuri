// Simplified API service without complex error handling
class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('neuri-token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('neuri-token', data.token);
    }

    return data;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    childName: string;
    childAge: number;
  }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('neuri-token', data.token);
    }

    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(userData: {
    name?: string;
    childName?: string;
    childAge?: number;
  }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('neuri-token');
  }

  // Diary methods
  async getEntries() {
    return this.request('/diary/entries');
  }

  async getEntryByDate(date: string) {
    return this.request(`/diary/entries/${date}`);
  }

  async createEntry(entryData: {
    date: string;
    hadSeizure: boolean;
    seizureTime?: string;
    symptoms: string[];
    emotion: string;
    observations: string;
  }) {
    return this.request('/diary/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async updateEntry(id: string, entryData: any) {
    return this.request(`/diary/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteEntry(id: string) {
    return this.request(`/diary/entries/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();