import api from './axios';

export const productApi = {
    getAll: (params?: any) => api.get('/products', { params }),
    getFilterMetadata: () => api.get('/products/filters/metadata'),
    getById: (id: number) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: number, data: any) => api.patch(`/products/${id}`, data),
    remove: (id: number) => api.delete(`/products/${id}`),
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/products/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

export const userApi = {
    signup: (data: any) => api.post('/users/signup', data),
    login: (data: any) => api.post('/auth/login', data),
    getAll: () => api.get('/users'),
    update: (id: number, data: any) => api.patch(`/users/${id}`, data),
    remove: (id: number) => api.delete(`/users/${id}`),
};

export const orderApi = {
    create: (data: any) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getByUser: (userId: number) => api.get(`/orders/user/${userId}`),
    getById: (id: number) => api.get(`/orders/${id}`),
    updateStatus: (id: number, status: string) => api.patch(`/orders/${id}/status`, { status }),
    updatePaymentStatus: (id: number, paymentStatus: string) => api.patch(`/orders/${id}/payment-status`, { paymentStatus }),
    confirm: (id: number) => api.post(`/orders/${id}/confirm`),
    syncStatus: (id: number) => api.post(`/orders/${id}/sync-status`),
};

export const notificationApi = {
    getUnread: () => api.get('/notifications/unread'),
    markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
};

export const cartApi = {
    getByUser: (userId: number) => api.get(`/carts/${userId}`),
    update: (userId: number, items: any[]) => api.post(`/carts/${userId}`, { items }),
};
