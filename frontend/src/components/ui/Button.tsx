import React from 'react';

// ButtonProps allows for custom text, click handler, and optional styling.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger'; // Added 'danger' for destructive actions
  icon?: React.ReactNode;
}

// Reusable Button component with Tailwind styling, variant support, and micro-interactions.
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  // Define base and variant styles using Tailwind classes
  const base = 'inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300 ease-in-out active:scale-95';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600',
    secondary: 'bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-600 focus-visible:ring-orange-400 dark:bg-orange-500 dark:hover:bg-orange-400 dark:active:bg-orange-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400 dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-800',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 