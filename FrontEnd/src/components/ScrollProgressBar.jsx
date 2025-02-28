import React, { useState, useEffect } from 'react';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Función para calcular el progreso del scroll
  const calculateScrollProgress = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', calculateScrollProgress);
    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div
        className="h-2 bg-gradient-to-r from-[#1E40AF] to-[#9333EA]"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgressBar;