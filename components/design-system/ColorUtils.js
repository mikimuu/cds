import { colorTokens } from './ColorTokens';

// コントラスト比を計算する関数
export const calculateContrastRatio = (foreground, background) => {
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return null;

  const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                (Math.min(fgLuminance, bgLuminance) + 0.05);

  return ratio;
};

// アクセシビリティレベルを確認する関数
export const checkAccessibility = (contrastRatio) => {
  if (contrastRatio >= 7) return 'AAA';
  if (contrastRatio >= 4.5) return 'AA';
  if (contrastRatio >= 3) return 'AA Large';
  return 'Fail';
};

// セマンティックカラーを取得する関数
export const getSemanticColor = (type, variant = 'main') => {
  return colorTokens.semantic[type]?.[variant] || null;
};

// テキストカラーを取得する関数
export const getTextColor = (type) => {
  return colorTokens.text[type] || colorTokens.text.primary;
};

// 背景色に基づいて最適なテキストカラーを取得する関数
export const getOptimalTextColor = (backgroundColor) => {
  const whiteContrast = calculateContrastRatio('#FFFFFF', backgroundColor);
  const blackContrast = calculateContrastRatio('#000000', backgroundColor);
  
  return whiteContrast > blackContrast ? '#FFFFFF' : colorTokens.text.primary;
}; 