import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    userId: null,
    role: null,
    fullname: null,
    cart: [],
    favorites: [],
    isLoading: false,
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setToken(state, action) {
            localStorage.setItem('token', action.payload);
            state.token = action.payload;
        },
        setUserId(state, action) {
            state.userId = action.payload;
        },
        clearUserId(state) {
            state.userId = null;
        },
        setRole(state, action) {
            state.role = action.payload;
        },
        setFullname(state, action) {
            state.fullname = action.payload;
        },
        setCart(state, action) {
            state.cart = action.payload;
        },
        addToCart(state, action) {
            const existingItem = state.cart.find(
                (item) => item.productId === action.payload
            );
            if (!existingItem) {
                state.cart.push({
                    productId: action.payload,
                    quantity: 1,
                });
            }
        },
        removeFromCart(state, action) {
            state.cart = state.cart.filter(
                (item) => item.productId !== action.payload
            );
        },
        updateQuantity(state, action) {
            const item = state.cart.find(
                (item) => item.productId === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart(state) {
            state.cart = [];
        },
        clear(state) {
            localStorage.removeItem('token');
            state.token = null;
            state.userId = null;
            state.role = null;
            state.otp = null;
            state.fullname = null;
            state.cart = [];
        },
        showLoading(state) {
            state.isLoading = true;
        },
        hideLoading(state) {
            state.isLoading = false;
        },
    },
});

export const {
    addToCart,
    clear,
    clearCart,
    clearOtp,
    clearUserId,
    removeFromCart,
    setCart,
    setUserId,
    setRole,
    setToken,
    setFullname,
    updateQuantity,
    showLoading,
    hideLoading,
} = mainSlice.actions;

export default mainSlice.reducer;
