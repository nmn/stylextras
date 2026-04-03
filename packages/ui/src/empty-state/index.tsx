import { Empty, type EmptyProps } from "../empty/index";

export type EmptyStateProps = EmptyProps;

/**
 * Renders the empty-state primitive under the explicit name.
 *
 * Search aliases: empty state, empty, placeholder state, no results.
 *
 * A11y notes:
 * - Shares the same limitations as Empty.
 * - The caller must provide meaningful content and landmarks where needed.
 */
export function EmptyState(props: EmptyStateProps) {
  return <Empty {...props} />;
}
