import * as stylex from "@stylexjs/stylex";

export const backgroundImage = stylex.create({
  none: { backgroundImage: "none" },
  gradient_to_t: {
    backgroundImage: "linear-gradient(to top, var(--tw-gradient-stops))",
  },
  gradient_to_tr: {
    backgroundImage:
      "linear-gradient(to top right, var(--tw-gradient-stops))",
  },
  gradient_to_r: {
    backgroundImage: "linear-gradient(to right, var(--tw-gradient-stops))",
  },
  gradient_to_br: {
    backgroundImage:
      "linear-gradient(to bottom right, var(--tw-gradient-stops))",
  },
  gradient_to_b: {
    backgroundImage: "linear-gradient(to bottom, var(--tw-gradient-stops))",
  },
  gradient_to_bl: {
    backgroundImage:
      "linear-gradient(to bottom left, var(--tw-gradient-stops))",
  },
  gradient_to_l: {
    backgroundImage: "linear-gradient(to left, var(--tw-gradient-stops))",
  },
  gradient_to_tl: {
    backgroundImage:
      "linear-gradient(to top left, var(--tw-gradient-stops))",
  },
});
