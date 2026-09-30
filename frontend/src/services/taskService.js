import api from './api';

const taskService = {
  // Fetch tasks with optional filters (search, status, priority, sortBy, sortOrder)
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    const response = await api.get(endpoint);
    return response.data;
  },

  // Fetch dashboard statistics
  async getTaskStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  // Fetch single task by ID
  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update existing task
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task by ID
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
