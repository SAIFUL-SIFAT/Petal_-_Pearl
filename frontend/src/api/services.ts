import api from './axios';

export const productApi = {
    getAll: (type?: string) => api.get('/products', { params: { type } }),
    getById: (id: number) => api.get(`/products/${id}`),
};

export const userApi = {
    signup: (userData: any) => api.post('/users/signup', userData),
    login: (credentials: any) => api.post('/users/login', credentials), // Placeholder
};
