import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}

// Dropdown component with accessible menu and blue/orange color scheme
const Dropdown: React.FC<DropdownProps> = ({ label, children, compact = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        className={`rounded-xl font-semibold border-2 border-blue-600 dark:border-orange-400 bg-blue-600 text-white hover:bg-orange-400 dark:bg-orange-400 dark:text-white dark:hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400 dark:focus-visible:ring-blue-400 transition-all duration-200 shadow-lg ${compact ? 'text-[11px] px-2 py-1' : 'px-3 py-2'}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        {/* Dropdown arrow */}
        <svg className={`ml-2 inline-block transition-transform duration-200 ${open ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7 7l3 3 3-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
      </button>
      <div
        ref={contentRef}
        className={`absolute right-0 mt-2 w-48 bg-blue-50 dark:bg-orange-900 border border-blue-200 dark:border-orange-400 rounded shadow-lg z-50 transition-all duration-200 origin-top-right transform ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{ minWidth: 180 }}
      >
        {/* Arrow */}
        <span className="absolute -top-2 right-4 w-4 h-4 bg-blue-50 dark:bg-orange-900 border-l border-t border-blue-200 dark:border-orange-400 rotate-45 z-0" />
        <div className="py-1 relative z-10">{children}</div>
      </div>
    </div>
  );
};

// Dropdown.Item for menu items
interface DropdownItemProps extends React.ComponentProps<'button'> {
  compact?: boolean;
}
export const DropdownItem: React.FC<DropdownItemProps> = ({ children, className = '', compact = false, ...props }) => (
  <button
    className={`w-full text-left font-semibold rounded-lg border-2 border-transparent bg-white dark:bg-blue-950 text-blue-700 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-blue-700 hover:text-blue-900 dark:hover:text-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 dark:focus-visible:ring-blue-400 transition-all duration-200 ${compact ? 'text-[11px] px-2 py-1' : 'text-base px-4 py-3'} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Dropdown; 