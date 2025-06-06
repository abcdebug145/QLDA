import axiosInstance from './axiosConfig';

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/users/register', userData);
        return response.data;
    } catch (error) {
        // Return a more descriptive error if possible
        throw error.response?.data || error.message || error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/users/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};

export const getMe = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axiosInstance.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || error;
    }
};