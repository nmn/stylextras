import * as stylex from "@stylexjs/stylex";

export const filter = stylex.create({
  // Blur
  blur_none: { filter: "blur(0)" },
  blur_sm: { filter: "blur(4px)" },
  blur: { filter: "blur(8px)" },
  blur_md: { filter: "blur(12px)" },
  blur_lg: { filter: "blur(16px)" },
  blur_xl: { filter: "blur(24px)" },
  blur_2xl: { filter: "blur(40px)" },
  blur_3xl: { filter: "blur(64px)" },

  // Brightness
  brightness_0: { filter: "brightness(0)" },
  brightness_50: { filter: "brightness(.5)" },
  brightness_75: { filter: "brightness(.75)" },
  brightness_90: { filter: "brightness(.9)" },
  brightness_95: { filter: "brightness(.95)" },
  brightness_100: { filter: "brightness(1)" },
  brightness_105: { filter: "brightness(1.05)" },
  brightness_110: { filter: "brightness(1.1)" },
  brightness_125: { filter: "brightness(1.25)" },
  brightness_150: { filter: "brightness(1.5)" },
  brightness_200: { filter: "brightness(2)" },

  // Contrast
  contrast_0: { filter: "contrast(0)" },
  contrast_50: { filter: "contrast(.5)" },
  contrast_75: { filter: "contrast(.75)" },
  contrast_100: { filter: "contrast(1)" },
  contrast_125: { filter: "contrast(1.25)" },
  contrast_150: { filter: "contrast(1.5)" },
  contrast_200: { filter: "contrast(2)" },

  // Grayscale
  grayscale_0: { filter: "grayscale(0)" },
  grayscale: { filter: "grayscale(1)" },

  // Hue Rotate
  hue_rotate_0: { filter: "hue-rotate(0deg)" },
  hue_rotate_15: { filter: "hue-rotate(15deg)" },
  hue_rotate_30: { filter: "hue-rotate(30deg)" },
  hue_rotate_60: { filter: "hue-rotate(60deg)" },
  hue_rotate_90: { filter: "hue-rotate(90deg)" },
  hue_rotate_180: { filter: "hue-rotate(180deg)" },

  // Invert
  invert_0: { filter: "invert(0)" },
  invert: { filter: "invert(1)" },

  // Saturate
  saturate_0: { filter: "saturate(0)" },
  saturate_50: { filter: "saturate(.5)" },
  saturate_100: { filter: "saturate(1)" },
  saturate_150: { filter: "saturate(1.5)" },
  saturate_200: { filter: "saturate(2)" },

  // Sepia
  sepia_0: { filter: "sepia(0)" },
  sepia: { filter: "sepia(1)" },

  // Drop Shadow
  drop_shadow_none: { filter: "drop-shadow(0 0 #0000)" },
  drop_shadow_sm: { filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05))" },
  drop_shadow: {
    filter:
      "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06))",
  },
  drop_shadow_md: {
    filter:
      "drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06))",
  },
  drop_shadow_lg: {
    filter:
      "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
  },
  drop_shadow_xl: {
    filter:
      "drop-shadow(0 20px 13px rgba(0, 0, 0, 0.03)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.08))",
  },
  drop_shadow_2xl: {
    filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))",
  },
});

