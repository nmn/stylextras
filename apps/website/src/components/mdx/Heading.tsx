/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as stylex from '@stylexjs/stylex';
import { Link as UILink } from '@stylextras/ui/link';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { Typography } from '@stylextras/ui/typography';
import { Link as LinkIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { headingMarker } from './mdx.stylex';

type Types = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps = Omit<
  ComponentPropsWithoutRef<'h1'>,
  'as' | 'className' | 'style'
> & {
  as?: Types;
  xstyle?: stylex.StyleXStyles;
};

type TypographyHeadingProps = Omit<
  ComponentPropsWithoutRef<'h1'>,
  'className' | 'style'
> & {
  as: Types;
  sx?: stylex.StyleXStyles;
};

const TypographyHeading = Typography as unknown as (
  props: TypographyHeadingProps,
) => ReactElement;

export default function Heading({
  as,
  xstyle,
  ...props
}: HeadingProps): ReactElement {
  const As = as ?? 'h1';
  const size = sizes[As as keyof typeof sizes] ?? {};

  if (!props.id) {
    return (
      <TypographyHeading
        as={As}
        sx={[styles.heading, size, xstyle] as stylex.StyleXStyles}
        {...props}
      />
    );
  }

  return (
    <TypographyHeading
      as={As}
      sx={
        [
          styles.heading,
          size,
          stylex.defaultMarker(),
          headingMarker,
          xstyle,
        ] as stylex.StyleXStyles
      }
      {...props}
    >
      <UILink href={`#${props.id}`} sx={styles.anchor}>
        {props.children}
      </UILink>
      <LinkIcon aria-hidden {...stylex.props(styles.icon)} />
    </TypographyHeading>
  );
}

const styles = stylex.create({
  heading: {
    display: 'flex',
    flexDirection: 'row',
    rowGap: 8,
    columnGap: 8,
    alignItems: 'center',
    maxWidth: 'none',
    marginTop: '1em',
    overflowWrap: 'normal',
    scrollMarginTop: '7rem',
  },
  anchor: {
    display: 'inline-flex',
    rowGap: 8,
    columnGap: 8,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    textDecoration: 'none',
  },
  icon: {
    flexShrink: 0,
    width: 14,
    height: 14,
    color: colors.fgMuted,
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover', headingMarker)]: 1,
    },
    transitionTimingFunction: 'ease',
    transitionDuration: '0.15s',
    transitionProperty: 'opacity',
  },
});

// const TEXT_XS = '0.75rem';
// const TEXT_XS_LH = 'calc(1 / 0.75)';
// const TEXT_SM = '0.875rem';
// const TEXT_SM_LH = 'calc(1.25 / 0.875)';
// const TEXT_LG = '1.125rem';
// const TEXT_LG_LH = 'calc(1.75 / 1.125)';
// const TEXT_2XL = '1.5rem';
// const TEXT_2XL_LH = 'calc(2.5 / 1.5)';
const TEXT_3XL = '1.875rem';
// const TEXT_3XL_LH = 'calc(3.5 / 1.875)';

const sizes = stylex.create({
  h1: {
    fontSize: TEXT_3XL,
    fontWeight: 800,
    lineHeight: 1.1111111,
    // marginTop: 0,
    // marginBottom: '0.8888889em',
  },
  h2: {
    fontSize: '1.4em',
    fontWeight: 600,
    lineHeight: 1.3333333,
    // marginTop: '1.5em',
    // marginBottom: '0.5em',
  },
  h3: {
    fontSize: '1.2em',
    fontWeight: 600,
    lineHeight: 1.6,
    // marginTop: '1.6em',
    // marginBottom: '0.6em',
  },
  h4: {
    fontSize: '1em',
    fontWeight: 600,
    lineHeight: 1.5,
    // marginTop: '1.5em',
    // marginBottom: '0.5em',
  },
  h5: {
    fontSize: '0.875em',
    fontWeight: 500,
    lineHeight: 1.5,
    // marginTop: '1.5em',
    // marginBottom: '0.5em',
  },
  h6: {},
});
