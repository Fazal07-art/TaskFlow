import api from './api';

const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Fetch current user details
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile details and password
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
};

export default authService;
