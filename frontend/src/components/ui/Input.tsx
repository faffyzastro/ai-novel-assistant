import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Reusable Input component with label and error display, blue/orange color scheme
const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="mb-5">
    {label && <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200 pl-1">{label}</label>}
    <input
      className={`w-full px-4 py-2 rounded-xl shadow focus:outline-none border transition-all duration-300
        bg-white dark:bg-blue-950 text-gray-900 dark:text-gray-100
        focus:border-blue-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-gray-200 dark:border-blue-800'}
        ${className}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${props.name}-error` : undefined}
      {...props}
    />
    {error && <p id={`${props.name}-error`} className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
  </div>
);

export default Input; 