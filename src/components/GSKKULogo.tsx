import React from 'react';

interface GSKKULogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GSKKULogo: React.FC<GSKKULogoProps> = ({ className = '', size = 'md' }) => {
  // Height sizing for clean crisp rendering of newLogo.png
  const heightClass = size === 'sm' ? 'h-10 sm:h-11' : size === 'lg' ? 'h-16 sm:h-20' : 'h-13 sm:h-15';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/newLogo.png"
        alt="Graduate School Khon Kaen University Logo"
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto object-contain drop-shadow-2xs transition-all`}
        loading="eager"
      />
    </div>
  );
};
