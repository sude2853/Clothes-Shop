/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ProductList from '../../components/product-list/ProductList';

import { getFilteredProducts } from '../../services/productService';

import { categoryData, COLORS, filterConfig, SIZES } from '../../util/data';
import { pushToast } from '../../util/toast';

import { showLoading, hideLoading } from '../../store/mainSlice';

function Products() {
    const [products, setProducts] = useState([]);
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const filters = filterConfig[category] || {
        color: false,
        size: false,
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [filterParam, setFilterParam] = useState(searchParams.get('filtre'));
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const getApi = async () => {
            try {
                dispatch(showLoading());
                const response = await getFilteredProducts(
                    category,
                    filterParam === 'tumu' ? '' : filterParam,
                    selectedColor,
                    selectedSize
                );
                setProducts(response);
            } catch (e) {
                setProducts([]);
                pushToast(e.error || 'Sunucu hatası');
            } finally {
                dispatch(hideLoading());
            }
        };
        getApi();
    }, [category, selectedColor, selectedSize, filterParam]);

    return (
        <div className="products-wrapper">
            <div className="section-title-start">
                <h2>
                    {category
                        ? (
                              category.charAt(0).toUpperCase() +
                              category.slice(1)
                          ).replace('i', 'ı') + ' Ürünleri'
                        : 'Ürünler'}
                </h2>
            </div>

            <div className="products-wrapper-inner">
                <select
                    value={
                        categoryData[category.toUpperCase()].find(
                            (item) => item.name === filterParam
                        )?.value
                    }
                    onChange={(e) => setFilterParam(e.target.value)}
                    className="products-selector"
                >
                    <option value="">Tümü</option>
                    {categoryData[category.toUpperCase()].map((type) => (
                        <option key={type.name} value={type.name}>
                            {type.value}
                        </option>
                    ))}
                </select>

                {filters.color && (
                    <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="products-selector"
                    >
                        <option value="">Renk Seçin</option>
                        {COLORS.map((color) => (
                            <option key={color.name} value={color.name}>
                                {color.value}
                            </option>
                        ))}
                    </select>
                )}

                {filters.size && (
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="products-selector"
                    >
                        <option value="">Beden Seçin</option>
                        {SIZES.map((size) => (
                            <option key={size} value={size}>
                                {size.toUpperCase()}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <ProductList
                products={products}
                route={(id) => navigate(`/urunler/${id}`)}
            />
        </div>
    );
}

export default Products;
