import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  className = '',
  size = 'md',
}) => {
  const isDark = variant === 'dark';
  const markSrc = isDark ? '/alishan-mark-dark.png' : '/alishan-mark.png';

  // Responsive icon height
  const iconHeight =
    size === 'sm'
      ? 'h-8 sm:h-9'
      : size === 'lg'
      ? 'h-11 sm:h-13'
      : 'h-9 xs:h-10 sm:h-11 md:h-12';

  // Responsive typography sizes
  const titleSize =
    size === 'sm'
      ? 'text-[15px] sm:text-[17px]'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-[16px] xs:text-[18px] sm:text-[21px] md:text-[23px]';

  const subtitleSize =
    size === 'sm'
      ? 'text-[7.5px] sm:text-[8.5px]'
      : size === 'lg'
      ? 'text-[10px] sm:text-[11px]'
      : 'text-[8.5px] xs:text-[9.5px] sm:text-[10.5px]';

  return (
    <div className={`flex items-center gap-2 xs:gap-2.5 sm:gap-3 select-none shrink-0 ${className}`}>
      {/* 1. Official Logo Mark (Lamp + Sofa + Plant) */}
      <img
        src={markSrc}
        alt="ALISHAN FURNITURES"
        className={`${iconHeight} w-auto object-contain shrink-0 transition-transform group-hover:scale-105 duration-200`}
        loading="eager"
        decoding="async"
      />

      {/* 2. Beside it: Store Name — ALISHAN FURNITURES */}
      <div className="flex flex-col justify-center min-w-0 leading-none">
        <span
          className={`font-serif font-extrabold tracking-[0.04em] uppercase leading-none transition-colors ${titleSize} ${
            isDark ? 'text-white' : 'text-walnut-950 group-hover:text-walnut-800'
          }`}
        >
          ALISHAN
        </span>
        <span
          className={`font-sans font-semibold tracking-[0.24em] uppercase leading-tight mt-1 transition-colors ${subtitleSize} ${
            isDark ? 'text-sand-300' : 'text-walnut-600'
          }`}
        >
          FURNITURES
        </span>
      </div>
    </div>
  );
};
