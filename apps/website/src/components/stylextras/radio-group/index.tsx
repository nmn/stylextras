import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { RadioGroup as AriaRadioGroup } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaRadioGroup>;

export type RadioGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const RadioGroup = ({ style, ...props }: RadioGroupProps) => (
  <AriaRadioGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
