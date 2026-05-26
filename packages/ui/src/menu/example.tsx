"use client";

import * as stylex from "@stylexjs/stylex";
import { DemoFrame } from "../example-theme/demo";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import {
  MenuButton,
  MenuContent as MenuPanel,
  MenuIconButton,
  MenuIconButtonGroup,
  MenuItem,
  MenuItemList,
  MenuSection,
  MenuSectionTitle,
} from "./menu-content";
import { MenuContent, type MenuContentProps, MenuTrigger } from "./index";

function MoveSubmenuContent(props: MenuContentProps) {
  return (
    <MenuContent {...props} placement="right">
      <MenuPanel>
        <MenuSection>
          <MenuSectionTitle>Move to</MenuSectionTitle>
          <MenuItem icon="P" type="button">
            Planning
          </MenuItem>
          <MenuItem icon="R" type="button">
            Research
          </MenuItem>
          <MenuItem icon="S" type="button">
            Shipped
          </MenuItem>
        </MenuSection>
      </MenuPanel>
    </MenuContent>
  );
}

function MenuExampleContent(props: MenuContentProps) {
  return (
    <MenuContent {...props}>
      <MenuPanel>
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
            <MenuTrigger
              content={() => Promise.resolve(MoveSubmenuContent)}
              contentProps={{ placement: "right" }}
              sx={styles.submenuTrigger}
              variant="ghost"
            >
              <span>Move to</span>
              <span {...stylex.props(styles.submenuArrow)}>›</span>
            </MenuTrigger>
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
      </MenuPanel>
    </MenuContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Menu surface"
      description="Click Actions to open the menu. The Move to row opens a submenu."
    >
      <MenuTrigger
        content={() => Promise.resolve(MenuExampleContent)}
        variant="outline"
      >
        Actions
      </MenuTrigger>
    </DemoFrame>
  );
}

const styles = stylex.create({
  submenuTrigger: {
    borderRadius: radius.sm,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    justifyContent: "stretch",
    textAlign: "left",
    minHeight: spacing.xxxl,
    width: "100%",
  },
  submenuArrow: {
    justifySelf: "end",
  },
});
