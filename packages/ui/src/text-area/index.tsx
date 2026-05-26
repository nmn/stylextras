import { Textarea, type TextareaProps } from "../textarea/index";

export type TextAreaProps = TextareaProps;
export type TextAreaFieldProps = TextAreaProps;

/**
 * Renders the textarea primitive under the spaced alias export.
 *
 * Search aliases: text area, textarea, multiline input, message field.
 *
 * A11y notes:
 * - Shares the same limitations as the underlying TextArea primitive.
 * - Labeling and validation messaging must be composed by the caller.
 */
export function TextAreaField(props: TextAreaFieldProps) {
  return <TextArea {...props} />;
}

export function TextArea(props: TextAreaProps) {
  return <Textarea {...props} />;
}
