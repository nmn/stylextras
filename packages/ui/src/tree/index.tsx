import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Children, Fragment, isValidElement } from "react";
import type {
  ComponentPropsWithoutRef,
  Key,
  ReactElement,
  ReactNode,
} from "react";
import { focusgroupProps } from "../focusgroup";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

export type TreeProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

/**
 * Renders a simplified hierarchical tree container.
 *
 * Search aliases: tree, tree view, outline, hierarchy.
 *
 * A11y notes:
 * - Uses native details/summary disclosure instead of a full ARIA tree pattern.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function Tree({ children, sx, ...props }: TreeProps) {
  return (
    <div
      {...props}
      role="tree"
      {...focusgroupProps<HTMLDivElement>("tree")}
      {...stylex.props(rootStyles.base, sx)}
    >
      {renderTreeChildren(children, 0)}
    </div>
  );
}

function renderTreeChildren(children: ReactNode, depth: number): ReactNode {
  return Children.toArray(children).map((child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === Fragment) {
      const fragment = child as ReactElement<{ children?: ReactNode }>;
      return (
        <Fragment key={index}>
          {renderTreeChildren(fragment.props.children, depth)}
        </Fragment>
      );
    }

    if (typeof child.type === "string" && child.type === "ul") {
      const list = child as ReactElement<{ children?: ReactNode }>;
      return (
        <div
          key={index}
          {...stylex.props(levelStyles.base, getDepthStyle(depth))}
        >
          {renderTreeChildren(list.props.children, depth)}
        </div>
      );
    }

    if (typeof child.type === "string" && child.type === "li") {
      return renderTreeItem(
        child as ReactElement<{ children?: ReactNode }>,
        depth,
        index,
      );
    }

    return child;
  });
}

function renderTreeItem(
  child: ReactElement<{ children?: ReactNode }>,
  depth: number,
  key: Key,
): ReactNode {
  const parts = Children.toArray(child.props.children);
  const nestedList = parts.find(
    (part) =>
      isValidElement(part) &&
      typeof part.type === "string" &&
      part.type === "ul",
  );
  const labelParts = parts.filter((part) => part !== nestedList);
  const labelContent =
    labelParts.length > 0 ? labelParts : child.props.children;

  if (nestedList && isValidElement(nestedList)) {
    return (
      <details
        key={key}
        {...stylex.props(branchStyles.base, getDepthStyle(depth))}
      >
        <summary {...stylex.props(branchStyles.summary)}>
          <span {...stylex.props(branchStyles.label)}>{labelContent}</span>
        </summary>
        <div {...stylex.props(branchStyles.children)}>
          {renderTreeChildren(
            (nestedList as ReactElement<{ children?: ReactNode }>).props
              .children,
            depth + 1,
          )}
        </div>
      </details>
    );
  }

  return (
    <div
      key={key}
      role="treeitem"
      tabIndex={0}
      {...stylex.props(leafStyles.base, getDepthStyle(depth))}
    >
      {labelContent}
    </div>
  );
}

function getDepthStyle(depth: number) {
  if (depth === 0) {
    return depthStyles[0];
  }

  if (depth === 1) {
    return depthStyles[1];
  }

  if (depth === 2) {
    return depthStyles[2];
  }

  if (depth === 3) {
    return depthStyles[3];
  }

  return depthStyles.deep;
}

const rootStyles = stylex.create({
  base: {
    margin: 0,
    gap: spacing.xxxs,
    display: "grid",
  },
});

const levelStyles = stylex.create({
  base: {
    gap: spacing.xxxs,
    display: "grid",
  },
});

const branchStyles = stylex.create({
  base: {
    gap: spacing.xxxs,
    display: "grid",
  },
  summary: {
    borderRadius: radius.md,
    paddingInline: spacing.sm,
    color: colors.fg,
    cursor: "pointer",
    display: "list-item",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    listStylePosition: "inside",
    listStyleType: "disclosure-closed",
    minHeight: spacing.xxl,
  },
  label: {
    minWidth: 0,
  },
  children: {
    gap: spacing.xxxs,
    display: "grid",
    paddingLeft: spacing.md,
  },
});

const leafStyles = stylex.create({
  base: {
    borderRadius: radius.md,
    paddingInline: spacing.sm,
    alignItems: "center",
    color: colors.fgSoft,
    display: "flex",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightSnug,
    minHeight: spacing.xxl,
  },
});

const depthStyles = stylex.create({
  0: {
    marginLeft: 0,
  },
  1: {
    marginLeft: spacing.sm,
  },
  2: {
    marginLeft: spacing.md,
  },
  3: {
    marginLeft: spacing.lg,
  },
  deep: {
    marginLeft: spacing.lg,
  },
});
