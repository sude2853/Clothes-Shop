/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { deleteAccount, getUser } from '../../services/userService';

import { pushToast } from '../../util/toast';

import { clear, showLoading, hideLoading } from '../../store/mainSlice';

const Account = () => {
    const [user, setUser] = useState({ fullname: '', email: '' });
    const { token, role } = useSelector((state) => state.main);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            handleUser();
        } else {
            navigate('/auth', { replace: true });
        }
    }, [token]);

    const handleUser = async () => {
        try {
            dispatch(showLoading());
            const response = await getUser(token);
            setUser({ fullname: response.fullname, email: response.email });
        } catch (e) {
            // err
        } finally {
            dispatch(hideLoading());
        }
    };

    const logout = () => {
        const confirmed = window.confirm(
            'Çıkış yapmak istediğinize emin misiniz?'
        );
        if (confirmed) {
            localStorage.removeItem('token');
            dispatch(clear());
            navigate('/', { replace: true });
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Hesabınızı silmek istediğinize emin misiniz?'
        );

        if (confirmed) {
            try {
                dispatch(showLoading());
                await deleteAccount(token);
                localStorage.removeItem('token');
                dispatch(clear());
                navigate('/', { replace: true });
                pushToast('Hesabınız silindi.');
            } catch (e) {
                pushToast(e.error || 'Sunucu hatası.');
            } finally {
                dispatch(hideLoading());
            }
        }
    };

    return (
        <div className="account-detail-wrapper">
            <div className="section-title-start">
                <h2>Kullanıcı Bilgilerim</h2>
            </div>

            <p className="account-info">
                <strong>Ad Soyad: </strong>
                {user.fullname}
            </p>
            <p className="account-info">
                <strong>E-posta Adresi: </strong>
                {user.email}
            </p>
            <div className="account-button-wrapper">
                {role === 'admin' && (
                    <button
                        className="btn btn-lg btn-primary account-button"
                        onClick={() => navigate('/urun-yonetimi')}
                    >
                        Ürünleri Yönet
                    </button>
                )}
                <button
                    className="btn btn-lg btn-primary account-button"
                    onClick={logout}
                >
                    Çıkış Yap
                </button>
                <button
                    className="btn btn-lg btn-primary account-button close"
                    onClick={handleDeleteAccount}
                >
                    Hesabı Sil
                </button>
            </div>
        </div>
    );
};

export default Account;
