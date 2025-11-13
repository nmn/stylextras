import * as stylex from "@stylexjs/stylex";

export const backdropFilter = stylex.create({
  // Blur
  blur_none: { backdropFilter: "blur(0)" },
  blur_sm: { backdropFilter: "blur(4px)" },
  blur: { backdropFilter: "blur(8px)" },
  blur_md: { backdropFilter: "blur(12px)" },
  blur_lg: { backdropFilter: "blur(16px)" },
  blur_xl: { backdropFilter: "blur(24px)" },
  blur_2xl: { backdropFilter: "blur(40px)" },
  blur_3xl: { backdropFilter: "blur(64px)" },

  // Brightness
  brightness_0: { backdropFilter: "brightness(0)" },
  brightness_50: { backdropFilter: "brightness(.5)" },
  brightness_75: { backdropFilter: "brightness(.75)" },
  brightness_90: { backdropFilter: "brightness(.9)" },
  brightness_95: { backdropFilter: "brightness(.95)" },
  brightness_100: { backdropFilter: "brightness(1)" },
  brightness_105: { backdropFilter: "brightness(1.05)" },
  brightness_110: { backdropFilter: "brightness(1.1)" },
  brightness_125: { backdropFilter: "brightness(1.25)" },
  brightness_150: { backdropFilter: "brightness(1.5)" },
  brightness_200: { backdropFilter: "brightness(2)" },

  // Contrast
  contrast_0: { backdropFilter: "contrast(0)" },
  contrast_50: { backdropFilter: "contrast(.5)" },
  contrast_75: { backdropFilter: "contrast(.75)" },
  contrast_100: { backdropFilter: "contrast(1)" },
  contrast_125: { backdropFilter: "contrast(1.25)" },
  contrast_150: { backdropFilter: "contrast(1.5)" },
  contrast_200: { backdropFilter: "contrast(2)" },

  // Grayscale
  grayscale_0: { backdropFilter: "grayscale(0)" },
  grayscale: { backdropFilter: "grayscale(1)" },

  // Hue Rotate
  hue_rotate_0: { backdropFilter: "hue-rotate(0deg)" },
  hue_rotate_15: { backdropFilter: "hue-rotate(15deg)" },
  hue_rotate_30: { backdropFilter: "hue-rotate(30deg)" },
  hue_rotate_60: { backdropFilter: "hue-rotate(60deg)" },
  hue_rotate_90: { backdropFilter: "hue-rotate(90deg)" },
  hue_rotate_180: { backdropFilter: "hue-rotate(180deg)" },

  // Invert
  invert_0: { backdropFilter: "invert(0)" },
  invert: { backdropFilter: "invert(1)" },

  // Opacity
  opacity_0: { backdropFilter: "opacity(0)" },
  opacity_5: { backdropFilter: "opacity(0.05)" },
  opacity_10: { backdropFilter: "opacity(0.1)" },
  opacity_20: { backdropFilter: "opacity(0.2)" },
  opacity_25: { backdropFilter: "opacity(0.25)" },
  opacity_30: { backdropFilter: "opacity(0.3)" },
  opacity_40: { backdropFilter: "opacity(0.4)" },
  opacity_50: { backdropFilter: "opacity(0.5)" },
  opacity_60: { backdropFilter: "opacity(0.6)" },
  opacity_70: { backdropFilter: "opacity(0.7)" },
  opacity_75: { backdropFilter: "opacity(0.75)" },
  opacity_80: { backdropFilter: "opacity(0.8)" },
  opacity_90: { backdropFilter: "opacity(0.9)" },
  opacity_95: { backdropFilter: "opacity(0.95)" },
  opacity_100: { backdropFilter: "opacity(1)" },

  // Saturate
  saturate_0: { backdropFilter: "saturate(0)" },
  saturate_50: { backdropFilter: "saturate(.5)" },
  saturate_100: { backdropFilter: "saturate(1)" },
  saturate_150: { backdropFilter: "saturate(1.5)" },
  saturate_200: { backdropFilter: "saturate(2)" },

  // Sepia
  sepia_0: { backdropFilter: "sepia(0)" },
  sepia: { backdropFilter: "sepia(1)" },
});

