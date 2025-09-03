import React, { useState, useEffect } from 'react';
import { TelegramIcon } from './Icons';

interface FloatingButtonsProps {
  telegramUrl: string;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ telegramUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on Telegram"
        className={`fixed bottom-6 left-6 z-40 p-3 rounded-full bg-sky-500 text-white shadow-lg transition-opacity duration-300 hover:bg-sky-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <TelegramIcon className="h-6 w-6" />
      </a>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-700 text-white shadow-lg transition-opacity duration-300 hover:bg-slate-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
};
