import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  glow = 'none',
  onClick,
  ...props
}) => {
  const glowClasses = {
    none: '',
    purple: 'hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    cyan: 'hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]',
    gold: 'hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 ${
        hoverEffect ? 'glass-card-hover cursor-pointer' : ''
      } ${glowClasses[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
