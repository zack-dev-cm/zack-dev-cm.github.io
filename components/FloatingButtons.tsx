import React, { useEffect, useState } from 'react';
import { TelegramIcon } from './Icons';

interface FloatingButtonsProps {
  telegramUrl: string;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ telegramUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`floating-actions${isVisible ? ' is-visible' : ''}`} aria-hidden={!isVisible}>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on Telegram"
        tabIndex={isVisible ? 0 : -1}
        className="floating-action floating-action--telegram"
      >
        <TelegramIcon className="h-5 w-5" />
      </a>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={isVisible ? 0 : -1}
        className="floating-action"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};
