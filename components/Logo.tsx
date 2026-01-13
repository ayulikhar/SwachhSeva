import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div
      role="img"
      aria-label="SwachhSeva Logo"
      className={`
        ${sizeClasses[size]}
        bg-gradient-primary
        rounded-2xl
        shadow-medium
        flex items-center justify-center
        overflow-hidden
        select-none
        ${className}
      `}
    >
      <img
        src="/logo.svg"
        alt="SwachhSeva"
        className="w-full h-full object-contain p-1"
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src =
            'data:image/svg+xml;utf8,\
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\
              <circle cx="12" cy="12" r="12" fill="%231E8E3E"/>\
              <path d="M12 6l2.5 5.2L20 12l-4 3.8 1 5.2L12 18l-5 3 1-5.2L4 12l5.5-.8L12 6z" fill="white"/>\
            </svg>';
        }}
        draggable={false}
      />
    </div>
  );
};
