import * as stylex from '@stylexjs/stylex';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { blurThemes } from '../dist/blur-themes/index.js';
import { colorThemes } from '../dist/color-themes/index.js';
import { elevationThemes } from '../dist/elevation-themes/index.js';
import { motionThemes } from '../dist/motion-themes/index.js';
import { radiusThemes } from '../dist/radius-themes/index.js';
import { spacingThemes } from '../dist/spacing-themes/index.js';
import {
  stylePresets,
  stylePresetThemes,
} from '../dist/style-presets/index.js';
import { strokeThemes } from '../dist/stroke-themes/index.js';
import { typographyThemes } from '../dist/typography-themes/index.js';
import type { ButtonProps } from '../src/button';
import type { OptionProps, SelectProps } from '../src/select';

describe('plain StyleX themes', () => {
  it('exports neutral bases and a broad accent range', () => {
    expect(Object.keys(colorThemes)).toEqual([
      'neutral',
      'docs',
      'aurora',
      'ember',
      'meadow',
      'stone',
      'zinc',
      'mauve',
      'olive',
      'mist',
      'taupe',
      'amber',
      'blue',
      'cyan',
      'emerald',
      'fuchsia',
      'green',
      'indigo',
      'lime',
      'orange',
      'pink',
      'purple',
      'red',
      'rose',
      'sky',
      'teal',
      'violet',
      'yellow',
    ]);
  });

  it('composes theme objects directly on any element', () => {
    const result = stylex.props(
      colorThemes.docs,
      spacingThemes.docs,
      radiusThemes.docs,
      elevationThemes.docs,
      strokeThemes.docs,
      typographyThemes.docs,
      blurThemes.docs,
      motionThemes.docs,
    );
    expect(result.className).toBeTypeOf('string');
    expect(result.className?.split(' ').length).toBeGreaterThanOrEqual(4);
    expect(result.style).toBeUndefined();
  });

  it('exposes a plain theme map for every variable group', () => {
    expect(Object.keys(blurThemes)).toEqual([
      'base',
      'docs',
      'crisp',
      'gauze',
      'subtle',
      'soft',
      'hazy',
      'frosted',
    ]);
    expect(Object.keys(elevationThemes)).toEqual([
      'base',
      'docs',
      'flat',
      'whisper',
      'soft',
      'float',
      'glass',
      'hard',
      'poster',
    ]);
    expect(Object.keys(motionThemes)).toEqual([
      'standard',
      'docs',
      'brisk',
      'snappy',
      'gentle',
      'fluid',
      'expressive',
      'instant',
    ]);
    expect(Object.keys(radiusThemes)).toEqual([
      'base',
      'docs',
      'sharp',
      'snug',
      'subtle',
      'rounded',
      'soft',
      'pill',
      'plush',
    ]);
    expect(Object.keys(spacingThemes)).toEqual([
      'base',
      'docs',
      'dense',
      'tight',
      'compact',
      'cozy',
      'roomy',
      'poster',
      'airy',
    ]);
    expect(Object.keys(strokeThemes)).toEqual([
      'base',
      'docs',
      'wireframe',
      'hairline',
      'bold',
      'poster',
      'brutal',
      'block',
    ]);
    expect(Object.keys(typographyThemes)).toEqual([
      'ui',
      'docs',
      'editorial',
      'mono',
      'industrial',
      'humanist',
      'compact',
    ]);
  });

  it('exposes native props while omitting competing styling channels', () => {
    expectTypeOf<ButtonProps>().toHaveProperty('onClick');
    expectTypeOf<ButtonProps>().toHaveProperty('ref');
    expectTypeOf<ButtonProps>().toHaveProperty('sx');
    expectTypeOf<ButtonProps>().not.toHaveProperty('className');
    expectTypeOf<ButtonProps>().not.toHaveProperty('style');

    expectTypeOf<SelectProps>().toHaveProperty('name');
    expectTypeOf<SelectProps>().toHaveProperty('required');
    expectTypeOf<SelectProps>().toHaveProperty('ref');
    expectTypeOf<SelectProps>().not.toHaveProperty('className');
    expectTypeOf<SelectProps>().not.toHaveProperty('style');

    expectTypeOf<OptionProps>().toHaveProperty('disabled');
    expectTypeOf<OptionProps>().toHaveProperty('ref');
    expectTypeOf<OptionProps>().toHaveProperty('value');
    expectTypeOf<OptionProps>().not.toHaveProperty('className');
    expectTypeOf<OptionProps>().not.toHaveProperty('style');
  });
});

describe('style presets', () => {
  it('groups one theme per axis into a named, cohesive look', () => {
    expect(Object.keys(stylePresets)).toEqual([
      'docs',
      'aurora',
      'ember',
      'meadow',
      'playful',
      'brutalist',
      'focus',
    ]);
    for (const preset of Object.values(stylePresets)) {
      expect(colorThemes).toHaveProperty(preset.color);
      expect(spacingThemes).toHaveProperty(preset.spacing);
      expect(radiusThemes).toHaveProperty(preset.radius);
      expect(typographyThemes).toHaveProperty(preset.typography);
      expect(elevationThemes).toHaveProperty(preset.elevation);
      expect(strokeThemes).toHaveProperty(preset.stroke);
      expect(blurThemes).toHaveProperty(preset.blur);
      expect(motionThemes).toHaveProperty(preset.motion);
    }
  });

  it('resolves a preset name to a spreadable list of theme objects', () => {
    const result = stylex.props(...stylePresetThemes('aurora'));
    expect(result.className).toBeTypeOf('string');
    expect(result.className?.split(' ').length).toBeGreaterThanOrEqual(8);
    expect(result.style).toBeUndefined();
  });
});
