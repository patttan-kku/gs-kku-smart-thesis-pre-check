import React from 'react';

interface MascotVisualProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MascotVisual: React.FC<MascotVisualProps> = ({ className = '', size = 'md' }) => {
  // Width bounds: 180px–220px on desktop, auto-scaling cleanly
  const widthClass =
    size === 'sm'
      ? 'w-36 sm:w-40'
      : size === 'lg'
      ? 'w-48 sm:w-52 lg:w-[220px]'
      : 'w-40 sm:w-44 lg:w-[195px]';

  return (
    <div
      id="mascot-ethesis-sniper"
      className={`relative inline-flex flex-col items-center justify-end select-none pointer-events-none transition-transform duration-300 ${className}`}
      style={{ background: 'transparent' }}
    >
      {/* 3D E-Thesis SNIPER Mascot Image Asset (Transparent WebP/PNG) */}
      <img
        src="/mascot_sniper.webp"
        alt="E-Thesis SNIPER"
        referrerPolicy="no-referrer"
        className={`${widthClass} h-auto max-h-[270px] object-contain drop-shadow-md`}
        loading="eager"
      />

      {/* Subtle Soft Ambient Ground Shadow under feet */}
      <div className="w-24 sm:w-28 lg:w-32 h-2 bg-stone-900/15 dark:bg-black/40 rounded-full blur-[3px] -mt-1" />
    </div>
  );
};

