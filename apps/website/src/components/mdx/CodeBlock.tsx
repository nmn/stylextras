/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';
import * as stylex from '@stylexjs/stylex';
import { CopyToClipboardButton } from '@stylextras/ui/copy-to-clipboard-button';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { typography } from '@stylextras/ui/tokens/typography.stylex';
import { Check, Clipboard } from 'lucide-react';
import type {
  ComponentType,
  ComponentProps,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from 'react';
import { useRef } from 'react';
import { syntax } from '@/theming/syntax.stylex';
import { preMarker, tabsMarker } from './mdx.stylex';
export function Pre(props: ComponentProps<'pre'>) {
  return (
    <pre
      {...stylex.props(styles.pre, stylex.defaultMarker(), preMarker)}
      {...props}
    >
      {props.children}
    </pre>
  );
}
export interface CodeBlockProps extends Omit<
  ComponentProps<'figure'>,
  'className' | 'style'
> {
  icon?: ReactNode;
  title?: string;
  allowCopy?: boolean;
  viewportProps?: HTMLAttributes<HTMLDivElement>;
  'data-line-numbers'?: boolean;
  'data-line-numbers-start'?: number;
  Actions?: ComponentType<{ children?: ReactNode }>;
  xstyle?: stylex.StyleXStyles;
}
export function CodeBlock({
  ref,
  title,
  allowCopy = true,
  icon,
  viewportProps = {},
  children,
  xstyle,
  Actions = DefaultActions,
  ...props
}: CodeBlockProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  return (
    <figure
      dir="ltr"
      ref={ref}
      tabIndex={-1}
      {...props}
      {...stylex.props(styles.figure, xstyle)}
    >
      {title ? (
        <div {...stylex.props(styles.header)}>
          {typeof icon === 'string' ? (
            <div
              {...stylex.props(styles.iconWrapper)}
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : (
            icon
          )}
          <figcaption {...stylex.props(styles.title)}>{title}</figcaption>
          <Actions>
            {allowCopy && <CopyButton containerRef={areaRef} />}
          </Actions>
        </div>
      ) : (
        <Actions>
          {allowCopy && (
            <CopyButton
              containerRef={areaRef}
              xstyle={styles.floatingCopyButton}
            />
          )}
        </Actions>
      )}
      <div
        ref={areaRef}
        aria-label={title ? `${title} code` : undefined}
        role={title ? 'region' : undefined}
        tabIndex={0}
        {...viewportProps}
        {...stylex.props(styles.viewport, !title && styles.viewportPadded)}
      >
        {children}
      </div>
    </figure>
  );
}
function DefaultActions({ children }: { children?: ReactNode }) {
  return <div {...stylex.props(styles.actionsWrapper)}>{children}</div>;
}
interface CopyButtonProps {
  containerRef: RefObject<HTMLDivElement | null>;
  xstyle?: stylex.StyleXStyles;
}
function CopyButton({ containerRef, xstyle }: CopyButtonProps) {
  function resolveValue() {
    const pre = containerRef.current?.getElementsByTagName('pre').item(0);
    if (!pre) return '';
    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
      node.replaceWith('\n');
    });
    return clone.textContent ?? '';
  }

  return (
    <CopyToClipboardButton
      copiedIcon={
        <Check {...stylex.props(styles.copyIcon, styles.copyIconChecked)} />
      }
      copiedLabel="Copied Text"
      feedback="none"
      icon={<Clipboard {...stylex.props(styles.copyIcon)} />}
      label="Copy Text"
      resetAfterMs={2000}
      size="icon-sm"
      sx={xstyle}
      value={resolveValue}
    />
  );
}
const styles = stylex.create({
  figure: {
    position: 'relative',
    marginTop: {
      default: 16,
      [stylex.when.ancestor(':where(*)', tabsMarker)]: 4,
    },
    marginBottom: 16,
    overflow: 'hidden',
    fontSize: 13,
    lineHeight: 1.5,
    color: syntax['--syntax-foreground'],
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
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
  },
  title: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionsWrapper: {
    display: 'contents',
  },
  viewport: {
    paddingBlock: 8,
    overflow: 'auto',
  },
  viewportPadded: {
    paddingInlineEnd: 48,
  },
  pre: {
    display: 'flex',
    flexDirection: 'column',
    width: 'max-content',
    minWidth: '100%',
    margin: 0,
    fontFamily: typography.fontMono,
    backgroundColor: 'transparent',
  },
  floatingCopyButton: {
    position: 'absolute',
    insetInlineEnd: 4,
    top: 4,
    zIndex: 2,
    borderRadius: 8,
    backdropFilter: 'blur(8px)',
  },
  copyIcon: {
    width: 14,
    height: 14,
  },
  copyIconChecked: {
    color: colors.accentText,
  },
});
