import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg font-medium',
    xl: 'w-24 h-24 text-2xl font-semibold',
  };

  const getInitials = (str: string) => {
    if (!str) return 'EM';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Deterministic soft background based on name
  const getBackgroundColor = (str: string) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-teal-100 text-teal-700 border-teal-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-amber-100 text-amber-700 border-amber-200',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`rounded-full object-cover border border-gray-200 shadow-sm ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium border select-none ${getBackgroundColor(
        name
      )} ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
