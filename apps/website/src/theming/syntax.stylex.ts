import * as stylex from '@stylexjs/stylex';
import { colors } from '@stylextras/ui/tokens/color.stylex';

const mix = (base: string, blend: string, weight: number) =>
  `color-mix(in oklab, ${base} ${weight}%, ${blend})`;

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

const rotateAccent = (offset: string) =>
  `oklch(from ${colors.accentText} l calc(c * 0.78) calc(h ${offset}))`;

const readableAccent = () => mix(colors.accentText, colors.fg, 92);

const readableStatus = (color: string) =>
  mix(
    lightDark(
      `oklch(from ${color} min(l, 0.5) calc(c * 0.9) h)`,
      `oklch(from ${color} max(l, 0.78) calc(c * 0.9) h)`,
    ),
    colors.fg,
    92,
  );

/**
 * A semantic syntax palette derived from the active UI color theme. Rotated
 * accents provide distinct syntax roles while foreground mixes keep them
 * readable against both light and dark code surfaces.
 */
export const syntax = stylex.defineVars({
  '--syntax-background': 'transparent',
  '--syntax-foreground': colors.fgSoft,

  '--syntax-token-link': readableAccent(),
  '--syntax-token-string': mix(rotateAccent('+ 120'), colors.code, 72),
  '--syntax-token-comment': mix(colors.fgMuted, colors.fg, 70),
  '--syntax-token-constant': mix(rotateAccent('+ 180'), colors.fg, 88),
  '--syntax-token-keyword': readableAccent(),
  '--syntax-token-parameter': mix(rotateAccent('+ 55'), colors.fg, 82),
  '--syntax-token-function': mix(rotateAccent('- 55'), colors.fg, 88),
  '--syntax-token-string-expression': mix(
    rotateAccent('+ 145'),
    colors.code,
    70,
  ),
  '--syntax-token-punctuation': mix(colors.fgMuted, colors.fg, 70),
  '--syntax-token-inserted': readableStatus(colors.success),
  '--syntax-token-deleted': readableStatus(colors.danger),
  '--syntax-token-changed': readableStatus(colors.warning),

  '--syntax-ansi-black': colors.fgDisabled,
  '--syntax-ansi-red': readableStatus(colors.danger),
  '--syntax-ansi-green': readableStatus(colors.success),
  '--syntax-ansi-yellow': readableStatus(colors.warning),
  '--syntax-ansi-blue': mix(rotateAccent('- 55'), colors.fg, 88),
  '--syntax-ansi-magenta': readableAccent(),
  '--syntax-ansi-cyan': mix(rotateAccent('+ 180'), colors.fg, 88),
  '--syntax-ansi-white': colors.fgSoft,
  '--syntax-ansi-bright-black': colors.fgMuted,
  '--syntax-ansi-bright-red': mix(colors.danger, colors.fg, 72),
  '--syntax-ansi-bright-green': mix(colors.success, colors.fg, 72),
  '--syntax-ansi-bright-yellow': mix(colors.warning, colors.fg, 72),
  '--syntax-ansi-bright-blue': mix(rotateAccent('- 55'), colors.fg, 76),
  '--syntax-ansi-bright-magenta': mix(colors.accentText, colors.fg, 76),
  '--syntax-ansi-bright-cyan': mix(rotateAccent('+ 180'), colors.fg, 76),
  '--syntax-ansi-bright-white': colors.fg,
});
