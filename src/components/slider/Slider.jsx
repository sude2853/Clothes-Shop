/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';

const Slider = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="slider">
            <div className="slider-elements">
                <div className={`slider-item fade`} key={currentIndex}>
                    <div className="slider-image">
                        <img
                            src={slides[currentIndex].image}
                            className="img-fluid"
                            alt="Slider"
                        />
                    </div>
                    <div className="container">
                        <p className="slider-title">
                            {slides[currentIndex].title}
                        </p>
                        <h2 className="slider-heading">
                            {slides[currentIndex].heading}
                        </h2>
                        <a href="#" className="btn btn-lg btn-primary">
                            ŞİMDİ KEŞFET
                        </a>
                    </div>
                </div>
                <div className="slider-buttons">
                    <button onClick={prevSlide}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button onClick={nextSlide}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>

                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`slider-dot ${
                                currentIndex === index ? 'active' : ''
                            }`}
                            onClick={() => goToSlide(index)}
                        >
                            <span></span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Slider;
