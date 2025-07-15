import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Home from './pages/home/Home';
import Man from './pages/man/Man';
import Baby from './pages/baby/Baby';
import Jewelry from './pages/jewelry/Jewelry';
import Account from './pages/account/Account';
import Products from './pages/products/Products';
import Favorites from './pages/favorites/Favorites';
import Cart from './pages/cart/Cart';
import Payment from './pages/payment/Payment';
import OTP from './pages/otp/OTP';
import Auth from './pages/auth/Auth';
import ProductManagement from './pages/product-management/ProductManagement';
import CreateProduct from './pages/product-management/create-product/CreateProduct';
import UpdateProduct from './pages/product-management/update-product/UpdateProduct';
import ProductDetail from './pages/product-detail/ProductDetail';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Policy from './components/policy/Policy';

import { setCart, setFullname, setRole, setToken } from './store/mainSlice';
import { getMe, getCart } from './services/userService';
import Loading from './components/loading/Loading';

function LayoutWrapper() {
    const location = useLocation();
    const dispacth = useDispatch();

    const noHeaderRoutes = ['/otp', '/odeme'];
    const hideHeader = noHeaderRoutes.includes(location.pathname);

    const noFooterRoutes = [
        '/otp',
        '/odeme',
        '/hesabim',
        '/auth',
        '/urun-yonetimi',
        '/urun-yonetimi/urun-ekle',
        '/urun-yonetimi/urun-guncelle',
    ];
    const hideFooter = noFooterRoutes.some(
        (prefix) =>
            location.pathname === prefix ||
            location.pathname.startsWith(prefix + '/')
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispacth(setToken(token));
            handleMe(token);
        }
    });

    const handleMe = async (token) => {
        try {
            const { fullname, role } = await getMe(token);
            const { cart } = await getCart(token);
            dispacth(setFullname(fullname));
            dispacth(setRole(role));
            dispacth(setCart(cart));
        } catch (e) {
            // err
        }
    };

    return (
        <>
            {!hideHeader && <Header />}
            <main>
                <Routes>
                    <Route path="/*" element={<Home />} />
                    <Route path="/kadin" element={<Home />} />
                    <Route path="/erkek" element={<Man />} />
                    <Route path="/bebek" element={<Baby />} />
                    <Route path="/aksesuar" element={<Jewelry />} />
                    <Route path="/hesabim" element={<Account />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/:category/urunler" element={<Products />} />
                    <Route path="/favoriler" element={<Favorites />} />
                    <Route path="/sepet" element={<Cart />} />
                    <Route path="/odeme" element={<Payment />} />
                    <Route path="/otp" element={<OTP />} />
                    <Route
                        path="/urun-yonetimi"
                        element={<ProductManagement />}
                    />
                    <Route
                        path="/urun-yonetimi/urun-ekle"
                        element={<CreateProduct />}
                    />
                    <Route
                        path="/urun-yonetimi/urun-guncelle/:productId"
                        element={<UpdateProduct />}
                    />
                    <Route
                        path="/urunler/:productId"
                        element={<ProductDetail />}
                    />
                </Routes>
            </main>
            {!hideFooter && <Policy />}
            {!hideFooter && <Footer />}
            <ToastContainer autoClose={2000} />
        </>
    );
}

function App() {
    return (
        <Router>
            <Loading />
            <LayoutWrapper />
        </Router>
    );
}

export default App;
