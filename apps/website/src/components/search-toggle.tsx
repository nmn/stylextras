/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client'

import { vars } from '@/theming/vars.stylex'
import * as stylex from '@stylexjs/stylex'
import { Button } from '@stylextras/ui/button'
import { Kbd } from '@stylextras/ui/kbd'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { Search } from 'lucide-react'
import { type StyleXComponentProps } from './layout/shared'

export function LargeSearchToggle({
  hideIfDisabled,
  xstyle,
  onClick,
  ...props
}: StyleXComponentProps<'button'> & {
  hideIfDisabled?: boolean
}) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext()
  const { text } = useI18n()
  if (hideIfDisabled && !enabled) return null

  return (
    <Button
      data-search-full=""
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setOpenSearch(true)
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
  )
}

const styles = stylex.create({
  button: {
    // '  text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
    width: '100%',
    minHeight: 37,
    minWidth: 90,
    color: {
      default: vars['--color-fd-muted-foreground'],
      ':focus-visible': vars['--color-fd-foreground'],
      ':hover': vars['--color-fd-foreground'],
    },
    borderColor: {
      default: vars['--color-fd-border'],
      ':focus-visible': vars['--color-fd-primary'],
      ':hover': vars['--color-fd-primary'],
    },
    borderRadius: '9999px',
    whiteSpace: 'nowrap',
  },
  text: {
    display: {
      default: null,
      '@container (width < 240px)': 'none',
    },
  },
  size4: { width: 16, height: 16 },
  hotkey: {
    gap: 2,
    minHeight: 20,
    minWidth: 0,
    marginInlineStart: 'auto',
    paddingBlock: 0,
    paddingInline: 6,
    fontFamily: 'var(--font-sans)',
    fontSize: `${11 / 16}rem`,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '-0.01em',
    color: vars['--color-fd-muted-foreground'],
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-background']} 80%, transparent)`,
    borderColor: vars['--color-fd-border'],
    borderRadius: 9999,
  },
})
