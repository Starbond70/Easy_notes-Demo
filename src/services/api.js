const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Notes endpoints
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/notes?${queryString}` : '/notes';
    return this.request(endpoint);
  }

  async getNoteById(noteId) {
    return this.request(`/notes/${noteId}`);
  }

  async uploadNote(noteData, file) {
    const formData = new FormData();
    
    // Add file
    formData.append('file', file);
    
    // Add other note data
    Object.keys(noteData).forEach(key => {
      if (key === 'tags' && Array.isArray(noteData[key])) {
        formData.append('tags', JSON.stringify(noteData[key]));
      } else {
        formData.append(key, noteData[key]);
      }
    });

    const url = `${this.baseURL}/notes/upload`;
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  async downloadNote(noteId) {
    return this.request(`/notes/${noteId}/download`, {
      method: 'POST',
    });
  }

  async rateNote(noteId, rating) {
    return this.request(`/notes/${noteId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  async addComment(noteId, comment) {
    return this.request(`/notes/${noteId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async deleteNote(noteId) {
    return this.request(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async getUserNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users/notes?${queryString}` : '/users/notes';
    return this.request(endpoint);
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async searchUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users/search?${queryString}` : '/users/search';
    return this.request(endpoint);
  }

  async deleteAccount() {
    return this.request('/users/account', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
