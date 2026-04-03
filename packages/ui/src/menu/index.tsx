import { DropdownMenu, type DropdownMenuProps } from "../dropdown-menu/index";

export type MenuProps = DropdownMenuProps;

/**
 * Renders the dropdown-menu primitive under a simpler menu alias.
 *
 * Search aliases: menu, dropdown, popup menu, action menu.
 *
 * A11y notes:
 * - Shares the same limitations as DropdownMenu.
 * - It does not implement full menu-button keyboard behavior on its own.
 */
export function Menu(props: MenuProps) {
  return <DropdownMenu {...props} />;
}
