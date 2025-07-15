import { AUTH_POST } from './api';

const register = async (data) => {
    return await AUTH_POST('/register', data);
};

const verifyOtp = async (data) => {
    return await AUTH_POST('/verify-otp', data);
};

const login = async (data) => {
    return await AUTH_POST('/login', data);
};

export { register, verifyOtp, login };
