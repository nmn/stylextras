/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import { vars } from '@/theming/vars.stylex';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@stylextras/ui/button';
import { Kbd } from '@stylextras/ui/kbd';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';
import { type StyleXComponentProps } from './layout/shared';

export function LargeSearchToggle({
  hideIfDisabled,
  xstyle,
  onClick,
  ...props
}: StyleXComponentProps<'button'> & {
  hideIfDisabled?: boolean;
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { text } = useI18n();
  if (hideIfDisabled && !enabled) return null;

  return (
    <Button
      aria-label={text.search}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpenSearch(true);
      }}
      size="md"
      sx={[styles.button, xstyle]}
      variant="outline"
    >
      <Search {...stylex.props(styles.size4)} />
      <span {...stylex.props(styles.text)}>{text.search}</span>
      {hotKey.length > 0 ? (
        <Kbd aria-hidden size="sm" sx={styles.hotkey}>
          {hotKey.map((key, index) => (
            <span key={index}>{key.display}</span>
          ))}
        </Kbd>
      ) : null}
    </Button>
  );
}

const styles = stylex.create({
  button: {
    // '  text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
    width: '100%',
    minWidth: 90,
    minHeight: 37,
    color: {
      default: colors.fgMuted,
      ':focus-visible': colors.accentText,
      ':hover': colors.accentText,
    },
    whiteSpace: 'nowrap',
    backgroundColor: {
      default: vars['--color-fd-muted'],
      ':hover': vars['--color-fd-accent'],
      ':active': vars['--color-fd-accent'],
    },
    borderColor: {
      default: vars['--color-fd-border'],
      ':focus-visible': colors.accentText,
      ':hover': colors.accentText,
    },
    borderRadius: radius.md,
  },
  text: {
    display: {
      default: null,
      '@container (width < 240px)': 'none',
    },
  },
  size4: { width: 16, height: 16 },
  hotkey: {
    rowGap: 2,
    columnGap: 2,
    minWidth: 0,
    minHeight: 20,
    paddingBlock: 0,
    paddingInline: 6,
    marginInlineStart: 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: `${11 / 16}rem`,
    fontWeight: 600,
    lineHeight: 1,
    color: colors.fgMuted,
    letterSpacing: '-0.01em',
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-background']} 80%, transparent)`,
    borderColor: vars['--color-fd-border'],
    borderRadius: radius.sm,
  },
});
