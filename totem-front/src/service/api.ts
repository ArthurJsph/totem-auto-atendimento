import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

export const api: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => response, 
    (error: AxiosError) => { 
        if (error.response && error.response.status === 401) {
            console.warn('Erro 401: Token expirado ou não autorizado. Redirecionando para login.');
            localStorage.removeItem('token');
            window.location.href = '/unauthorized'; 
        } else if (error.response && error.response.status === 403) {
            console.error('Erro 403: Acesso negado. Você não tem permissão para esta ação.');
        }
        return Promise.reject(error);
    }
);



