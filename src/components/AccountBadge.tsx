import React from 'react';
import { UserRole } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface AccountBadgeProps {
  role: UserRole | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const AccountBadge: React.FC<AccountBadgeProps> = ({
  role,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const isCreator = role.toLowerCase() === 'creator' || role.toLowerCase() === 'content creator';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  if (isCreator) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-semibold border transition-colors shadow-xs ${
          sizeClasses[size]
        } bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-purple-500/15 border-pink-500/35 text-pink-300 ${className}`}
      >
        {showIcon && <Sparkles size={iconSizes[size]} className="text-[#FF2E93]" />}
        <span>C Creator</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border transition-colors shadow-xs ${
        sizeClasses[size]
      } bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-cyan-500/15 border-cyan-500/35 text-cyan-300 ${className}`}
    >
      {showIcon && <Heart size={iconSizes[size]} className="text-[#00D2FF] fill-[#00D2FF]/20" />}
      <span>Fan</span>
    </span>
  );
};
