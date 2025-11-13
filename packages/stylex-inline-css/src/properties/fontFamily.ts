import * as stylex from "@stylexjs/stylex";

export const fontFamily = stylex.create({
  serif: { fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  mono: {
    fontFamily:
      'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  system_ui: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
});
