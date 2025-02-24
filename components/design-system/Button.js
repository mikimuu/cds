import React from 'react';
import { colorTokens } from './ColorTokens';
import { getOptimalTextColor, getSemanticColor } from './ColorUtils';

const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
}) => {
  // バリアントに基づく背景色の決定
  const getBackgroundColor = () => {
    if (disabled) return colorTokens.neutral[300];
    
    switch (variant) {
      case 'primary':
        return colorTokens.primary[500];
      case 'secondary':
        return colorTokens.secondary[500];
      case 'success':
        return getSemanticColor('success');
      case 'warning':
        return getSemanticColor('warning');
      case 'error':
        return getSemanticColor('error');
      default:
        return colorTokens.primary[500];
    }
  };

  // サイズに基づくパディングとフォントサイズの決定
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const backgroundColor = getBackgroundColor();
  const textColor = getOptimalTextColor(backgroundColor);

  const baseClasses = `
    inline-flex
    items-center
    justify-center
    rounded-md
    font-medium
    transition-colors
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90'}
    ${getSizeClasses()}
  `;

  const style = {
    backgroundColor,
    color: textColor,
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`.trim()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button; 