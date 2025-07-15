import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Slider from '../../components/slider/Slider';
import ProductList from '../../components/product-list/ProductList';
import Campaign from '../../components/campaign/Campaign';
import Button from '../../components/button/Button';

import { pushToast } from '../../util/toast';

import { getProductsByCategory } from '../../services/productService';

import { showLoading, hideLoading } from '../../store/mainSlice';

const slides = [
    {
        image: '/assets/img/avatars/img/zara1.jpg',
        title: 'TREND 2025',
        heading: "%30 ' A VARAN İNDİRİMLER",
    },
    {
        image: '/assets/img/avatars/img/beyazelbiselikadin.jpg',
        title: 'TREND 2025',
        heading: "%30'A VARAN İNDİRİMLER",
    },
];

function Home() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getProducts = async () => {
            try {
                dispatch(showLoading());
                const response = await getProductsByCategory('kadin');
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
            <Slider slides={slides} />
            <ProductList
                products={products}
                title="Bazı Kadın Ürünleri"
                isShort={true}
                route={(id) => navigate(`/urunler/${id}`)}
            />
            {products.length !== 0 && (
                <Button
                    title="Bütün Ürünleri Keşfet"
                    href="kadin/urunler?filtre=tumu"
                />
            )}
            <Campaign />
        </>
    );
}

export default Home;
