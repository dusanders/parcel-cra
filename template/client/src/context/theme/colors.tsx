import { Log } from "../logger/logger";

interface IHslModel {
  h: number;
  s: number;
  l: number;
}
interface IRGBModel {
  r: number;
  g: number;
  b: number;
}
export interface HslColor {
  adjustLumen(scalar: number): HslColor;
  adjustHue(scalar: number): HslColor;
  adjustSaturation(scalar: number): HslColor;
  toHex(): string;
}
export class HslColorImpl implements HslColor {
  private tag = 'HslColorImpl';
  private rgb: IRGBModel;
  private hsl: IHslModel;
  constructor(hex: string) {
    this.tag += `_${hex}`;
    this.rgb = hexToRgb(hex);
    this.hsl = rgbToHsl(this.rgb.r, this.rgb.g, this.rgb.b);
  }
  adjustHue(scalar: number): HslColor {
  const newHue = ((this.hsl.h + scalar) % 360 + 360) % 360;
  Log.debug(this.tag, `Hue ${this.hsl.h} -> ${newHue}`);
  this.hsl.h = newHue;
    return this;
  }
  adjustLumen(scalar: number): HslColor {
    Log.debug(this.tag, `Lum: ${this.hsl.l} -> ${this.hsl.l * scalar}`)
    this.hsl.l *= scalar;
    return this;
  }
  adjustSaturation(scalar: number): HslColor {
    Log.debug(this.tag, `Sat: ${this.hsl.s} -> ${this.hsl.s * scalar}`);
    this.hsl.s *= scalar;
    return this;
  }
  toHex(): string {
    return hslToHexSimple(this.hsl.h, this.hsl.s, this.hsl.l);
  }
}

/**
 * Convert hex to rgb
 * @param hex 
 * @returns 
 */
function hexToRgb(hex: string): IRGBModel {
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
function rgbToHsl(r: number, g: number, b: number): IHslModel {
  // Normalize RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l =  (cmax + cmin) / 2;

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