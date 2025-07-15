const Footer = () => {
    return (
        <footer className="footer">
            <div className="subscribe-row">
                <div className="container">
                    <div className="footer-row-wrapper">
                        <div className="footer-subscribe-wrapper">
                            <div className="footer-subscribe">
                                <div className="footer-subscribe-top">
                                    <h3 className="subscribe-title">
                                        Yeni ürünler, indirimler ve daha fazlası
                                        hakkında bilgi almak için e-postalanızı
                                        giriniz.
                                    </h3>
                                </div>
                                <div className="footer-subscribe-bottom">
                                    <form>
                                        <input
                                            type="text"
                                            placeholder="E-posta adresinizi girin."
                                        />
                                        <button className="btn">
                                            Abone Ol
                                        </button>
                                    </form>
                                    <p className="privacy-text">
                                        Abone Olarak Şartlar ve Koşullarımızı ve
                                        Gizlilik ve Çerez Politikamızı Kabul
                                        Etmiş Olursunuz.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="footer-contact-wrapper">
                            <div className="footer-contact-top">
                                <h2 className="contact-title">
                                    Yardıma mı ihtiyacınız var? <br />
                                    (+90) 541 937 98 33
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="widgets-row">
                <div className="container">
                    <div className="footer-widgets">
                        <div className="brand-info">
                            <div className="footer-logo">CLOTHES SHOP</div>
                            <div className="footer-desc">
                                <p>Şikayet ve Önerileriniz İçin</p>
                            </div>
                            <div className="footer-contact">
                                <p>
                                    541 937 98 33 –{' '}
                                    <a href="mailto:sudeceylan48@icloud.com">
                                        sudeceylan48@icloud.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
