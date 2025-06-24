import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Card component for content blocks, uses blue/orange border and theme-aware backgrounds
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div
    className={`rounded-xl shadow-xl border border-blue-100 dark:border-blue-800 bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100 transition-all duration-300 p-6 ${className}`}
  >
    {children}
  </div>
);

export default Card; 