import * as stylex from "@stylexjs/stylex";

export const transitionProperty = stylex.create({
  transition: {
    transitionProperty:
      "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
  },
  transition_all: { transitionProperty: "all" },
  transition_colors: {
    transitionProperty:
      "color, background-color, border-color, text-decoration-color, fill, stroke",
  },
  transition_opacity: { transitionProperty: "opacity" },
  transition_shadow: { transitionProperty: "box-shadow" },
  transition_transform: { transitionProperty: "transform" },
  transition_none: { transitionProperty: "none" },
});
