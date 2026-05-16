import {
  MenuButton,
  MenuContent,
  MenuIconButton,
  MenuIconButtonGroup,
  MenuItem,
  MenuItemList,
  MenuSection,
  MenuSectionTitle,
} from "./menu-content";

export default function Example() {
  return (
    <MenuContent aria-label="Document actions">
      <MenuSection>
        <MenuSectionTitle>Document</MenuSectionTitle>
        <MenuItemList>
          <MenuItem description="Update the visible name">Rename</MenuItem>
          <MenuItem description="Create a second copy">Duplicate</MenuItem>
          <MenuItem description="Move to the archive" endIcon="Del">
            Archive
          </MenuItem>
        </MenuItemList>
      </MenuSection>
      <MenuIconButtonGroup aria-label="Quick actions">
        <MenuIconButton label="Pin document" size="sm">
          P
        </MenuIconButton>
        <MenuIconButton label="Share document" size="sm">
          S
        </MenuIconButton>
        <MenuIconButton label="Open document details" size="sm">
          I
        </MenuIconButton>
      </MenuIconButtonGroup>
      <MenuButton endIcon="⌘K">Command palette</MenuButton>
    </MenuContent>
  );
}
