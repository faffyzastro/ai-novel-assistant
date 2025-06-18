import React from 'react';

// Loader/Spinner component for async actions
const Loader: React.FC<{ size?: number; className?: string; color?: string }> = ({ size = 24, className = '', color }) => (
  <svg
    className={`animate-spin text-primary ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="status"
    aria-label="Loading"
    aria-busy="true"
    style={color ? { color } : {}}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export default Loader; 