import Navbar from '../navbar/Navbar';

const Header = () => {
    return (
        <header>
            <div className="global-notification">
                <div className="container">
                    <p>
                        <a href="/kadin">Clothes Shop – Tarz seninle başlar.</a>
                    </p>
                </div>
            </div>
            <Navbar />
        </header>
    );
};

export default Header;
