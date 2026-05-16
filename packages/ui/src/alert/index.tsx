import { AlertCallout, type AlertProps } from '../alert-callout/index';

export type { AlertProps } from '../alert-callout/index';

/**
 * Renders a token-driven status message surface for inline feedback.
 *
 * Search aliases: alert, callout, notice, message.
 *
 * A11y notes:
 * - Uses native container semantics only.
 * - Does not manage live-region priority beyond the provided role prop.
 */
export function Alert(props: AlertProps) {
  return <AlertCallout {...props} />;
}
