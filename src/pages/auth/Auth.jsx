/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../components/input/Input';

import { login, register } from '../../services/authService';

import {
    setUserId,
    setToken,
    setFullname,
    showLoading,
    hideLoading,
} from '../../store/mainSlice';

import { pushToast } from '../../util/toast';

const Auth = () => {
    const [authType, setAuthType] = useState('login');

    const { token } = useSelector((state) => state.main);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (token !== null) {
            navigate('/hesabim', { replace: true });
            return;
        }

        if (authType === 'register') {
            window.history.pushState(null, '', window.location.pathname);
        }
    }, [authType, token]);

    useEffect(() => {
        const handlePopState = (event) => {
            if (authType === 'register') {
                setAuthType('login');
                window.history.pushState(null, '', window.location.pathname);
            } else {
                window.history.back();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [authType, location]);

    const handleLoginSubmit = async (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');

        if (password.length < 8) {
            pushToast('Şifre en az 8 haneli olmalıdır.');
            return;
        }

        const requestData = { email, password };
        try {
            dispatch(showLoading());
            const { token, fullname } = await login(requestData);
            dispatch(setToken(token));
            dispatch(setFullname(fullname));
            pushToast('Giriş yapıldı.');
            navigate('/', { replace: true });
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası.');
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleRegisterSubmit = async (formData) => {
        const fullname = formData.get('fullname');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            pushToast('Şifre ile şifre tekrarı uyuşmamaktadır.');
            return;
        }

        if (password.length < 8) {
            pushToast('Şifre en az 8 haneli olmalıdır.');
            return;
        }

        const requestData = { fullname, email, password };

        try {
            dispatch(showLoading());
            const response = await register(requestData);
            dispatch(setUserId(response.userId));
            navigate('/otp');
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası.');
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <section className="account-page">
            <div className="container">
                <div className="account-wrapper">
                    {authType === 'login' ? (
                        <div className="account-column">
                            <h2>Giriş Yap</h2>
                            <form action={handleLoginSubmit}>
                                <Input
                                    label={'Email İle Giriş'}
                                    type="email"
                                    required={true}
                                    name="email"
                                />
                                <Input
                                    label={'Şifre'}
                                    type="password"
                                    required={true}
                                    name="password"
                                />
                                <button className="btn btn-sm btn-primary">
                                    Giriş
                                </button>
                                <p
                                    onClick={() => setAuthType('register')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Hesabın yok mu? Kayıt ol
                                </p>
                                <a href="#" className="form-link">
                                    Şifremi Unuttum
                                </a>
                            </form>
                        </div>
                    ) : (
                        <div className="account-column">
                            <h2>Kayıt Ol</h2>
                            <form action={handleRegisterSubmit}>
                                <Input
                                    label={'Ad Soyad'}
                                    type="text"
                                    required={true}
                                    name="fullname"
                                />
                                <Input
                                    label={'Email Adresi'}
                                    type="email"
                                    required={true}
                                    name="email"
                                />
                                <Input
                                    label={'Şifre'}
                                    type="password"
                                    required={true}
                                    name="password"
                                />
                                <Input
                                    label={'Şifre Tekrar'}
                                    type="password"
                                    required={true}
                                    name="confirmPassword"
                                />
                                <p
                                    onClick={() => setAuthType('login')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Hesabın var mı? Giriş yap
                                </p>
                                <div className="privacy-policy-text remember">
                                    <p>
                                        Hesabınıza erişimi yönetmek ve Gizlilik
                                        Politikamızda güvendedir.{' '}
                                    </p>
                                    <button className="btn btn-lg btn-primary">
                                        Kayıt Ol
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Auth;
