import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/input/Input';

import { pushToast } from '../../util/toast';

import { createOrder } from '../../services/orderService';

import { showLoading, hideLoading } from '../../store/mainSlice';

const Payment = () => {
    const { token } = useSelector((state) => state.main);
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        city: '',
        district: '',
        address: '',
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvv: '',
    });

    const { cart } = useSelector((state) => state.main);

    const calculateAmount = () => {
        let sum = 0;
        cart.forEach((item) => {
            const product = item.product;
            const price = (product.price * (100 - product.discount)) / 100;
            sum += item.quantity * price;
        });
        return sum.toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            let numericValue = value.replace(/\D/g, '').slice(0, 16);

            const formattedValue =
                numericValue.match(/.{1,4}/g)?.join(' ') || '';

            setForm((prev) => ({ ...prev, [name]: formattedValue }));
            return;
        } else if (name === 'expiry') {
            let formatted = value.replace(/[^\d]/g, '');

            if (formatted.length > 4) return;

            if (formatted.length > 2) {
                formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
            }

            setForm((prev) => ({ ...prev, [name]: formatted }));
        } else if (name === 'cvv') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 3) {
                setForm((prev) => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = Object.values(form);
        if (
            values.some(
                (val) =>
                    val.trim() === '' ||
                    form.cardNumber.length !== 19 ||
                    form.expiry.length !== 5 ||
                    form.cvv.length !== 3
            )
        ) {
            alert('Lütfen bilgileri eksiksiz doldurun.');
            return;
        }

        console.log(form.cardNumber);

        const products = cart.map((item) => ({
            productId: item.product._id,
            title: item.product.name,
            image1: item.product.image1,
            image2: item.product.image2,
            price: item.product.price,
            quantity: item.quantity,
            discount: item.product.discount,
        }));

        const requestData = {
            address: {
                city: form.city,
                district: form.district,
                description: form.address,
            },
            cardInfo: {
                cardHolder: form.cardHolder,
                last4: form.cardNumber.slice(15, 19),
            },
            totalPrice: calculateAmount(),
            items: products,
        };

        try {
            dispatch(showLoading());
            await createOrder(token, requestData);
            pushToast('Sipraişiniz oluşturuldu.');
            navigation('/', { replace: true });
        } catch (e) {
            pushToast(e.error || 'Sunucu hatası.');
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <section className="checkout-page payment-wrapper">
            <div className="container">
                <div className="section-title-start">
                    <h2>Ödeme</h2>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="checkout-form patment-form"
                >
                    <h4>Adres Bilgileri</h4>
                    <Input
                        label="İl"
                        name="city"
                        required
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        hasMarginBottom={true}
                    />
                    <Input
                        label="İlçe"
                        name="district"
                        required
                        type="text"
                        value={form.district}
                        onChange={handleChange}
                        hasMarginBottom={true}
                    />
                    <div>
                        <label>
                            <span>
                                Açık Adres <span className="required">*</span>
                            </span>
                            <textarea
                                name="address"
                                value={form.address}
                                required
                                rows={3}
                                onChange={handleChange}
                                className="payment-address"
                            />
                        </label>
                    </div>

                    <h4>Kart Bilgileri</h4>
                    <Input
                        label="Kart Numarası"
                        name="cardNumber"
                        required
                        type="text"
                        value={form.cardNumber}
                        onChange={handleChange}
                        hasMarginBottom={true}
                    />
                    <Input
                        label="Kart Sahibi"
                        name="cardHolder"
                        required
                        type="text"
                        value={form.cardHolder}
                        onChange={handleChange}
                        hasMarginBottom={true}
                    />
                    <Input
                        label="Son Kullanma Tarihi (AA/YY)"
                        name="expiry"
                        required
                        type="text"
                        value={form.expiry}
                        onChange={handleChange}
                        hasMarginBottom={true}
                    />
                    <Input
                        label="CVV"
                        name="cvv"
                        required
                        type="text"
                        value={form.cvv}
                        onChange={handleChange}
                    />

                    <div className="total-amount payment-amount">
                        <strong>Toplam Tutar: {calculateAmount()} TL</strong>
                    </div>

                    <button
                        className="btn btn-lg btn-primary payment-button"
                        type="submit"
                    >
                        Ödemeyi Tamamla
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Payment;
