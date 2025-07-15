import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProductList from '../../components/product-list/ProductList';

import { getFavorites } from '../../services/userService';

import { pushToast } from '../../util/toast';

import { showLoading, hideLoading } from '../../store/mainSlice';

function Favorites() {
    const [products, setProducts] = useState([]);

    const { token } = useSelector((state) => state.main);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getProducts = async () => {
            try {
                dispatch(showLoading());
                const { favorites } = await getFavorites(token);
                setProducts(favorites);
            } catch (e) {
                // err
            } finally {
                dispatch(hideLoading());
            }
        };

        if (token) getProducts();
    }, [token]);

    return (
        <div className="favorites-wrapper">
            <div className="section-title-start">
                <h2>Beğenilen Ürünler</h2>
            </div>

            <ProductList
                products={products}
                route={(id) => navigate(`/urunler/${id}`)}
            />
        </div>
    );
}

export default Favorites;
