'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  type ComponentPropsWithRef,
  type FocusEvent,
  type KeyboardEvent,
  useCallback,
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AccessibleAriaNameProps } from '../accessibility';
import { colors } from '../tokens/color.stylex';
import { elevation } from '../tokens/elevation.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';
import { typography } from '../tokens/typography.stylex';

type TabsContextValue = {
  activationMode: 'automatic' | 'manual';
  claimInitialTabStop: (value: string, disabled: boolean) => boolean;
  idFor: (value: string) => string;
  orientation: 'horizontal' | 'vertical';
  select: (value: string) => void;
  value: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`${component} must be rendered inside Tabs`);
  return context;
}

type SxProp = { sx?: StyleXStyles };

export type TabsProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'defaultValue' | 'style'
> &
  SxProp & {
    activationMode?: 'automatic' | 'manual';
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    value?: string;
  };
export type TabsListProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-orientation'
  | 'className'
  | 'role'
  | 'style'
> &
  AccessibleAriaNameProps &
  SxProp;
export type TabsTriggerProps = Omit<
  ComponentPropsWithRef<'button'>,
  | 'aria-controls'
  | 'aria-selected'
  | 'className'
  | 'id'
  | 'role'
  | 'style'
  | 'tabIndex'
  | 'type'
  | 'value'
> &
  SxProp & { value: string };
export type TabsContentProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'aria-labelledby'
  | 'className'
  | 'hidden'
  | 'id'
  | 'role'
  | 'style'
  | 'tabIndex'
> &
  SxProp & { value: string };

export function Tabs({
  activationMode = 'automatic',
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  ref,
  sx,
  value,
  ...props
}: TabsProps) {
  const generatedId = useId().replaceAll(':', '');
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const initialTabStopRef = useRef<string | null>(null);
  const idsRef = useRef(new Map<string, string>());
  initialTabStopRef.current = null;
  const context = useMemo<TabsContextValue>(
    () => ({
      activationMode,
      claimInitialTabStop: (nextValue, disabled) => {
        if (disabled) return false;
        if (initialTabStopRef.current === null)
          initialTabStopRef.current = nextValue;
        return initialTabStopRef.current === nextValue;
      },
      idFor: (nextValue) => {
        const existing = idsRef.current.get(nextValue);
        if (existing) return existing;
        const id = `${generatedId}-${idsRef.current.size + 1}`;
        idsRef.current.set(nextValue, id);
        return id;
      },
      orientation,
      select: (nextValue) => {
        if (nextValue === selectedValue) return;
        if (!controlled) setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
      value: selectedValue,
    }),
    [
      activationMode,
      controlled,
      generatedId,
      onValueChange,
      orientation,
      selectedValue,
    ],
  );
  return (
    <TabsContext value={context}>
      <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
    </TabsContext>
  );
}

export function TabsList({ ref, sx, ...props }: TabsListProps) {
  const context = useTabs('TabsList');
  const listRef = useRef<HTMLDivElement>(null);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useLayoutEffect(() => {
    const tabs = [
      ...(listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      ) ?? []),
    ];
    if (!tabs?.length) return;
    const selectedTab = tabs.find(
      (tab) => !tab.disabled && tab.getAttribute('aria-selected') === 'true',
    );
    const tabStop = selectedTab ?? tabs.find((tab) => !tab.disabled);
    for (const tab of tabs) {
      tab.tabIndex = tab === tabStop ? 0 : -1;
    }
  });

  return (
    <div
      ref={setRefs}
      {...props}
      role="tablist"
      aria-orientation={context.orientation}
      {...stylex.props(
        styles.list,
        context.orientation === 'vertical' && styles.listVertical,
        sx,
      )}
    />
  );
}

export function TabsTrigger({
  disabled = false,
  onClick,
  onFocus,
  onKeyDown,
  ref,
  sx,
  value,
  ...props
}: TabsTriggerProps) {
  const context = useTabs('TabsTrigger');
  const selected = context.value === value;
  const valueId = context.idFor(value);
  const triggerId = `stylextras-tabs-trigger-${valueId}`;
  const panelId = `stylextras-tabs-panel-${valueId}`;
  const initialTabStop = context.claimInitialTabStop(value, disabled);

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event);
    if (!event.defaultPrevented && context.activationMode === 'automatic')
      context.select(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const triggers = [
      ...event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    ];
    const index = triggers.indexOf(event.currentTarget);
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const previousKey =
      context.orientation === 'horizontal'
        ? rtl
          ? 'ArrowRight'
          : 'ArrowLeft'
        : 'ArrowUp';
    const nextKey =
      context.orientation === 'horizontal'
        ? rtl
          ? 'ArrowLeft'
          : 'ArrowRight'
        : 'ArrowDown';
    let next: HTMLButtonElement | undefined;
    if (event.key === previousKey)
      next = triggers[(index - 1 + triggers.length) % triggers.length];
    else if (event.key === nextKey)
      next = triggers[(index + 1) % triggers.length];
    else if (event.key === 'Home') next = triggers[0];
    else if (event.key === 'End') next = triggers.at(-1);
    else if (
      (event.key === 'Enter' || event.key === ' ') &&
      context.activationMode === 'manual'
    ) {
      event.preventDefault();
      context.select(value);
      return;
    }
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <button
      ref={ref}
      {...props}
      id={triggerId}
      type="button"
      role="tab"
      aria-controls={panelId}
      aria-selected={selected}
      disabled={disabled}
      tabIndex={
        !disabled && (selected || (!context.value && initialTabStop)) ? 0 : -1
      }
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && context.activationMode === 'manual')
          context.select(value);
      }}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      {...stylex.props(styles.trigger, selected && styles.triggerActive, sx)}
    />
  );
}

export function TabsContent({ ref, sx, value, ...props }: TabsContentProps) {
  const context = useTabs('TabsContent');
  const valueId = context.idFor(value);
  return (
    <div
      ref={ref}
      {...props}
      id={`stylextras-tabs-panel-${valueId}`}
      role="tabpanel"
      aria-labelledby={`stylextras-tabs-trigger-${valueId}`}
      hidden={context.value !== value}
      tabIndex={0}
      {...stylex.props(styles.content, sx)}
    />
  );
}

const styles = stylex.create({
  root: {
    gap: spacing.md,
    display: 'grid',
    minWidth: 0,
    width: '100%',
  },
  list: {
    padding: spacing.xxxs,
    borderRadius: radius.sm,
    gap: spacing.xxxs,
    alignItems: 'center',
    backgroundColor: colors.bgInset,
    display: 'inline-flex',
    maxWidth: '100%',
    overflowX: 'auto',
    width: '100%',
  },
  listVertical: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  trigger: {
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingInline: spacing.sm,
    backgroundColor: {
      default: 'transparent',
      ':disabled': 'transparent',
      ':hover': colors.bgSubtle,
    },
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    color: colors.fgMuted,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
    minHeight: {
      default: spacing.controlSm,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
  },
  triggerActive: {
    backgroundColor: colors.control,
    boxShadow: elevation.xs,
    color: colors.fg,
  },
  content: {
    borderRadius: radius.xs,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.fg,
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
  },
});
