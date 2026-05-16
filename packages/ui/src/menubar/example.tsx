"use client";

import { DemoFrame } from "../example-theme/demo";
import {
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionTitle,
} from "../menu/menu-content";
import {
  MenuContent as MenuSurface,
  type MenuContentProps,
  MenuTrigger,
} from "../menu";
import { Menubar } from "./index";

function FileMenuContent(props: MenuContentProps) {
  return (
    <MenuSurface {...props}>
      <MenuContent>
        <MenuSection>
          <MenuSectionTitle>File</MenuSectionTitle>
          <MenuItem endIcon="⌘N" type="button">
            New file
          </MenuItem>
          <MenuItem endIcon="⌘O" type="button">
            Open
          </MenuItem>
          <MenuItem endIcon="⌘S" type="button">
            Save
          </MenuItem>
        </MenuSection>
      </MenuContent>
    </MenuSurface>
  );
}

function EditMenuContent(props: MenuContentProps) {
  return (
    <MenuSurface {...props}>
      <MenuContent>
        <MenuSection>
          <MenuSectionTitle>Edit</MenuSectionTitle>
          <MenuItem endIcon="⌘Z" type="button">
            Undo
          </MenuItem>
          <MenuItem endIcon="⌘⇧Z" type="button">
            Redo
          </MenuItem>
          <MenuItem endIcon="⌘K" type="button">
            Find action
          </MenuItem>
        </MenuSection>
      </MenuContent>
    </MenuSurface>
  );
}

function ViewMenuContent(props: MenuContentProps) {
  return (
    <MenuSurface {...props}>
      <MenuContent>
        <MenuSection>
          <MenuSectionTitle>View</MenuSectionTitle>
          <MenuItem type="button">Toggle sidebar</MenuItem>
          <MenuItem type="button">Zoom in</MenuItem>
          <MenuItem type="button">Zoom out</MenuItem>
        </MenuSection>
      </MenuContent>
    </MenuSurface>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Application menubar"
      description="Each top-level menubar item opens a real menu."
    >
      <Menubar>
        <MenuTrigger
          content={() => Promise.resolve(FileMenuContent)}
          role="menuitem"
          variant="ghost"
        >
          File
        </MenuTrigger>
        <MenuTrigger
          content={() => Promise.resolve(EditMenuContent)}
          role="menuitem"
          variant="ghost"
        >
          Edit
        </MenuTrigger>
        <MenuTrigger
          content={() => Promise.resolve(ViewMenuContent)}
          role="menuitem"
          variant="ghost"
        >
          View
        </MenuTrigger>
      </Menubar>
    </DemoFrame>
  );
}
