import { createCssVariablesTheme } from 'shiki/core';

const codeHighlightTheme = createCssVariablesTheme({
  name: 'stylextras-syntax',
  variablePrefix: '--syntax-',
});

/**
 * Shiki assigns syntax roles at build time and leaves their colors to the
 * active StyleX theme at runtime.
 */
export const codeHighlightThemes = {
  theme: codeHighlightTheme,
};
