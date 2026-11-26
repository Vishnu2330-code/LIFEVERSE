import React from 'react';

export const Badge = ({
  children,
  variant = 'purple',
  size = 'sm',
  className = '',
  icon: Icon,
}) => {
  const variantClasses = {
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    red: 'bg-red-500/10 text-red-300 border-red-500/30',
    slate: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
