import { USER_DELETE, USER_GET, USER_POST } from './api';

const getUser = async (token) => {
    return await USER_GET('/account', token);
};

const getMe = async (token) => {
    return await USER_GET('/me', token);
};

const deleteAccount = async (token) => {
    return await USER_DELETE('/delete-account', token);
};

const getFavorites = async (token) => {
    return await USER_GET('/favorites', token);
};

const addToFavorites = async (token, id) => {
    return await USER_POST(`/favorites/${id}`, token);
};

const removeFromFavorites = async (token, id) => {
    return await USER_DELETE(`/favorites/${id}`, token);
};

const getCart = async (token) => {
    return await USER_GET('/cart', token);
};

const addToCart = async (token, data) => {
    return await USER_POST('/cart', token, data);
};

const removeFromCart = async (token, productId) => {
    return await USER_DELETE(`/cart/${productId}`, token);
};

const updateCartItemQuantity = async (token, data) => {
    return await USER_POST('/cart', token, data);
};

export {
    getUser,
    getMe,
    deleteAccount,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
};
