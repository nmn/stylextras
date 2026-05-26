import { Children, Fragment, cloneElement, isValidElement, useId } from "react";
import type { ReactElement, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;
type DisclosureChildProps = {
  children?: ReactNode;
  name?: string;
  sx?: StyleXStyles;
};

export type DisclosureGroupProps = Omit<BaseProps, "className" | "style"> & {
  exclusive?: boolean;
  name?: string;
  variant?: DisclosureGroupVariant;
  sx?: StyleXStyles;
};

export type DisclosureGroupVariant = "spacious" | "compact" | "joined";

/**
 * Renders a wrapper for grouped disclosures.
 *
 * Search aliases: disclosure group, accordion group, details group, expandable list.
 *
 * A11y notes:
 * - Provides grouping and can opt into native single-open details behavior.
 * - Does not implement roving focus beyond what the browser provides.
 */
export function DisclosureGroup({
  children,
  exclusive = false,
  name,
  sx,
  variant = "spacious",
  ...props
}: DisclosureGroupProps) {
  const generatedName = useId();
  const detailsName = exclusive ? (name ?? generatedName) : undefined;

  return (
    <div {...props} {...stylex.props(styles.base, variantStyles[variant], sx)}>
      {mapDisclosureChildren(children, { name: detailsName, variant })}
    </div>
  );
}

const styles = stylex.create({
  base: {
    display: "grid",
    width: "100%",
  },
});

const variantStyles = stylex.create({
  spacious: {
    columnGap: spacing.sm,
    rowGap: spacing.sm,
  },
  compact: {
    columnGap: spacing.xxs,
    rowGap: spacing.xxs,
  },
  joined: {
    columnGap: 0,
    rowGap: 0,
  },
});

const joinedItemStyles = stylex.create({
  base: {
    borderRadius: 0,
  },
  first: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  middle: {
    marginBlockStart: `calc(${stroke.thin} * -1)`,
  },
  last: {
    marginBlockStart: `calc(${stroke.thin} * -1)`,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  only: {
    borderRadius: radius.lg,
  },
});

type MapOptions = {
  name: string | undefined;
  variant: DisclosureGroupVariant;
};

function mapDisclosureChildren(
  children: ReactNode,
  options: MapOptions,
): ReactNode {
  const items = Children.toArray(children);

  return items.map((child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === Fragment) {
      const fragment = child as ReactElement<{
        children?: ReactNode;
      }>;
      return (
        <Fragment>
          {mapDisclosureChildren(fragment.props.children, options)}
        </Fragment>
      );
    }

    if (options.name === undefined && options.variant !== "joined") {
      return child;
    }

    const childProps = child.props as DisclosureChildProps;
    const nextProps: DisclosureChildProps = {};

    if (options.name !== undefined) {
      nextProps.name = options.name;
    }

    if (options.variant === "joined") {
      nextProps.sx = [
        joinedItemStyles.base,
        getJoinedItemStyle(index, items.length),
        childProps.sx,
      ];
    }

    return cloneElement(child as ReactElement<DisclosureChildProps>, nextProps);
  });
}

function getJoinedItemStyle(index: number, itemCount: number): StyleXStyles {
  if (itemCount === 1) {
    return joinedItemStyles.only;
  }

  if (index === 0) {
    return joinedItemStyles.first;
  }

  if (index === itemCount - 1) {
    return joinedItemStyles.last;
  }

  return joinedItemStyles.middle;
}
