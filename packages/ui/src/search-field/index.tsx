import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type { AccessibleNameProps } from "../accessibility";
import { isAriaInvalid, mergeIdRefs } from "../internal/field-relationships";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithRef<"input">;

export type SearchFieldProps = Omit<
  BaseProps,
  "aria-label" | "aria-labelledby" | "className" | "style" | "type"
> &
  AccessibleNameProps & {
    description?: ReactNode;
    descriptionSx?: StyleXStyles;
    error?: ReactNode;
    errorSx?: StyleXStyles;
    inputSx?: StyleXStyles;
    invalid?: boolean;
    labelSx?: StyleXStyles;
    sx?: StyleXStyles;
  };

/**
 * Renders a token-styled native search input.
 *
 * Search aliases: search field, search input, search box, query field.
 *
 * A11y notes:
 * - Uses native search input semantics.
 * - Search result announcements and live region updates are not handled automatically.
 */
export function SearchField({
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  "aria-invalid": ariaInvalid,
  description,
  descriptionSx,
  error,
  errorSx,
  id: idProp,
  inputSx,
  invalid = false,
  label,
  labelSx,
  ref,
  sx,
  ...props
}: SearchFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const isInvalid = invalid || isAriaInvalid(ariaInvalid);

  return (
    <div {...stylex.props(rootStyles.base, sx)}>
      {label ? (
        <label htmlFor={id} {...stylex.props(labelStyles.base, labelSx)}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        {...props}
        aria-describedby={mergeIdRefs(
          ariaDescribedBy,
          descriptionId,
          isInvalid ? mergeIdRefs(ariaErrorMessage, errorId) : undefined,
        )}
        aria-errormessage={
          isInvalid ? mergeIdRefs(ariaErrorMessage, errorId) : undefined
        }
        aria-invalid={invalid ? true : ariaInvalid}
        id={id}
        type="search"
        {...stylex.props(inputStyles.base, inputSx)}
      />
      {description ? (
        <span id={descriptionId} {...stylex.props(descriptionStyles.base, descriptionSx)}>
          {description}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} {...stylex.props(errorStyles.base, errorSx)}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

const rootStyles = stylex.create({
  base: { gap: spacing.xs, display: "grid", width: "100%" },
});
const labelStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
});
const descriptionStyles = stylex.create({
  base: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
  },
});
const errorStyles = stylex.create({
  base: {
    color: colors.dangerText,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
});
const inputStyles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
    width: "100%",
  },
});
