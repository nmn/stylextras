import {
  DropdownMenu,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  type DropdownMenuProps,
  DropdownMenuTrigger,
  type DropdownMenuTriggerProps,
} from "../dropdown-menu/index";

export type MenuProps = DropdownMenuProps;
export type MenuContentProps = DropdownMenuContentProps;
export type MenuTriggerProps = DropdownMenuTriggerProps;

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

export function MenuContent(props: MenuContentProps) {
  return <DropdownMenuContent {...props} />;
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <DropdownMenuTrigger {...props} />;
}
