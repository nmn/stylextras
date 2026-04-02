import * as stylex from '@stylexjs/stylex';

const calc = (expression: string) => `calc(${expression})`;

const multiply = (value: string, factor: number) =>
  calc(`${value} * ${factor}`);

export const motion_core = stylex.defineVars({
  durationBase: '140ms',
  easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
});

export const motion_derived = stylex.defineVars({
  durationInstant: '0ms',
  durationFast: motion_core.durationBase,
  durationModerate: multiply(motion_core.durationBase, 1.5),
  durationSlow: multiply(motion_core.durationBase, 2.25),
  durationSlower: multiply(motion_core.durationBase, 3),
});

export const motion = stylex.defineConsts({
  durationBase: motion_core.durationBase,
  durationInstant: motion_derived.durationInstant,
  durationFast: motion_derived.durationFast,
  durationModerate: motion_derived.durationModerate,
  durationSlow: motion_derived.durationSlow,
  durationSlower: motion_derived.durationSlower,
  easeStandard: motion_core.easeStandard,
  easeEmphasized: motion_core.easeEmphasized,
});
