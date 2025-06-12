import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  status?: 'online' | 'offline';
}

// Avatar component with fallback and status indicator
const Avatar: React.FC<AvatarProps & { loading?: boolean; name?: string }> = ({ src, alt = 'User avatar', size = 40, status, loading = false, name }) => {
  // Get initials from name
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '';
  return (
    <div className="relative inline-block bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full overflow-hidden" style={{ width: size, height: size }}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <svg className="animate-spin text-blue-400 dark:text-orange-400" width={size/2} height={size/2} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
        </div>
      ) : src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover border-none"
        />
      ) : initials ? (
        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-blue-700 dark:text-orange-200 bg-blue-100 dark:bg-blue-900">
          {initials}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-gray-300 dark:bg-blue-800">
          <span role="img" aria-label="User">👤</span>
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-blue-950
            ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
          title={status}
        />
      )}
    </div>
  );
};

export default Avatar; 