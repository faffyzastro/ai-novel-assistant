import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Modal component with overlay, close button, animation, focus trap, and blue/orange color scheme
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    first?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      <div
        ref={modalRef}
        className="max-w-lg w-full p-8 relative transition-all duration-300 ease-in-out transform scale-100 opacity-100 animate-fadeIn
          bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl border border-blue-100 dark:border-blue-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-600 hover:text-orange-400 dark:text-orange-400 dark:hover:text-orange-300 text-2xl font-bold rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 transition-all duration-300"
          aria-label="Close"
        >
          &times;
        </button>
        {title && <h3 id="modal-title" className="text-xl font-bold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal;

// Add fadeIn animation to Tailwind (in tailwind.config.js):
// extend: { animation: { fadeIn: 'fadeIn 0.3s ease-in-out' }, keyframes: { fadeIn: { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } } } } 