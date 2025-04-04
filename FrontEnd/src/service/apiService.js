import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const request = async (url, method = 'GET', data = null, token = null, responseType = 'json') => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { 
    method, 
    url: `${BASE_URL}${url}`, 
    headers,
    responseType  // Añadimos el parámetro responseType
  };
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

// Función para obtener todos los usuarios
const getAllUsers = async (token = null) => {
  return request('/api/usuarios', 'GET', null, token);
};

// Función para eliminar un usuario
const deleteUser = async (id, token = null) => {
  return request(`/api/usuarios/${id}`, 'DELETE', null, token);
};

// Función para eliminar una competencia
const deleteCompetencia = async (id, token = null) => {
  return request(`/api/competencias/${id}`, 'DELETE', null, token);
};

// Función para actualizar una competencia
const updateCompetencia = async (id, data, token = null) => {
  return request(`/api/competencias/${id}`, 'PUT', data, token);
};

const createInscripcion = async (data, token = null) => {
  return request('/api/inscripciones', 'POST', data, token);
};

const getPruebasByCompetencia = async (competenciaId, token = null) => {
  return request(`/api/pruebas/competencia/${competenciaId}`, 'GET', null, token);
};

const getInscripcionesByAtleta = async (atletaId, token = null) => {
  return request(`/api/inscripciones/atleta/${atletaId}`, 'GET', null, token);
};

const getByIdCompet = async (id, token = null) => {
  return request(`/api/competencias/${id}`, 'GET', null, token);
};

const getInscripcionesByCompetencia = async (competenciaId, token = null) => {
  return request(`/api/inscripciones/competencia/${competenciaId}`, 'GET', null, token);
};

const createResultado = async (competenciaId, data, token = null) => {
  return request(`/api/competencias/${competenciaId}/resultados`, 'POST', data, token);
};

const getResultadosByCompetencia = async (competenciaId, token = null) => {
  return request(`/api/competencias/${competenciaId}/resultados`, 'GET', null, token);
};

const getResultadosByPrueba = async (competenciaId, pruebaId, token = null) => {
  return request(`/api/competencias/${competenciaId}/pruebas/${pruebaId}/resultados`, 'GET', null, token);
};

const updateResultado = async (id, data, token = null) => {
  return request(`/api/resultados/${id}`, 'PUT', data, token);
};

const deleteResultado = async (id, token = null) => {
  return request(`/api/resultados/${id}`, 'DELETE', null, token);
};

// Funciones de exportación
const exportToExcel = async (competenciaId, token = null) => {
  return request(
    `/api/competencias/${competenciaId}/export/excel`, 
    'GET', 
    null, 
    token, 
    'arraybuffer'  // Especificar arraybuffer para Excel
  );
};

const exportToPDF = async (competenciaId, token = null) => {
  return request(
    `/api/competencias/${competenciaId}/export/pdf`, 
    'GET', 
    null, 
    token, 
    'blob'  // Especificar blob para PDF
  );
};

const getAllCompetencias = async (token = null) => {
  return request('/api/competencias', 'GET', null, token);
};

export const api = {
  auth: {
    register: (data) => request('/auth/register', 'POST', data),
    login: (data) => request('/auth/login', 'POST', data),
  },
  user: {
    getProfile: (id, token) => getUserProfile(id, token),
    updateProfile: (id, data, token) => updateUserProfile(id, data, token),
    getAllUsers,
    deleteUser,
  },
  competencia: {
    deleteCompetencia,
    updateCompetencia,
    getByIdCompet,
    getAll: getAllCompetencias,
    inscribirAtleta: (competenciaId, atletaId, token) => 
      request(`/api/competencias/${competenciaId}/atletas`, 'POST', { atletaId }, token),
  },
  inscripcion: {
    create: createInscripcion,
    getByAtleta: getInscripcionesByAtleta,
    getByCompetencia: getInscripcionesByCompetencia,
  },
  prueba: {
    getByCompetencia: getPruebasByCompetencia,
  },
  resultado: {
    create: createResultado,
    getByCompetencia: getResultadosByCompetencia,
    getByPrueba: getResultadosByPrueba,
    update: updateResultado,
    delete: deleteResultado,
  },
  export: {
    excel: exportToExcel,
    pdf: exportToPDF,
  },
};