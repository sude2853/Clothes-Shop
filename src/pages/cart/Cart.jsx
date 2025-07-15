import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { pushToast } from '../../util/toast';

import {
    getCart,
    removeFromCart,
    updateCartItemQuantity,
} from '../../services/userService';

import { setCart, showLoading, hideLoading } from '../../store/mainSlice';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    const { token } = useSelector((state) => state.main);
    const dispacth = useDispatch();
    const navigation = useNavigate();

    const handleCartItems = async () => {
        try {
            dispacth(showLoading());
            const { cart } = await getCart(token);
            setCartItems(cart);
            dispacth(setCart(cart));
        } catch (e) {
            // err
        } finally {
            dispacth(hideLoading());
        }
    };

    useEffect(() => {
        if (token) handleCartItems();
    }, [token]);

    useEffect(() => {
        const calculatedSubtotal = cartItems.reduce(
            (sum, item) =>
                sum + item.product.discount
                    ? (item.product.price * (100 - item.product.discount)) / 100
                    : item.product.price * item.quantity,
            0
        );
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedSubtotal);
    }, [cartItems]);

    const changeQuantity = async (e, id, quantity, type) => {
        e.stopPropagation();

        const requestData = {
            productId: id,
            quantity: type === 'increase' ? quantity + 1 : quantity - 1,
        };
        try {
            await updateCartItemQuantity(token, requestData);
            await handleCartItems();
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası.');
        }
    };

    const removeItem = async (e, id) => {
        e.stopPropagation();

        const confirmDelete = window.confirm(
            'Bu ürünü sepetten kaldırmak istiyor musunuz?'
        );
        if (confirmDelete) {
            try {
                await removeFromCart(token, id);
                await handleCartItems();
                pushToast('Ürün sepetten kaldırıldı.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            }
        }
    };

    const calculatePrice = (product) => {
        let price = 0;
        if (product.discount)
            price = (product.price * (100 - product.discount)) / 100;
        else price = product.price;
        return price?.toFixed(2);
    };

    return (
        <section className="cart-page">
            <div className="container">
                <div className="cart-page-wrapper">
                    <div className="cart-items" style={{ flex: 2 }}>
                        <div className="section-title-start">
                            <h2>Sepetiniz</h2>
                        </div>
                        {cartItems.length === 0 ? (
                            <p>Sepetiniz boş.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {cartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="cart-product-wrapper"
                                        onClick={() =>
                                            navigation(
                                                `/urunler/${item.product._id}`
                                            )
                                        }
                                    >
                                        <div className="cart-product">
                                            <img
                                                src={item.product.image1}
                                                alt={item.product.title}
                                                className="cart-product-image"
                                            />
                                            <div>
                                                <h4>{item.product.title}</h4>
                                                <p>
                                                    {item.quantity} x{' '}
                                                    {calculatePrice(
                                                        item.product
                                                    )}{' '}
                                                    TL
                                                </p>
                                                <strong>
                                                    {(
                                                        calculatePrice(
                                                            item.product
                                                        ) * item.quantity
                                                    )?.toFixed(2)}{' '}
                                                    TL
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="cart-product-quantity-wrapper">
                                            <div className="cart-product-quantity">
                                                <button
                                                    onClick={(e) =>
                                                        changeQuantity(
                                                            e,
                                                            item.product._id,
                                                            item.quantity,
                                                            'decrease'
                                                        )
                                                    }
                                                    className="btn btn-sm cart-product-quantity-button"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={(e) =>
                                                        changeQuantity(
                                                            e,
                                                            item.product._id,
                                                            item.quantity,
                                                            'increase'
                                                        )
                                                    }
                                                    className="btn btn-sm cart-product-quantity-button"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={(e) =>
                                                    removeItem(
                                                        e,
                                                        item.product._id
                                                    )
                                                }
                                                className="btn btn-sm btn-primary cart-product-delete-button"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="cart-collaterals" style={{ flex: 1 }}>
                        <div className="cart-totals">
                            <h2>Toplam Sepet</h2>
                            <table>
                                <tbody>
                                    <tr className="cart-subtotal">
                                        <th>Ara Toplam</th>
                                        <td>
                                            <span>
                                                {subtotal.toFixed(2)} TL
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Toplam</th>
                                        <td>
                                            <strong>
                                                {total.toFixed(2)} TL
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="checkout">
                                <button
                                    className="btn btn-lg btn-primary"
                                    onClick={() =>
                                        (window.location.href = '/odeme')
                                    }
                                    disabled={cartItems.length === 0}
                                >
                                    Ödemeye Devam Et
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
