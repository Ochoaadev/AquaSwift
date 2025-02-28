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

export const api = {
    auth: {
        register: (data) => request('/auth/register', 'POST', data),
        login: (data) => request('/auth/login', 'POST', data),
    },
};
