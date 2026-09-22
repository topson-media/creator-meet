import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  isDark = true,
}) => {
  const iconDimensions = {
    sm: { width: 32, height: 28 },
    md: { width: 44, height: 38 },
    lg: { width: 56, height: 48 },
    xl: { width: 72, height: 62 },
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact Vector Emblem based on the reference design */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 54 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="cyanGrad" x1="4" y1="2" x2="26" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="60%" stopColor="#0080FF" />
            <stop offset="100%" stopColor="#0055D4" />
          </linearGradient>
          <linearGradient id="magentaGrad" x1="28" y1="2" x2="50" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3399" />
            <stop offset="60%" stopColor="#FF147A" />
            <stop offset="100%" stopColor="#D9006C" />
          </linearGradient>
          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#FF147A" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Left Character (Cyan / Blue Figure with Play Button) */}
        {/* Head */}
        <circle cx="16" cy="11" r="7" fill="url(#cyanGrad)" />
        {/* Curved Body / Torso leaning right */}
        <path
          d="M 5 38 C 5 24, 12 21, 21 21 C 24.5 21, 26 23.5, 26 27 C 26 33, 19 40, 9 40 C 6.5 40, 5 39.5, 5 38 Z"
          fill="url(#cyanGrad)"
        />
        {/* Play Icon Inside Left Figure */}
        <polygon points="12,28 12,35 18,31.5" fill="#FFFFFF" />

        {/* Right Character (Magenta / Pink Figure embracing) */}
        {/* Head */}
        <circle cx="38" cy="11" r="7" fill="url(#magentaGrad)" />
        {/* Curved Body / Torso leaning left */}
        <path
          d="M 49 38 C 49 24, 42 21, 33 21 C 29.5 21, 28 23.5, 28 27 C 28 33, 35 40, 45 40 C 47.5 40, 49 39.5, 49 38 Z"
          fill="url(#magentaGrad)"
        />
      </svg>

      {/* Typography: "Creator Meet" */}
      {showText && (
        <span className={`font-bold tracking-tight ${textSizes} leading-none flex items-center`}>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>Creator</span>
          <span className="text-[#FF2E93] ml-1.5 font-extrabold">Meet</span>
        </span>
      )}
    </div>
  );
};
