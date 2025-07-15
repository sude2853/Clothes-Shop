import { ORDER_POST } from './api';

const createOrder = async (token, data) => {
    return await ORDER_POST('/', token, data);
};

export { createOrder };
