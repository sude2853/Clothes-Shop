import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const AUTH_API = axios.create({
    baseURL: `${BASE_URL}/auth`,
});

const USER_API = axios.create({
    baseURL: `${BASE_URL}/user`,
});

const PRODUCT_API = axios.create({
    baseURL: `${BASE_URL}/products`,
});

const ORDER_API = axios.create({
    baseURL: `${BASE_URL}/orders`,
});

const AUTH_POST = async (path, data) => {
    try {
        const response = await AUTH_API.post(path, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const USER_GET = async (path, token) => {
    try {
        const response = await USER_API.get(path, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const USER_POST = async (path, token, data = {}) => {
    try {
        const response = await USER_API.post(path, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const USER_DELETE = async (path, token) => {
    try {
        const response = await USER_API.delete(path, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const PRODUCT_POST = async (path, token, data) => {
    try {
        const response = await PRODUCT_API.post(path, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const PRODUCT_GET = async (path) => {
    try {
        const response = await PRODUCT_API.get(path);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const PRODUCT_PUT = async (path, token, data) => {
    try {
        const response = await PRODUCT_API.put(path, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const PRODUCT_DELETE = async (path, token) => {
    try {
        const response = await PRODUCT_API.delete(path, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

const ORDER_POST = async (path, token, data) => {
    try {
        const response = await ORDER_API.post(path, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Bilinmeyen hata' };
    }
};

export {
    AUTH_POST,
    USER_GET,
    USER_DELETE,
    PRODUCT_POST,
    PRODUCT_GET,
    PRODUCT_PUT,
    PRODUCT_DELETE,
    USER_POST,
    ORDER_POST,
};
