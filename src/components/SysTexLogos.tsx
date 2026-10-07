import React from 'react';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Recreates the exact SysTex 3D Hexagonal Network Cube + Metallic Wordmark
 * from Images 1, 2, 5, and 8.
 */
export const SysTexLogo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = true,
  subtitleText = 'DIGITAL SYSTEMS & WEB SOLUTIONS',
  size = 'md',
}) => {
  const iconDimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
        ? 'text-3xl'
        : 'text-2xl';
  const subSize =
    size === 'sm'
      ? 'text-[8px] tracking-[0.18em]'
      : size === 'lg'
        ? 'text-[10px] tracking-[0.25em]'
        : 'text-[9px] tracking-[0.22em]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Hexagon Cube Node Icon (Image 1 & 2) */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(58,109,140,0.55)]"
        >
          <defs>
            <linearGradient id="systexHexBg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F89AD" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#2D5A7B" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1B394E" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="systexHexStroke" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#97CDF4" />
              <stop offset="50%" stopColor="#4A83A8" />
              <stop offset="100%" stopColor="#2C5673" />
            </linearGradient>
          </defs>
          {/* Outer Hexagon */}
          <polygon
            points="32,4 57,18.5 57,45.5 32,60 7,45.5 7,18.5"
            fill="url(#systexHexBg)"
            stroke="url(#systexHexStroke)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Inner Hexagon Wireframe */}
          <polygon
            points="32,12 50,22.5 50,41.5 32,52 14,41.5 14,22.5"
            fill="none"
            stroke="#7BB4DC"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Isometric Y-Axes from Center to 3 Vertices */}
          <line x1="32" y1="32" x2="32" y2="6" stroke="#6CA6CE" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="32" x2="55" y2="44.5" stroke="#6CA6CE" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="32" x2="9" y2="44.5" stroke="#6CA6CE" strokeWidth="2.5" strokeLinecap="round" />
          {/* Center Hub Node */}
          <circle cx="32" cy="32" r="5" fill="#3A6D8C" stroke="#97CDF4" strokeWidth="1.8" />
          {/* 3 Glowing White Vertex Nodes */}
          <circle cx="32" cy="6" r="3.2" fill="#FFFFFF" />
          <circle cx="55" cy="44.5" r="3.2" fill="#FFFFFF" />
          <circle cx="9" cy="44.5" r="3.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark + Subtitle */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-headline font-bold tracking-tight flex items-baseline ${titleSize}`}>
          <span className="bg-gradient-to-b from-[#6FA8CC] via-[#4980A3] to-[#346280] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Sys
          </span>
          <span className="bg-gradient-to-b from-[#FFFFFF] via-[#DCE2E9] to-[#AAB4C0] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Tex
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-label text-[#8FA8BE] font-semibold uppercase mt-1 ${subSize}`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Recreates the Metallic S-T Monogram Emblem from Image 7 & Image 9
 */
export const SysTexMonogram: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  return (
    <div
      className={`relative rounded-xl bg-[#1E2228] border border-[#2E343D] flex items-center justify-center p-1.5 shadow-inner ${className}`}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="stMetal" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="45%" stopColor="#7FAECF" />
            <stop offset="100%" stopColor="#285575" />
          </linearGradient>
        </defs>
        {/* Geometric S-T Hex Monogram */}
        <path
          d="M32 6L54 19V25H36V56H28V25H16L32 14L44 21M14 23L50 43L32 55L14 44V37L26 44"
          stroke="url(#stMetal)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
