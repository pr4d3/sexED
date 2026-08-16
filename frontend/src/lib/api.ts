import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://sex-education-api.onrender.com/api/v1";

export const api = {
    getToken: (options?: any) => {
        return getCookie('access_token', options);
    },
    
    saveAuth: (token: string, refresh: string | null, user: any) => {
        setCookie('access_token', token, { maxAge: 60 * 60, path: '/' });
        setCookie('user_role', user.role, { maxAge: 60 * 60, path: '/' });
        if (refresh) {
            setCookie('refresh_token', refresh, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_info', JSON.stringify(user));
        }
    },
    
    clearAuth: () => {
        deleteCookie('access_token', { path: '/' });
        deleteCookie('user_role', { path: '/' });
        deleteCookie('refresh_token', { path: '/' });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user_info');
        }
    },
    
    getUserInfo: () => {
        if (typeof window === 'undefined') return null;
        const info = localStorage.getItem('user_info');
        return info ? JSON.parse(info) : null;
    },
    
    request: async (endpoint: string, options: any = {}) => {
        const cookieOpts = options.cookieOpts || {};
        const token = api.getToken(cookieOpts);
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const fetchOptions: any = {
            ...options,
            headers,
        };
        
        delete fetchOptions.cookieOpts;

        const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
        
        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }
        
        if (!response.ok) {
            if (response.status === 401 && typeof window !== 'undefined' && endpoint !== '/auth/login') {
                api.clearAuth();
                window.location.href = '/login';
            }
            throw new Error(data.detail || data.message || 'Có lỗi xảy ra');
        }
        
        return data;
    },
    
    get: (endpoint: string, options: any = {}) => api.request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body: any, options: any = {}) => api.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint: string, body: any, options: any = {}) => api.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint: string, options: any = {}) => api.request(endpoint, { ...options, method: 'DELETE' }),
};
