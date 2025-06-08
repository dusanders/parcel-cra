
export function useThemeHelpers(isDarkTheme: boolean, baseColor: string) {
  const getHsl = () => {
    const baseRgb = hexToRgb(baseColor);
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    return baseHsl
  }
  
  const calcHeaderBg = () => {
    let headerBg = getHsl()
    if (isDarkTheme) {
      headerBg.l *= 0.2
    } else {
      headerBg.l *= 0.5
    }
    return hslToHexSimple(headerBg.h, headerBg.s, headerBg.l);
  }
  const calcContentBg = () => {
    let contentBg = getHsl();
    if(isDarkTheme) {
      contentBg.l *= 0.5;
    } else {
      contentBg.l *= 0.8;
    }
    contentBg.s *= 0.2;
    return hslToHexSimple(contentBg.h, contentBg.s, contentBg.l);
  }
  return {
    headerBg: calcHeaderBg(),
    contentBg: calcContentBg()
  }
}

/**
 * Convert hex to rgb
 * @param hex 
 * @returns 
 */
function hexToRgb(hex: string): {
  r: number, g: number, b: number
} {
  // Remove the hash if it exists
  hex = hex.replace("#", "");

  //Handle short hex codes (e.g., #abc)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values to decimal
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}
/**
 * Convert rgb to hsl
 * @param r 
 * @param g 
 * @param b 
 * @returns 
 */
function rgbToHsl(r: number, g: number, b: number): {
  h: number, s: number, l: number
} {
  // Normalize RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = cmax;

  if (delta !== 0) {
    // Hue calculation
    if (cmax === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (cmax === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }

    // Saturation calculation
    if (cmax !== 0) {
      s = delta / cmax;
    }
  }

  // Ensure hue is non-negative
  if (h < 0) {
    h += 360;
  }

  return { h, s, l };
}
/**
 * Converts HSL values to a hex color string.
 * @param h Hue (0-360)
 * @param s Saturation (0-1)
 * @param l Lightness (0-1)
 * @returns Hex color string (e.g., "#aabbcc")
 */
function hslToHexSimple(h: number, s: number, l: number): string {
  l = Math.max(0, Math.min(1, l));
  s = Math.max(0, Math.min(1, s));
  h = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}