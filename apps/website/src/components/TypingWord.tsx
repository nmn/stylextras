/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import * as stylex from '@stylexjs/stylex';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { Fragment } from 'react';

const WORDS = [
  'expressive',
  'type-safe',
  'composable',
  'predictable',
  'themeable',
];

export default function TypingWord() {
  return (
    <span {...stylex.props(styles.container)} aria-hidden="true">
      <span {...stylex.props(styles.reducedMotionWord)}>{WORDS[0]}</span>
      {WORDS.map((word, index) => (
        <Fragment key={word}>
          <span {...stylex.props(styles.word, styles.reducedMotionHiddenWord)}>
            {word}
            <span {...stylex.props(styles.hidden)}>
              {index < WORDS.length - 2
                ? ', '
                : index === WORDS.length - 2
                  ? ' and '
                  : ''}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

const typingAnim = stylex.keyframes({
  '37%': {
    gridTemplateColumns: '1fr',
    borderInlineEndColor: 'transparent',
  },
  '40%': {
    gridTemplateColumns: '1fr',
    borderInlineEndColor: colors.accentText,
  },
  '49%': {
    gridTemplateColumns: '0fr',
    borderInlineEndColor: colors.accentText,
  },
  '51%': {
    gridTemplateColumns: '0fr',
    borderInlineEndColor: colors.accentText,
  },
  '60%': {
    gridTemplateColumns: '1fr',
    borderInlineEndColor: colors.accentText,
  },
  '63%': {
    gridTemplateColumns: '1fr',
    borderInlineEndColor: 'transparent',
  },
});

const hidden = stylex.keyframes({
  '0%': {
    display: 'inline',
    fontSize: '1em',
    opacity: 1,
  },
  '20%': {
    display: 'inline',
    fontSize: '1em',
    opacity: 1,
  },
  '20.001%': {
    display: 'none',
    fontSize: '0.1em',
    opacity: 0,
  },
  '100%': {
    display: 'none',
    fontSize: '0.1em',
    opacity: 0,
  },
});

const TIME = 8;
const styles = stylex.create({
  container: {
    display: 'inline-grid',
    gridTemplateColumns: '1fr',
    overflow: 'hidden',
    fontWeight: 600,
    verticalAlign: 'top',
    color: colors.primary,
    borderInlineEndColor: 'transparent',
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    animationName: {
      default: typingAnim,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: `${TIME}s`,
    animationTimingFunction: 'ease-out',
    animationDelay: `${TIME / 2}s`,
    animationIterationCount: 'infinite',
  },
  word: {
    gridRowStart: '1',
    gridColumnStart: '1',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    animationName: {
      default: hidden,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: `${TIME * 5}s`,
    animationTimingFunction: 'steps(5)',
    // eslint-disable-next-line @stylexjs/valid-styles
    animationDelay: Object.fromEntries(
      [0, 1, 2, 3, 4].map((i) => [
        `:nth-child(${i + 2})`,
        `${TIME * (i - 5)}s`,
      ]),
    ),
    animationIterationCount: 'infinite',
  },
  reducedMotionHiddenWord: {
    display: {
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    visibility: {
      '@media (prefers-reduced-motion: reduce)': 'hidden',
    },
  },
  reducedMotionWord: {
    display: {
      default: 'none',
      '@media (prefers-reduced-motion: reduce)': 'inline',
    },
    gridRowStart: '1',
    gridColumnStart: '1',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  hidden: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    fontSize: '0.01em',
    opacity: 0.0001,
  },
});
