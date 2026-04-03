import { Breadcrumb, type BreadcrumbProps } from "../breadcrumb/index";

export type BreadcrumbsProps = BreadcrumbProps;

/**
 * Renders the breadcrumb navigation primitive under the pluralized name.
 *
 * Search aliases: breadcrumbs, breadcrumb, path nav, trail navigation.
 *
 * A11y notes:
 * - Shares the same limitations as Breadcrumb.
 * - Callers must provide semantic links and current-page state.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
  return <Breadcrumb {...props} />;
}
