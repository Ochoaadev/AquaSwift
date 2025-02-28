import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para manejar el scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Función para volver arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-primary-100 text-white rounded-full p-3 lg:p-4 md:p-3 sm:p-2 hover:bg-primary-200 transition-colors duration-200 opacity-80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 lg:h-6 lg:w-6 md:h-6 md:w-6 sm:h-5 sm:w-5 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;