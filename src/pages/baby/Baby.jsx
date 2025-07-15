import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ProductList from '../../components/product-list/ProductList';
import Button from '../../components/button/Button';

import { getProductsByCategory } from '../../services/productService';
import { pushToast } from '../../util/toast';
import { showLoading, hideLoading } from '../../store/mainSlice';

function Baby() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getProducts = async () => {
            try {
                dispatch(showLoading());
                const response = await getProductsByCategory('bebek');
                setProducts(response);
            } catch (e) {
                pushToast(e.errror || 'Sunucu hatası.');
            } finally {
                dispatch(hideLoading());
            }
        };

        getProducts();
    }, []);

    return (
        <>
            <ProductList
                route={(id) => navigate(`/urunler/${id}`)}
                products={products}
                title="Bebek Ürünleri"
                subtitle="En Tatlı Ve Şık Bebek Ürünlerimiz"
                isShort={true}
            />
            {products.length !== 0 && (
                <Button
                    title="Bütün Ürünleri Keşfet"
                    href="bebek/urunler?filtre=tumu"
                />
            )}
        </>
    );
}

export default Baby;
