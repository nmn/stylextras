import * as stylex from "@stylexjs/stylex";

export const boxShadow = stylex.create({
  shadow_xs: { boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)" },
  shadow_sm: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
  shadow: {
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  shadow_md: {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  shadow_lg: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  shadow_xl: {
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  shadow_2xl: {
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  shadow_inner: { boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)" },
  shadow_outline: { boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)" },
  shadow_none: { boxShadow: "none" },
  ring_offset: {
    boxShadow:
      "0 0 0 var(--ring-offset-width) var(--ring-offset-color), var(--ring-shadow)",
  },
  ring_0: {
    boxShadow:
      "var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
  },
  ring_1: {
    boxShadow:
      "var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
  },
  ring_2: {
    boxShadow:
      "var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
  },
  ring: {
    boxShadow:
      "var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
  },
  ring_4: {
    boxShadow:
      "var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
  },
  ring_8: {
    boxShadow:
      "var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
  },
});
