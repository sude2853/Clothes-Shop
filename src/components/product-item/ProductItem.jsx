import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushToast } from '../../util/toast';
import {
    addToCart,
    addToFavorites,
    getCart,
    getFavorites,
    removeFromCart,
    removeFromFavorites,
} from '../../services/userService';
import { setCart } from '../../store/mainSlice';

/* eslint-disable jsx-a11y/anchor-is-valid */
const ProductItem = ({ product, route }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.main);

    useEffect(() => {
        const handleStates = async () => {
            try {
                const { favorites } = await getFavorites(token);
                const isFavorite =
                    favorites.length > 0 &&
                    favorites.find((item) => item._id === product._id);
                setIsFavorited(isFavorite);

                const { cart } = await getCart(token);
                const isInCart =
                    cart.length > 0 &&
                    cart.find((item) => item.product._id === product._id);
                setIsInCart(isInCart);
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            }
        };

        if (token) handleStates();
    }, []);

    const images = [product.image1, product.image2];

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const toggleCart = async (e) => {
        e.stopPropagation();

        if (!token) {
            pushToast(
                'Bu işlemi gerçekleştirebilmek için giriş yapmanız gerekmektedir.'
            );
            return;
        }
        if (isInCart) {
            try {
                await removeFromCart(token, product._id);
                const { cart } = await getCart(token);
                dispatch(setCart(cart));
                setIsInCart(false);
                pushToast('Ürün sepetten kaldırıldı.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            }
        } else {
            try {
                const { cart } = await addToCart(token, {
                    productId: product._id,
                    quantity: 1,
                });
                dispatch(setCart(cart));
                setIsInCart(true);
                pushToast('Ürün sepete eklendi.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            }
        }
    };

    const toggleFavorite = async (e) => {
        e.stopPropagation();

        if (!token) {
            pushToast(
                'Bu işlemi gerçekleştirebilmek için giriş yapmanız gerekmektedir.'
            );
            return;
        }

        if (isFavorited) {
            try {
                await removeFromFavorites(token, product._id);
                setIsFavorited(false);
                pushToast('Ürün favorilerden kaldırıldı.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            }
        } else {
            try {
                await addToFavorites(token, product._id);
                setIsFavorited(true);
                pushToast('Ürün favorilere eklendi.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            }
        }
    };

    return (
        <li
            className="product-item glide__slide"
            onClick={() => route(product._id)}
        >
            <div className="product-image">
                <img
                    src={images[currentImage]}
                    alt={product.title}
                    className="img1"
                />
            </div>
            <div className="product-info">
                <a href="#" className="product-title">
                    {product.title}
                </a>
                <div className="product-prices">
                    <strong className="new-price">
                        {(
                            (product.price * (100 - product.discount)) /
                            100
                        ).toFixed(2)}{' '}
                        TL
                    </strong>
                    {product.discount !== 0 && (
                        <span className="old-price">{product.price}TL</span>
                    )}
                </div>
                {product.discount !== 0 && (
                    <span className="product-discount">
                        -{product.discount}%
                    </span>
                )}
                <div className="product-links">
                    <button onClick={toggleCart}>
                        <i
                            className={`bi bi-basket-fill ${
                                isInCart ? 'in-cart' : ''
                            }`}
                        ></i>
                    </button>
                    <button onClick={toggleFavorite}>
                        <i
                            className={`bi bi-heart-fill ${
                                isFavorited ? 'favorited' : ''
                            }`}
                        ></i>
                    </button>
                    <a href="#">
                        <i className="bi bi-eye-fill"></i>
                    </a>
                    <a href="#">
                        <i className="bi bi-share-fill"></i>
                    </a>
                </div>
                <div className="product-wrapper glide">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="product-wrapper glide left"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="product-wrapper glide right"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default ProductItem;
