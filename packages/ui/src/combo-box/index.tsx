import { Combobox, type ComboboxProps } from '../combobox/index'

export type ComboBoxProps = ComboboxProps
export type ComboBoxFieldProps = ComboBoxProps

/**
 * Renders the combo box primitive under the spaced alias export.
 *
 * Search aliases: combo box, combobox, autocomplete field, picker field.
 *
 * A11y notes:
 * - Shares the same limitations as the Combobox primitive.
 * - Does not implement a full ARIA combobox popup interaction model.
 */
export function ComboBoxField(props: ComboBoxFieldProps) {
  return <ComboBox {...props} />
}

export function ComboBox(props: ComboBoxProps) {
  return <Combobox {...props} />
}
