
export const luminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
};

export const hexToRgb = (hex: string) => {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(h => h + h).join('');
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

export const contrast = (rgb1: number[], rgb2: number[]) => {
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
};

export const calculateColorContrast = (colors: string[], includeBW: boolean = true) => {
  const validColors = colors.filter(color => /^#[0-9A-Fa-f]{6}$/.test(color));
  
  if (validColors.length < 1) {
    return { results: {}, accessibilityGroups: null, passCounts: null };
  }

  // Only include black and white if includeBW is true
  const allColors = includeBW 
    ? ['#FFFFFF', '#000000', ...validColors]
    : [...validColors];
    
  const results: Record<string, Record<string, ColorResult>> = {};
  let passCounts = { aaa: 0, aa: 0, aaLarge: 0, total: 0 };
  
  const accessibilityGroups = {
    aaa: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
    aa: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
    aaLarge: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
    failed: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
  };

  validColors.forEach(color1 => {
    results[color1] = {};
    allColors.forEach(color2 => {
      if (color1 === color2) return;

      const ratio = contrast(hexToRgb(color1), hexToRgb(color2));
      const numRatio = parseFloat(ratio);
      
      results[color1][color2] = {
        ratio,
        level: {
          aaa: numRatio >= 7,
          aa: numRatio >= 4.5,
          aaLarge: numRatio >= 3,
        }
      };

      passCounts.total++;
      if (numRatio >= 7) {
        passCounts.aaa++;
        accessibilityGroups.aaa.push({ color1, color2, result: results[color1][color2] });
      } else if (numRatio >= 4.5) {
        passCounts.aa++;
        accessibilityGroups.aa.push({ color1, color2, result: results[color1][color2] });
      } else if (numRatio >= 3) {
        passCounts.aaLarge++;
        accessibilityGroups.aaLarge.push({ color1, color2, result: results[color1][color2] });
      } else {
        accessibilityGroups.failed.push({ color1, color2, result: results[color1][color2] });
      }
    });
  });

  return { results, accessibilityGroups, passCounts };
};

export interface Level {
  aaa: boolean;
  aa: boolean;
  aaLarge: boolean;
}

export interface ColorResult {
  ratio: string;
  level: Level;
}

export interface SummaryType {
  aaa: number;
  aa: number;
  aaLarge: number;
  total: number;
}

export interface AccessibilityGroups {
  aaa: Array<{ color1: string; color2: string; result: ColorResult }>;
  aa: Array<{ color1: string; color2: string; result: ColorResult }>;
  aaLarge: Array<{ color1: string; color2: string; result: ColorResult }>;
  failed: Array<{ color1: string; color2: string; result: ColorResult }>;
}
