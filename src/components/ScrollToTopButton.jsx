import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = ({ scrollThreshold = 800 }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Sayfanın ne kadar kaydırıldığını kontrol eden fonksiyon
    const toggleVisibility = () => {
        if (window.scrollY > scrollThreshold) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Sayfayı en üste kaydıran fonksiyon
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", 
        });
    };

    // Event listener'ı ekler ve kaldırır
    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            title="Sayfanın Başına Dön"
            className={`fixed bottom-8 right-6 p-3 rounded-full bg-orange-500 text-white shadow-xl  hover:bg-orange-600 animate-bounce transition-all duration-500 ease-in-out z-50 focus:outline-none cursor-pointer
        ${isVisible
                    ? "opacity-100 translate-y-0" // Görünür olduğunda normal pozisyon
                    : "opacity-0 translate-y-20 pointer-events-none" // Gizlendiğinde 20px aşağı süzülme
                }
        `}
        >
            <FaArrowUp className="w-5 h-5" />
        </button>
    );
};
export default ScrollToTopButton;