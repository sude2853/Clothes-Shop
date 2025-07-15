import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { pushToast } from '../../util/toast';
import { categoryData, categoryUpperCase, COLORS } from '../../util/data';

import { getProductById } from '../../services/productService';
import {
    addToCart,
    addToFavorites,
    getCart,
    getFavorites,
    removeFromCart,
    removeFromFavorites,
} from '../../services/userService';

import { setCart, showLoading, hideLoading } from '../../store/mainSlice';

function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [isFav, setIsFav] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const { token } = useSelector((state) => state.main);
    const dispatch = useDispatch();

    useEffect(() => {
        const getProduct = async () => {
            try {
                dispatch(showLoading());
                const response = await getProductById(productId);
                setProduct(response);
                setImages([response.image1, response.image2]);

                const { favorites } = await getFavorites(token);
                const isFavorite =
                    favorites.length > 0
                        ? favorites.find((item) => item._id === response._id)
                        : false;
                setIsFav(isFavorite);

                const { cart } = await getCart(token);
                const isInCart =
                    cart.length > 0 &&
                    cart.find((item) => item.product._id === response._id);
                console.log(cart[0]);
                setIsInCart(isInCart);
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası');
            } finally {
                dispatch(hideLoading());
            }
        };

        if (token) getProduct();
    }, [token]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleFavoriteToggle = async () => {
        if (!token) {
            pushToast(
                'Bu işlemi gerçekleştirebilmek için giriş yapmanız gerekmektedir.'
            );
            return;
        }

        dispatch(showLoading());
        if (isFav) {
            try {
                await removeFromFavorites(token, productId);
                setIsFav(false);
                pushToast('Ürün favorilerden kaldırıldı.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            } finally {
                dispatch(hideLoading());
            }
        } else {
            try {
                await addToFavorites(token, productId);
                setIsFav(true);
                pushToast('Ürün favorilere eklendi.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            } finally {
                dispatch(hideLoading());
            }
        }
    };

    const handleCartToggle = async () => {
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

    return (
        <div className="product-detail-wrapper">
            {product && (
                <>
                    <div className="image-wrapper">
                        <button
                            className="nav-btn prev"
                            onClick={prevImage}
                            disabled={images.length <= 1}
                        >
                            ‹
                        </button>

                        <img
                            src={images[currentImage]}
                            alt={product.title}
                            className="img1"
                        />

                        <button
                            className="nav-btn next"
                            onClick={nextImage}
                            disabled={images.length <= 1}
                        >
                            ›
                        </button>
                    </div>
                    <div className="inner-container">
                        <p className="category">
                            {categoryUpperCase[product.category]} -{' '}
                            {
                                categoryData[
                                    product?.category?.toUpperCase()
                                ]?.find(
                                    (item) => item.name === product.subCategory
                                )?.value
                            }
                        </p>
                        <h1>{product.title}</h1>
                        <p className="description">{product.description}</p>

                        <div className="inner-mid">
                            <p>
                                Renk:{' '}
                                {
                                    COLORS.find(
                                        (color) => color.name === product.color
                                    )?.value
                                }
                            </p>
                            {product.size && (
                                <p>Beden: {product?.size?.toUpperCase()}</p>
                            )}
                            {product.discount ? (
                                <p className="price-box">
                                    <del className="original-price">
                                        {product?.price?.toFixed(2)} TL
                                    </del>
                                    <span className="discounted-price">
                                        {(
                                            (product?.price *
                                                (100 - product?.discount)) /
                                            100
                                        )?.toFixed(2)}
                                         TL
                                    </span>
                                </p>
                            ) : (
                                <p className="price-box">
                                    {product?.price?.toFixed(2)} TL
                                </p>
                            )}
                            <p>Stok: {product?.stock}</p>
                            {product?.discount && (
                                <p>İndirim: %{product?.discount}</p>
                            )}
                        </div>
                        <div className="action-buttons">
                            <button
                                className="btn btn-sm add-to-cart-btn"
                                onClick={handleCartToggle}
                            >
                                {isInCart ? 'Sepetten Çıkar' : 'Sepete Ekle'}
                            </button>
                            <button
                                className={`favorite-btn`}
                                onClick={handleFavoriteToggle}
                            >
                                <i
                                    className={`bi ${
                                        isFav ? 'bi-heart-fill' : 'bi-heart'
                                    }`}
                                ></i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductDetail;
