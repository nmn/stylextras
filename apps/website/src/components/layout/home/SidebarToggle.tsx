/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import { SidebarContext } from '@/contexts/SidebarContext';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@stylextras/ui/button';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { SidebarIcon } from 'lucide-react';
import { use } from 'react';

export default function SidebarToggle() {
  const [_open, setOpen] = use(SidebarContext);

  return (
    <Button
      aria-label="Toggle documentation sidebar"
      onClick={() => {
        setOpen((old) => {
          if (old === null) {
            return window.matchMedia('(max-width: 767.9px)').matches;
          }
          return !old;
        });
      }}
      size="icon-lg"
      sx={styles.button}
      variant="ghost"
    >
      <SidebarIcon size={20} />
    </Button>
  );
}

const styles = stylex.create({
  button: {
    marginInline: (20 - 40) / 2,
    color: {
      default: colors.fgMuted,
      ':focus-visible': colors.accentText,
      ':hover': colors.accentText,
      ':active': colors.accentText,
    },
    backgroundColor: 'transparent',
    borderRadius: radius.md,
    scale: {
      default: null,
      ':active': 0.95,
    },
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '0.3s',
    transitionProperty: 'color, scale',
  },
});
