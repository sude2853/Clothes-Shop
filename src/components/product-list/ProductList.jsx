import { useEffect, useState } from 'react';
import ProductItem from '../product-item/ProductItem';
import { useSelector } from 'react-redux';

const ProductList = ({
    products,
    title,
    subtitle = '',
    isShort = false,
    route,
}) => {
    const [favorites, setFavorites] = useState([]);

    const { favorites: favoritesData } = useSelector((state) => state.main);

    useEffect(() => {
        setFavorites(favoritesData);
    }, []);

    const data = isShort ? products.slice(0, 6) : products;

    return (
        <section className="products">
            <div className="container">
                <div className="section-title">
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
                {products.length === 0 ? (
                    <div className="empty-product">Ürün listesi boş.</div>
                ) : (
                    <div className="product-wrapper">
                        <ul className="product-grid">
                            {data.map((product, index) => (
                                <li className="product-grid-item" key={index}>
                                    <ProductItem
                                        product={product}
                                        route={route}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductList;
