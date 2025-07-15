/* eslint-disable jsx-a11y/alt-text */
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { pushToast } from '../../../util/toast';
import {
    categoryData,
    categoryFilterData,
    COLORS,
    filterConfig,
    SIZES,
} from '../../../util/data';

import { uploadImageToImgbb } from '../../../services/imageService';
import { createProduct } from '../../../services/productService';

import { showLoading, hideLoading } from '../../../store/mainSlice';

function CreateProduct() {
    const [product, setProduct] = useState({
        image1: null,
        image2: null,
        title: null,
        description: null,
        price: null,
        discount: null,
        stock: null,
        category: null,
        subCategory: null,
        color: null,
        size: null,
    });

    const fileInputRef = useRef(null);
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.main);

    const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            pushToast('Lütfen sadece JPG/JPEG dosyası seçin.');
            return;
        }

        setProduct({ ...product, [key]: file });
    };

    const formatNumberValues = (e) => {
        let value = e.target.value;
        if (value.includes('.')) {
            const [intPart, decPart] = value.split('.');
            value = `${intPart}.${decPart.slice(0, 2)}`;
        } else if (value.includes(',')) {
            const [intPart, decPart] = value.split(',');
            value = `${intPart}.${decPart.slice(0, 2)}`;
        }
        return value;
    };

    const handleSubmit = async () => {
        const {
            image1,
            image2,
            title,
            description,
            price,
            discount,
            stock,
            category,
            subCategory,
            color,
            size,
        } = product;

        if (
            !image1 ||
            !image2 ||
            !title ||
            !description ||
            !price ||
            !discount ||
            !stock ||
            !category ||
            !subCategory ||
            !color ||
            (filterConfig[product.category.toLowerCase()].size && !size)
        ) {
            alert('Lütfen boş alan bırakmayınız!');
            return;
        }

        const images = await uploadImages();
        const requestData = {
            ...product,
            image1: images.image1,
            image2: images.image2,
        };

        try {
            dispatch(showLoading());
            await createProduct(token, requestData);
            pushToast('Ürün eklendi.');
            navigation('/urun-yonetimi', { replace: true });
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası.');
        } finally {
            dispatch(hideLoading());
        }
    };

    const uploadImages = async () => {
        let images = {};
        try {
            const image1 = await uploadImageToImgbb(product.image1);
            const image2 = await uploadImageToImgbb(product.image2);

            images = { image1, image2 };
        } catch (e) {
            pushToast(e.error || 'Resimler yüklenemedi!');
        }
        return images;
    };

    return (
        <div className="create-product-wrapper">
            <div className="section-title-start">
                <h2>Ürün Güncelle</h2>
                <div className="inner-container">
                    {product?.image1 && (
                        <img
                            src={
                                typeof product.image1 === 'string'
                                    ? product.image1
                                    : URL.createObjectURL(product.image1)
                            }
                        />
                    )}
                    <p>Ürün Resmi (1)</p>
                    <input
                        type="file"
                        accept=".jpg,.jpeg"
                        ref={fileInputRef}
                        className="image-selector"
                        onChange={(e) => handleFileChange(e, 'image1')}
                    />
                    {product?.image2 && (
                        <img
                            src={
                                typeof product.image2 === 'string'
                                    ? product.image2
                                    : URL.createObjectURL(product.image2)
                            }
                        />
                    )}
                    <p>Ürün Resmi (2)</p>
                    <input
                        type="file"
                        accept=".jpg,.jpeg"
                        ref={fileInputRef}
                        className="image-selector"
                        onChange={(e) => handleFileChange(e, 'image2')}
                    />
                    <p>Ürün Adı</p>
                    <input
                        value={product?.title}
                        required={true}
                        className="input"
                        onChange={(e) =>
                            setProduct({ ...product, title: e.target.value })
                        }
                    />
                    <p>Ürün Açıklaması</p>
                    <input
                        value={product?.description}
                        required={true}
                        className="input"
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                description: e.target.value,
                            })
                        }
                    />
                    <p>Ürün Fiyatı</p>
                    <input
                        value={product?.price}
                        required={true}
                        className="input"
                        type="number"
                        onChange={(e) => {
                            const value = formatNumberValues(e);
                            setProduct({
                                ...product,
                                price: value,
                            });
                        }}
                    />
                    <p>
                        Ürün İndirim Yüzdesi{' '}
                        {product?.discount &&
                            `(İndirimli fiyat: ${(
                                (product?.price * (100 - product?.discount)) /
                                100
                            ).toFixed(2)} TL )`}
                    </p>
                    <input
                        value={product?.discount}
                        required={true}
                        className="input"
                        type="number"
                        onChange={(e) => {
                            const value = formatNumberValues(e);
                            const isIncludeDot = value.includes('.');
                            const isIncludeComma = value.includes(',');
                            const length = value.length;

                            if (
                                ((isIncludeDot || isIncludeComma) &&
                                    length > 5) ||
                                (!isIncludeComma && !isIncludeDot && length > 2)
                            )
                                return;

                            setProduct({
                                ...product,
                                discount: value,
                            });
                        }}
                    />
                    <p>Ürün Stok Miktarı</p>
                    <input
                        value={product?.stock}
                        required={true}
                        className="input"
                        step={1}
                        onKeyDown={(e) => {
                            if (
                                e.key === '.' ||
                                e.key === ',' ||
                                e.key === 'e' ||
                                e.key === '+' ||
                                e.key === '-'
                            ) {
                                e.preventDefault();
                            }
                        }}
                        type="number"
                        onChange={(e) => {
                            const value = e.target.value;
                            setProduct({
                                ...product,
                                stock: value,
                            });
                        }}
                    />
                    <p>Kategori</p>
                    <select
                        className="input"
                        value={
                            categoryFilterData.find(
                                (item) =>
                                    item?.value ===
                                    product?.category?.toLowerCase()
                            )?.value
                        }
                        onChange={(e) => {
                            const category = e.target.value;
                            setProduct({
                                ...product,
                                category,
                                subCategory: '',
                                color: '',
                                size: '',
                            });
                        }}
                    >
                        <option value="">-- Seçiniz --</option>
                        {categoryFilterData?.map((cat) => (
                            <option key={cat?.value} value={cat.value}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {product?.category && (
                        <>
                            <p>Alt Kategori</p>
                            <select
                                className="input"
                                value={product?.subCategory}
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        subCategory: e.target.value,
                                    })
                                }
                            >
                                <option value="">-- Seçiniz --</option>
                                {categoryData[
                                    product.category.toUpperCase()
                                ].map((item) => (
                                    <option key={item.name} value={item.name}>
                                        {item.value}
                                    </option>
                                ))}
                            </select>

                            <p>Renk</p>
                            <select
                                className="input"
                                value={product?.color}
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        color: e.target.value,
                                    })
                                }
                            >
                                <option value="">-- Seçiniz --</option>
                                {COLORS.map((item) => (
                                    <option key={item.name} value={item.name}>
                                        {item.value}
                                    </option>
                                ))}
                            </select>

                            {filterConfig[product?.category]?.size && (
                                <>
                                    <p>Beden</p>
                                    <select
                                        className="input"
                                        value={product?.size}
                                        onChange={(e) =>
                                            setProduct({
                                                ...product,
                                                size: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">-- Seçiniz --</option>
                                        {SIZES.map((item) => (
                                            <option key={item} value={item}>
                                                {item.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </>
                    )}
                    <button onClick={handleSubmit}>Ürün Ekle</button>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;
