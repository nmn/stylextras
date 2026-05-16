"use client";

import { DemoFrame } from "../example-theme/demo";
import {
  MenuButton,
  MenuContent,
  MenuIconButton,
  MenuIconButtonGroup,
  MenuItem,
  MenuItemList,
  MenuSection,
  MenuSectionTitle,
} from "../menu/menu-content";
import {
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuTrigger,
} from "./index";

function DropdownMenuExampleContent(props: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent {...props}>
      <MenuContent>
        <MenuSection>
          <MenuButton endIcon="↗" icon="★" type="button">
            Open project
          </MenuButton>
        </MenuSection>

        <MenuSection>
          <MenuSectionTitle>Quick actions</MenuSectionTitle>
          <MenuIconButtonGroup>
            <MenuIconButton label="Pin item" size="sm" type="button">
              📌
            </MenuIconButton>
            <MenuIconButton label="Share item" size="sm" type="button">
              ↗
            </MenuIconButton>
            <MenuIconButton label="Delete item" size="sm" type="button">
              ✕
            </MenuIconButton>
          </MenuIconButtonGroup>
        </MenuSection>

        <MenuSection>
          <MenuSectionTitle>More</MenuSectionTitle>
          <MenuItemList>
            <MenuItem
              description="Edit the current page title"
              icon="✎"
              type="button"
            >
              Rename
            </MenuItem>
            <MenuItem description="Create a second copy" icon="⧉" type="button">
              Duplicate
            </MenuItem>
            <MenuItem
              description="Move it out of the active list"
              icon="🗄"
              type="button"
            >
              Archive
            </MenuItem>
          </MenuItemList>
        </MenuSection>
      </MenuContent>
    </DropdownMenuContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Menu surface"
      description="Click the trigger button to open the menu."
    >
      <DropdownMenuTrigger
        content={() => Promise.resolve(DropdownMenuExampleContent)}
        variant="outline"
      >
        Actions
      </DropdownMenuTrigger>
    </DemoFrame>
  );
}
