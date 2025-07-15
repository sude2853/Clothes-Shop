import { PRODUCT_GET, PRODUCT_POST, PRODUCT_PUT, PRODUCT_DELETE } from './api';

const createProduct = async (token, data) => {
    return await PRODUCT_POST('/', token, data);
};

const getProducts = async () => {
    return await PRODUCT_GET('/');
};

const getProductById = async (productId) => {
    return await PRODUCT_GET(`/id/${productId}`);
};

const updateProduct = async (token, data) => {
    return await PRODUCT_PUT(`/${data._id}`, token, data);
};

const deleteProduct = async (token, id) => {
    return await PRODUCT_DELETE(`/${id}`, token);
};

const getProductsByCategory = async (category) => {
    return await PRODUCT_GET(`/category/${category}`);
};

const searchProducts = async (query, category) => {
    return await PRODUCT_GET(`/search?search=${query}&category=${category}`);
};

const getFilteredProducts = async (category, subCategory, color, size) => {
    return await PRODUCT_GET(
        `/filter?category=${category}&subCategory=${subCategory}&color=${color}&size=${size}`
    );
};

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    getFilteredProducts,
};
