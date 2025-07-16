import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { pushToast } from '../../util/toast';

import { deleteProduct, getProducts } from '../../services/productService';

import { showLoading, hideLoading } from '../../store/mainSlice';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.main);

    const handleProducts = async () => {
        try {
            dispatch(showLoading());
            const response = await getProducts();
            setProducts(response);
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası');
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        handleProducts();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        // eslint-disable-next-line no-restricted-globals
        const confirmed = confirm('Ürünü silmek istediğinize emin misiniz?');
        if (!confirmed) return;
        try {
            dispatch(showLoading());
            await deleteProduct(token, id);
            pushToast('Ürün silindi.');
            handleProducts();
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası');
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <div className="product-managemet-wrapper">
            <div className="header">
                <div className="section-title-start">
                    <h2>Ürün Yönetimi</h2>
                </div>
                <a href="/urun-yonetimi/urun-ekle">Ürün Ekle</a>
            </div>
            {products?.map((item) => (
                <div
                    className="item-container"
                    onClick={() =>
                        navigation(`/urun-yonetimi/urun-guncelle/${item._id}`)
                    }
                >
                    <img src={item.image1} alt={item.title} />
                    <div className="middle-section">
                        <p className="title">{item.title}</p>
                        <p className="description">{item.description}</p>
                        <p className="discount">
                            İndirim Oranı: {item.discount}%
                        </p>
                        <p className="price">Fiyat: {item.price} TL</p>
                        <p className="price">
                            İndirimli Fiyat:{' '}
                            {(
                                (item.price * (100 - item.discount)) /
                                100
                            ).toFixed(2)}{' '}
                            TL
                        </p>
                    </div>
                    <div className="right-section">
                        <button onClick={(e) => handleDelete(e, item._id)}>
                            Ürünü Sil
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductManagement;
