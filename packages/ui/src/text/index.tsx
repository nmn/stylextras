import { Typography, type TypographyProps } from "../typography/index";

export type TextProps = Omit<TypographyProps, "scale">;

/**
 * Renders body-scale typography under a short alias export.
 *
 * Search aliases: text, body text, paragraph text, copy.
 *
 * A11y notes:
 * - Inherits semantics from the underlying element via Typography.
 * - The caller should choose the correct element for document structure.
 */
export function Text(props: TextProps) {
  return <Typography scale="body" {...props} />;
}
