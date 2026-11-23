/**
 * Supabase & Backend API Service Configuration
 * AIESEC in University of Moratuwa · Term 27.28
 * Functions: oGV B2C Marketing & Campaign Deliverables Portal
 */

export const BACKEND_CONFIG = {
  apiUrl: import.meta.env?.VITE_API_URL || '',
  supabaseUrl: import.meta.env?.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || ''
};

class SupabaseService {
  constructor() {
    this.apiUrl = BACKEND_CONFIG.apiUrl;
    this.isSupabaseConfigured = !!(
      BACKEND_CONFIG.supabaseUrl &&
      !BACKEND_CONFIG.supabaseUrl.includes('placeholder') &&
      !BACKEND_CONFIG.supabaseUrl.includes('ogv-mora-2728.supabase.co')
    );
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.apiUrl}/api/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Backend not running
    }
    return { status: 'offline', database: 'local_storage', supabaseConfigured: this.isSupabaseConfigured };
  }

  async getFlyers() {
    try {
      const res = await fetch(`${this.apiUrl}/api/flyers`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[SupabaseService] Remote fetch failed, falling back to local storage:', e.message);
    }
    return null;
  }

  async createFlyer(deliverableData) {
    try {
      const res = await fetch(`${this.apiUrl}/api/flyers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliverableData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[SupabaseService] Remote flyer creation failed:', e.message);
    }
    return null;
  }

  async updateFlyerColumn(flyerId, targetColumn, { userRole, userId, userName, commentText } = {}) {
    try {
      const res = await fetch(`${this.apiUrl}/api/flyers/${flyerId}/column`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetColumn, userRole, userId, userName, commentText })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[SupabaseService] Remote column update failed:', e.message);
    }
    return null;
  }

  async addComment(flyerId, { authorName, authorRole, authorId, text }) {
    try {
      const res = await fetch(`${this.apiUrl}/api/flyers/${flyerId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, authorRole, authorId, text })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[SupabaseService] Remote comment failed:', e.message);
    }
    return null;
  }

  async getUsers() {
    try {
      const res = await fetch(`${this.apiUrl}/api/users`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[SupabaseService] Remote users fetch failed:', e.message);
    }
    return null;
  }

  async seedRemoteDatabase() {
    try {
      const res = await fetch(`${this.apiUrl}/api/seed`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  }
}

export const supabaseService = new SupabaseService();
