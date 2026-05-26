"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { DemoFrame, DemoMuted, DemoStack } from "../example-theme/demo";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";
import { WindowSplitter } from "./index";

export default function Example() {
  const [verticalSplit, setVerticalSplit] = useState(38);
  const [horizontalSplit, setHorizontalSplit] = useState(58);

  return (
    <DemoFrame
      title="Resizable work area"
      description="Drag the splitter or focus it and use arrow keys."
      showThemes={false}
    >
      <DemoStack>
        <div
          {...stylex.props(styles.verticalShell)}
          style={{ gridTemplateColumns: `${verticalSplit}% auto 1fr` }}
        >
          <section {...stylex.props(styles.pane)}>
            <strong>Navigator</strong>
            <DemoMuted>Project files and sections.</DemoMuted>
          </section>
          <WindowSplitter
            label="Resize navigator"
            onValueChange={setVerticalSplit}
            value={verticalSplit}
          />
          <section {...stylex.props(styles.pane)}>
            <strong>Editor</strong>
            <DemoMuted>
              Drag the vertical divider to resize this area.
            </DemoMuted>
          </section>
        </div>

        <div
          {...stylex.props(styles.horizontalShell)}
          style={{ gridTemplateRows: `${horizontalSplit}% auto 1fr` }}
        >
          <section {...stylex.props(styles.pane)}>
            <strong>Preview</strong>
            <DemoMuted>Primary content stays above the console.</DemoMuted>
          </section>
          <WindowSplitter
            label="Resize console"
            onValueChange={setHorizontalSplit}
            orientation="horizontal"
            value={horizontalSplit}
          />
          <section {...stylex.props(styles.pane)}>
            <strong>Console</strong>
            <DemoMuted>
              Use ArrowUp and ArrowDown after focusing the splitter.
            </DemoMuted>
          </section>
        </div>
      </DemoStack>
    </DemoFrame>
  );
}

const styles = stylex.create({
  verticalShell: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.bgSubtle,
    display: "grid",
    minHeight: "220px",
  },
  horizontalShell: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.bgSubtle,
    display: "grid",
    minHeight: "280px",
  },
  pane: {
    padding: spacing.md,
    gap: spacing.xs,
    alignContent: "start",
    color: colors.fg,
    display: "grid",
    fontFamily: typography.fontSans,
    minHeight: 0,
    minWidth: 0,
  },
});
