import React from 'react';
import isotipoImg from '../assets/images/isotiposystex.jpg';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'isotipo-only';
}

interface IsotipoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Isotipo oficial de SysTex:
 * Emblema circular con aro exterior de neón cian (#00F0FF) y monograma "S" fluido
 * con núcleo brillante y halo resplandeciente sobre fondo oscuro.
 */
export const SysTexIsotipo: React.FC<IsotipoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size] || 'w-10 h-10';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${sizeClasses} ${className}`}
      title="SysTex Isotipo"
    >
      <img
        src={isotipoImg || "/images/isotiposystex.jpg"}
        alt="SysTex Isotipo"
        className="w-full h-full object-contain rounded-full drop-shadow-[0_0_12px_rgba(0,240,255,0.45)] border border-[#00F0FF]/30 transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('/images/isotiposystex.jpg')) {
            target.src = '/images/isotiposystex.jpg';
          }
        }}
      />
    </div>
  );
};

/**
 * SysTex Brand Lockup:
 * Isotipo oficial circular de neón cian + Wordmark metalizado "SysTex" y subtítulo.
 */
export const SysTexLogo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = true,
  subtitleText = 'DIGITAL SYSTEMS & WEB SOLUTIONS',
  size = 'md',
  variant = 'full',
}) => {
  const isotipoSize: IsotipoProps['size'] =
    size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

  const titleSize =
    size === 'sm'
      ? 'text-lg sm:text-xl'
      : size === 'lg'
        ? 'text-3xl'
        : 'text-2xl';

  const subSize =
    size === 'sm'
      ? 'text-[8px] sm:text-[8.5px] tracking-[0.18em]'
      : size === 'lg'
        ? 'text-[10px] tracking-[0.25em]'
        : 'text-[9px] tracking-[0.22em]';

  if (variant === 'isotipo-only') {
    return <SysTexIsotipo size={isotipoSize} className={className} />;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Nuevo Isotipo Oficial SysTex */}
      <SysTexIsotipo size={isotipoSize} />

      {/* Wordmark + Subtitle */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-headline font-bold tracking-tight flex items-baseline ${titleSize}`}>
          <span className="bg-gradient-to-b from-[#7EC6EE] via-[#4FACFE] to-[#0093E9] bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Sys
          </span>
          <span className="bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Tex
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-label text-[#8FA8BE] font-semibold uppercase mt-0.5 sm:mt-1 ${subSize}`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Monograma SysTex utilizado en paneles y badges administrativos
 * Actualizado al nuevo Isotipo circular de SysTex
 */
export const SysTexMonogram: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <SysTexIsotipo size="md" className="w-full h-full" />
    </div>
  );
};
