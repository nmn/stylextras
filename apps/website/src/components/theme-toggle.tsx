/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import * as stylex from '@stylexjs/stylex';
import {
  AnchoredDialog,
  AnchoredDialogBody,
  AnchoredDialogClose,
  AnchoredDialogDescription,
  AnchoredDialogHeader,
  AnchoredDialogRoot,
  AnchoredDialogTitle,
  AnchoredDialogTrigger,
} from '@stylextras/ui/anchored-dialog';
import { AnchoredDialogBridge } from '@stylextras/ui/anchored-dialog/client';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { type SVGProps, useId } from 'react';
import { ThemeControls } from './catalog/ThemeControls';

export function ThemeToggle() {
  const dialogId = `website-theme-${useId().replaceAll(':', '')}`;
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  return (
    <AnchoredDialogRoot>
      <AnchoredDialogTrigger
        aria-label="Customize website theme"
        title="Customize website theme"
        size="icon-lg"
        target={dialogId}
        variant="ghost"
        sx={styles.trigger}
      >
        <PaletteIcon aria-hidden="true" {...stylex.props(styles.icon)} />
      </AnchoredDialogTrigger>

      <AnchoredDialog
        id={dialogId}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        placement="bottom"
        size="lg"
        sx={styles.dialog}
      >
        <AnchoredDialogHeader sx={styles.header}>
          <div {...stylex.props(styles.headingCopy)}>
            <AnchoredDialogTitle id={titleId}>Theme</AnchoredDialogTitle>
            <AnchoredDialogDescription id={descriptionId}>
              Tune the entire documentation site.
            </AnchoredDialogDescription>
          </div>
          <AnchoredDialogClose
            aria-label="Close theme settings"
            size="icon-sm"
            target={dialogId}
            variant="ghost"
            sx={styles.close}
          >
            <CloseIcon aria-hidden="true" {...stylex.props(styles.closeIcon)} />
          </AnchoredDialogClose>
        </AnchoredDialogHeader>
        <AnchoredDialogBody>
          <ThemeControls />
        </AnchoredDialogBody>
        <AnchoredDialogBridge target={dialogId} />
      </AnchoredDialog>
    </AnchoredDialogRoot>
  );
}

function PaletteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8Z" />
      <circle cx="13.5" cy="6.5" fill="currentColor" r=".5" />
      <circle cx="17.5" cy="10.5" fill="currentColor" r=".5" />
      <circle cx="6.5" cy="12.5" fill="currentColor" r=".5" />
      <circle cx="8.5" cy="7.5" fill="currentColor" r=".5" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  );
}

const styles = stylex.create({
  trigger: {
    marginInline: -8,
    color: {
      default: colors.fgMuted,
      ':focus-visible': colors.accentText,
      ':hover': colors.accentText,
      ':active': colors.accentText,
    },
    backgroundColor: 'transparent',
    borderRadius: radius.md,
  },
  dialog: {
    maxHeight: 'calc(100dvh - 4rem)',
  },
  icon: {
    width: 19,
    height: 19,
  },
  header: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'start',
  },
  headingCopy: {
    display: 'grid',
    rowGap: 2,
    columnGap: 2,
  },
  close: {
    marginBlockStart: -4,
    marginInlineEnd: -4,
    borderRadius: radius.round,
  },
  closeIcon: {
    width: 17,
    height: 17,
  },
});
