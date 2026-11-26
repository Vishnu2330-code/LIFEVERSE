import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080B14] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white shadow-lg shadow-purple-500/25 focus:ring-[#8B5CF6]',
    secondary:
      'bg-[#171E30] hover:bg-[#1E2740] text-[#F8FAFC] border border-slate-700/60 focus:ring-slate-500',
    cyan:
      'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#22D3EE] hover:to-[#06B6D4] text-[#080B14] font-semibold shadow-lg shadow-cyan-500/25 focus:ring-[#22D3EE]',
    gold:
      'bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#080B14] font-bold shadow-lg shadow-amber-500/30 focus:ring-[#FBBF24]',
    outline:
      'border border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 text-[#A78BFA] focus:ring-[#8B5CF6]',
    ghost:
      'hover:bg-slate-800/50 text-[#94A3B8] hover:text-[#F8FAFC] focus:ring-slate-700',
    danger:
      'bg-red-600/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 focus:ring-red-500',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </button>
  );
};

export default Button;
