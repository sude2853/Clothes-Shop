/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { categoryData, categoryFilterData } from '../../util/data';
import { searchProducts } from '../../services/productService';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const searchRef = useRef(null);

    const { fullname, cart } = useSelector((state) => state.main);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsSearchOpen(false);
        };

        const handleClickOutside = (e) => {
            if (
                isSearchOpen &&
                searchRef.current &&
                !searchRef.current.contains(e.target) &&
                e.target.className !== 'bi bi-x-circle' &&
                !e.target.className?.startsWith('nav-bar-search-item')
            ) {
                setIsSearchOpen(false);
                setSearchText('');
                setSearchResults([]);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    const categories = Object.keys(categoryData);

    const handleMobileToggle = (category) => {
        if (activeDropdown === category) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(category);
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setActiveDropdown(null);
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await searchProducts(
                    searchText,
                    selectedCategory
                );
                setSearchResults(response);
            } catch (e) {
                setSearchResults([]);
                // err
            }
        };

        getProducts();
    }, [searchText, selectedCategory]);

    return (
        <div className="header-row">
            <div className="container">
                <div className="header-wrapper">
                    {!isSearchOpen && (
                        <div
                            className="header-mobile"
                            onClick={() => setMenuOpen(true)}
                        >
                            <i className="bi bi-list" id="btn-menu"></i>
                        </div>
                    )}

                    {window.innerWidth > 576 && (
                        <div className="header-left">
                            <a href="/" className="logo">
                                Clothes Shop
                            </a>
                        </div>
                    )}

                    {isSearchOpen ? (
                        <>
                            <div className="search-bar-wrapper" ref={searchRef}>
                                <input
                                    type="text"
                                    className="search-bar"
                                    placeholder="Arama yapın..."
                                    autoFocus
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                />
                                <select
                                    className="search-category-select"
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                >
                                    <option value="">Tüm Kategoriler</option>
                                    {categoryFilterData.map((cat) => (
                                        <option
                                            key={cat.value}
                                            value={cat.value}
                                        >
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {searchText.length > 0 &&
                                searchResults.length > 0 && (
                                    <div className="nav-bar-search-result">
                                        {searchResults.map((product) => (
                                            <a
                                                key={product._id}
                                                href={`/urunler/${product._id}`}
                                                className="nav-bar-search-item"
                                            >
                                                <img
                                                    src={product.image1}
                                                    alt={product.title}
                                                    className="nav-bar-search-item-image"
                                                />
                                                <div>
                                                    <div className="nav-bar-search-item-title">
                                                        {product.title}
                                                    </div>
                                                    <div className="nav-bar-search-item-price">
                                                        {product.price} TL
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                        </>
                    ) : (
                        <div
                            className="header-center"
                            id="sidebar"
                            style={{
                                left: menuOpen ? '0' : '-100%',
                                paddingTop: menuOpen ? '18px' : '0',
                            }}
                        >
                            {menuOpen && (
                                <i
                                    className="bi bi-x-lg nav-menu-open"
                                    id="close-sidebar"
                                    onClick={closeMenu}
                                    aria-label="Close menu"
                                />
                            )}
                            <nav className="navigation">
                                <ul className="menu-list">
                                    {categories.map((category, index) => (
                                        <li
                                            key={index}
                                            className={`menu-list-item megamenu-wrapper ${
                                                activeDropdown === category
                                                    ? 'active'
                                                    : ''
                                            }`}
                                            onMouseEnter={() =>
                                                window.innerWidth > 768 &&
                                                setActiveDropdown(category)
                                            }
                                            onMouseLeave={() =>
                                                window.innerWidth > 768 &&
                                                setActiveDropdown(null)
                                            }
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div
                                                className="menu-link"
                                                onClick={() => {
                                                    if (menuOpen)
                                                        handleMobileToggle(
                                                            category
                                                        );
                                                    else
                                                        window.location.href = `/${category.toLowerCase()}`;
                                                }}
                                            >
                                                {category}
                                            </div>

                                            {activeDropdown === category &&
                                                !menuOpen && (
                                                    <ul className="dropdown">
                                                        {categoryData[
                                                            category
                                                        ].map((item, i) => (
                                                            <li
                                                                key={i}
                                                                onClick={() =>
                                                                    (window.location.href = `/${category.toLowerCase()}/urunler?filtre=${
                                                                        item.name
                                                                    }`)
                                                                }
                                                            >
                                                                <a>
                                                                    {item.value}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                            {activeDropdown === category &&
                                                menuOpen && (
                                                    <ul>
                                                        <li>
                                                            <a
                                                                href={`/${category.toLowerCase()}/tumu`}
                                                            >
                                                                Tümü
                                                            </a>
                                                        </li>
                                                        {categoryData[
                                                            category
                                                        ].map((item, i) => (
                                                            <li
                                                                key={i}
                                                                onClick={() =>
                                                                    (window.location.href = `/${category.toLowerCase()}/urunler?filtre=${
                                                                        item.name
                                                                    }`)
                                                                }
                                                            >
                                                                <a>
                                                                    {item.value}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}

                    <div className="header-right">
                        <div className="header-right-links">
                            <a
                                href="/hesabim"
                                className="header-account"
                                style={{
                                    display: 'flex',
                                }}
                            >
                                <p>{fullname?.split(' ')[0]}</p>
                                <i className="bi bi-person"></i>
                            </a>
                            <button
                                className="search-button"
                                onClick={() => {
                                    if (isSearchOpen) {
                                        setSearchText('');
                                        setSearchResults([]);
                                        setSelectedCategory('');
                                    }
                                    setIsSearchOpen((prev) => !prev);
                                }}
                            >
                                <i
                                    className={`bi ${
                                        isSearchOpen
                                            ? 'bi-x-circle'
                                            : 'bi-search'
                                    }`}
                                ></i>
                            </button>
                            <a href="/favoriler">
                                <i className="bi bi-heart"></i>
                            </a>
                            <div className="header-cart">
                                <a href="/sepet" className="header-cart-link">
                                    <i className="bi bi-bag"></i>
                                    <span className="header-cart-count">
                                        {cart.length}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
