import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        const { access_token } = JSON.parse(user);
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
    }
    return config;
});

export default api;
