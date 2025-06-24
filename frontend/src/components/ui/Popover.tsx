import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  button: React.ReactNode;
  children: React.ReactNode;
}

// Popover component for floating content, accessible, closes on outside click, and traps focus
const Popover: React.FC<PopoverProps> = ({ button, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus trap and Escape key handler
  useEffect(() => {
    if (!open) return;
    const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
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
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button onClick={() => setOpen((v) => !v)}>{button}</button>
      <div
        ref={contentRef}
        className={`absolute z-50 mt-2 p-4 bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded shadow-lg min-w-[200px] transition-all duration-200 ease-in-out transform origin-top-right ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        {/* Arrow */}
        <span className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-blue-950 border-l border-t border-blue-200 dark:border-blue-800 rotate-45 z-0" />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

export default Popover; 