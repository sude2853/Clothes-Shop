import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { verifyOtp } from '../../services/authService';

import { clearUserId, showLoading, hideLoading } from '../../store/mainSlice';
import { pushToast } from '../../util/toast';

function OTP() {
    const [remainingTime, setRemainingTime] = useState(180);
    const [otp, setOtp] = useState('');

    const { userId } = useSelector((state) => state.main);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = async () => {
        try {
            dispatch(showLoading());
            const data = {
                userId,
                otp,
            };
            await verifyOtp(data);
            pushToast('Hesabınız oluşturuldu.');
            dispatch(clearUserId());
            navigate('/hesabim', { replace: true });
        } catch (error) {
            pushToast(JSON.stringify(error));
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <div className="otp-wrapper">
            <input
                className="otp"
                value={otp}
                placeholder="Doğrulama kodu"
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                        setOtp(value);
                    } else if (value.length > 6) {
                        setOtp(value.slice(0, 6));
                    }
                }}
            />
            <button
                className="otp-button"
                onClick={handleClick}
                disabled={remainingTime === 0}
            >
                Doğrula ({remainingTime}s)
            </button>
            <p>Spam kutunuzu kontol edin.</p>
        </div>
    );
}

export default OTP;
