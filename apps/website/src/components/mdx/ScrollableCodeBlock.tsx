/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';
import * as stylex from '@stylexjs/stylex';
import { CopyToClipboardButton } from '@stylextras/ui/copy-to-clipboard-button';
import { ScrollArea } from '@stylextras/ui/scroll-area';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { typography } from '@stylextras/ui/tokens/typography.stylex';
import { Check, Clipboard } from 'lucide-react';
import type { ReactNode } from 'react';
import { syntax } from '@/theming/syntax.stylex';
interface ScrollableCodeBlockProps {
  content: string;
  highlightedContent?: ReactNode;
  title: string;
  maxHeight?: number;
}
export function ScrollableCodeBlock({
  content,
  highlightedContent,
  title,
  maxHeight = 300,
}: ScrollableCodeBlockProps) {
  return (
    <figure {...stylex.props(styles.figure)}>
      <div {...stylex.props(styles.header)}>
        <figcaption {...stylex.props(styles.title)}>{title}</figcaption>
        <CopyToClipboardButton
          copiedIcon={
            <Check {...stylex.props(styles.copyIcon, styles.copyIconChecked)} />
          }
          copiedLabel="Copied"
          feedback="none"
          icon={<Clipboard {...stylex.props(styles.copyIcon)} />}
          label="Copy to clipboard"
          resetAfterMs={2000}
          size="icon-sm"
          value={content}
        />
      </div>
      <ScrollArea
        aria-label={`${title} code`}
        scrollbar="overlay"
        sx={styles.viewport(maxHeight)}
        tabIndex={0}
      >
        <pre {...stylex.props(styles.pre)}>
          <code {...stylex.props(styles.code)}>
            {highlightedContent ?? content}
          </code>
        </pre>
      </ScrollArea>
    </figure>
  );
}
const styles = stylex.create({
  figure: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 16,
    overflow: 'hidden',
    fontSize: 13,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 12,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  header: {
    display: 'flex',
    rowGap: 8,
    columnGap: 8,
    alignItems: 'center',
    height: 38,
    paddingInline: 16,
    color: colors.fgMuted,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  title: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: typography.fontMono,
    whiteSpace: 'nowrap',
  },
  viewport: (maxHeight: number) => ({
    maxHeight,
    paddingBlock: 8,
    overflow: 'auto',
  }),
  pre: {
    display: 'flex',
    flexDirection: 'column',
    width: 'max-content',
    minWidth: '100%',
    margin: 0,
    backgroundColor: 'transparent',
  },
  code: {
    paddingBlock: 8,
    paddingInline: 16,
    fontFamily: typography.fontMono,
    fontSize: 13,
    lineHeight: 1.5,
    color: syntax['--syntax-foreground'],
    whiteSpace: 'pre',
  },
  copyIcon: {
    width: 14,
    height: 14,
  },
  copyIconChecked: {
    color: colors.accentText,
  },
});
