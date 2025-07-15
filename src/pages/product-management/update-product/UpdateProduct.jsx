/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
    getProductById,
    updateProduct,
} from '../../../services/productService';
import {
    categoryData,
    categoryFilterData,
    COLORS,
    filterConfig,
    SIZES,
} from '../../../util/data';
import { uploadImageToImgbb } from '../../../services/imageService';

import { pushToast } from '../../../util/toast';

import { showLoading, hideLoading } from '../../../store/mainSlice';

function UpdateProduct() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    const fileInputRef = useRef(null);
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.main);

    useEffect(() => {
        const getProduct = async () => {
            try {
                dispatch(showLoading());
                const reponse = await getProductById(productId);
                setProduct(reponse);
            } catch (error) {
                navigation('/urun-yonetimi', { replace: true });
            } finally {
                dispatch(hideLoading());
            }
        };

        getProduct();
    }, [productId]);

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

        let newImage1 = null;
        let newImage2 = null;
        if (typeof image1 === 'object') {
            newImage1 = await uploadImageToImgbb(image1);
        }

        if (typeof image2 === 'object') {
            newImage2 = await uploadImageToImgbb(image1);
        }

        const requestData = {
            ...product,
            image1: newImage1 ? newImage1 : image1,
            image2: newImage2 ? newImage2 : image2,
        };

        try {
            dispatch(showLoading());
            await updateProduct(token, requestData);
            pushToast('Ürün güncellendi.');
            navigation('/urun-yonetimi', { replace: true });
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası.');
        } finally {
            dispatch(hideLoading());
        }
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
                    <button onClick={handleSubmit}>Güncelle</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
