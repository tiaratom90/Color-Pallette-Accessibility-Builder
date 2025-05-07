/**
 * Utilities for adjusting colors to meet accessibility standards
 */

import { ColorResult, contrast, hexToRgb } from './contrastUtils';

/**
 * Convert hex to HSL color space
 */
export const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
  const rgb = hexToRgb(hex);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    
    h *= 60;
  }

  return { h, s, l };
};

/**
 * Convert HSL to hex color
 */
export const hslToHex = ({ h, s, l }: { h: number, s: number, l: number }): string => {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * Calculate the next accessibility level to target
 */
export const getTargetRatio = (currentRatio: number): number => {
  const ratio = parseFloat(currentRatio.toString());
  if (ratio < 3) return 3; // Target AA Large (3:1)
  if (ratio < 4.5) return 4.5; // Target AA (4.5:1)
  if (ratio < 7) return 7; // Target AAA (7:1)
  return 7; // Already at AAA
};

/**
 * Get the accessibility level name based on contrast ratio
 */
export const getAccessibilityLevelName = (ratio: number): string => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Not accessible';
};

/**
 * Suggest adjusted colors to meet accessibility standards
 * @param color1 Background color
 * @param color2 Text color
 * @param adjustBackground Whether to adjust the background color
 * @param specificTarget Optional target level to aim for
 * @returns Object containing suggested colors and new contrast ratio
 */
export const suggestAccessibleColors = (
  color1: string,
  color2: string,
  adjustBackground: boolean = false,
  specificTarget?: "AAA" | "AA" | "AA Large"
): { 
  suggestedColor1: string,
  suggestedColor2: string,
  newRatio: string,
  targetLevel: string
} => {
  // Calculate current contrast ratio
  const currentRatio = parseFloat(contrast(hexToRgb(color1), hexToRgb(color2)));
  
  // Determine target ratio based on specificTarget or next level
  let targetRatio: number;
  if (specificTarget) {
    if (specificTarget === "AAA") targetRatio = 7;
    else if (specificTarget === "AA") targetRatio = 4.5;
    else targetRatio = 3; // AA Large
  } else {
    targetRatio = getTargetRatio(currentRatio);
  }
  
  // Get target level name
  const targetLevel = specificTarget || getAccessibilityLevelName(targetRatio);
  
  // If already at maximum level, return unchanged
  if (currentRatio >= 7) {
    return {
      suggestedColor1: color1,
      suggestedColor2: color2,
      newRatio: currentRatio.toFixed(2),
      targetLevel
    };
  }
  
  // Convert colors to HSL for easier adjustment
  const hsl1 = hexToHSL(color1);
  const hsl2 = hexToHSL(color2);
  
  // Calculate luminance difference
  const lum1 = hsl1.l;
  const lum2 = hsl2.l;
  
  // Determine if we should lighten or darken the colors
  const needMoreContrast = targetRatio > currentRatio;
  
  let newHsl1 = { ...hsl1 };
  let newHsl2 = { ...hsl2 };
  let newRatio = currentRatio;
  
  // Step size for incremental adjustment
  const stepSize = 0.01;
  const maxIterations = 100; // Prevent infinite loops
  let iterations = 0;
  
  if (adjustBackground) {
    // Adjust background color
    while (newRatio < targetRatio && iterations < maxIterations) {
      if (lum1 > lum2) {
        // Background is lighter, make it even lighter
        newHsl1.l = Math.min(1, newHsl1.l + stepSize);
      } else {
        // Background is darker, make it even darker
        newHsl1.l = Math.max(0, newHsl1.l - stepSize);
      }
      
      const newColor1 = hslToHex(newHsl1);
      newRatio = parseFloat(contrast(hexToRgb(newColor1), hexToRgb(color2)));
      iterations++;
    }
  } else {
    // Adjust text color
    while (newRatio < targetRatio && iterations < maxIterations) {
      if (lum1 > lum2) {
        // Text is darker, make it even darker
        newHsl2.l = Math.max(0, newHsl2.l - stepSize);
      } else {
        // Text is lighter, make it even lighter
        newHsl2.l = Math.min(1, newHsl2.l + stepSize);
      }
      
      const newColor2 = hslToHex(newHsl2);
      newRatio = parseFloat(contrast(hexToRgb(color1), hexToRgb(newColor2)));
      iterations++;
    }
  }
  
  return {
    suggestedColor1: adjustBackground ? hslToHex(newHsl1) : color1,
    suggestedColor2: adjustBackground ? color2 : hslToHex(newHsl2),
    newRatio: newRatio.toFixed(2),
    targetLevel
  };
};
