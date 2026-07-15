# Native component decisions

- `Select` remains a native `<select>` with native `<option>` and `<optgroup>` children.
- Custom filtering, typeahead, listbox state, and form-value synchronization belong to `Combobox`.
- Use `<details>` and `<summary>` for Collapsible and Accordion; use `details[name]` for exclusive accordions.
- Keep disclosure behavior native, but render a scoped StyleX icon subcomponent when consistent marker alignment or animation is required; do not rely on the UA list marker inside clipped component surfaces.
- Use native `<dialog>`, invoker commands, Popover API, anchor positioning, and focusgroup as progressive enhancements.
- Do not replace native form submission, validation, autofill, keyboard behavior, mobile pickers, or reset behavior with custom equivalents.
- Keep native-only components out of the client-reference graph.
