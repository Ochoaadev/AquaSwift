// apiService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const request = async (url, method = 'GET', data = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, url: `${BASE_URL}${url}`, headers };
  if (data) options.data = data;

  const response = await axios(options);
  return response.data;
};

// Función para obtener el perfil del usuario
const getUserProfile = async (id, token = null) => {
  return request(`/api/usuarios/${id}`, 'GET', null, token);
};

// Función para actualizar el perfil del usuario
const updateUserProfile = async (id, data, token = null) => {
  return request(`/api/usuarios/${id}`, 'PUT', data, token); 
};

export const api = {
  auth: {
    register: (data) => request('/auth/register', 'POST', data),
    login: (data) => request('/auth/login', 'POST', data),
  },
  user: {
    getProfile: (id, token) => getUserProfile(id, token),
    updateProfile: (id, data, token) => updateUserProfile(id, data, token), 
  },
};

