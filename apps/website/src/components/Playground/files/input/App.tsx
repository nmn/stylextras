import * as stylex from "@stylexjs/stylex";
import _ from "@stylexjs/atoms";

import { colors } from "@stylextras/ui/tokens/color.stylex";
import { blurThemes } from "@stylextras/ui/blur-themes";
import { colorThemes } from "@stylextras/ui/color-themes";
import { elevationThemes } from "@stylextras/ui/elevation-themes";
import { motionThemes } from "@stylextras/ui/motion-themes";
import { radiusThemes } from "@stylextras/ui/radius-themes";
import { spacingThemes } from "@stylextras/ui/spacing-themes";
import { strokeThemes } from "@stylextras/ui/stroke-themes";

import { Card } from "@stylextras/ui/card";
import { Button } from "@stylextras/ui/button";
import Logo from "./Logo";

/**
 * Welcome to the StyleXtras playground!
 *
 * Edit the code and see styles update instantly.
 * Every @stylextras/ui component, theme and @stylexjs/atoms are available.
 * Share the URL to collaborate or send examples to others.
 */

export default function App() {
  return (
    <div
      {...stylex.props(
        colorThemes.docs,
        blurThemes.docs,
        elevationThemes.docs,
        motionThemes.docs,
        radiusThemes.docs,
        spacingThemes.docs,
        strokeThemes.wireframe,
        _.display.flex,
        _.flexDirection.column,
        _.alignItems.center,
        _.justifyContent.center,
        _.minHeight["100dvh"],
        _.padding._32px,
        styles.page,
      )}
    >
      <Card sx={styles.card}>
        <div {...stylex.props(styles.contentBlock, styles.titleRow)}>
          <Logo style={styles.logo} />
          <h1 {...stylex.props(styles.postLogo)}>tras</h1>
        </div>

        <ul {...stylex.props(styles.contentBlock, styles.list)}>
          <li {...stylex.props(styles.li)}>
            Edit the root component in <code>App.tsx</code>.
          </li>
          <li {...stylex.props(styles.li)}>
            Import any component from <code></code>.
          </li>
          <li {...stylex.props(styles.li)}>
            Build inline atomic styles with <code>@stylexjs/atoms</code>.
          </li>
          <li {...stylex.props(styles.li)}>
            Copy the URL to share your designs.
          </li>
        </ul>

        <div {...stylex.props(styles.contentBlock, styles.buttonRow)}>
          <Button
            sx={styles.action}
            variant="primary"
            onClick={() =>
              window.open("https://stylexjs.com/docs", "_blank", "noreferrer")
            }
          >
            See the docs
            <span {...stylex.props(styles.linkIcon)}>→</span>
          </Button>
          <Button
            sx={styles.action}
            variant="outline"
            onClick={() =>
              window.open(
                "https://github.com/nmn/stylextras",
                "_blank",
                "noreferrer",
              )
            }
          >
            View on GitHub
            <span {...stylex.props(styles.linkIcon)}>→</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

const styles = stylex.create({
  page: {
    backgroundColor: colors.bg,
  },

  card: {
    maxWidth: 440,
    padding: 32,
    paddingBlock: 32,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    backgroundColor: colors.bgOverlay,
    borderWidth: 1,
    borderRadius: 48,
    boxShadow: "0 16px 40px rgb(0 0 0 / 2%), 0 2px 10px rgb(0 0 0 / 4%)",
  },

  contentBlock: {
    width: "100%",
    margin: 0,
  },

  logo: {
    height: 50,
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginInline: "auto",
    gap: 12,
    width: "100%",
  },

  postLogo: {
    margin: 0,
    fontSize: 30,
    marginBottom: 6,
    fontWeight: 400,
    textAlign: "left",
    color: colors.fg,
    marginLeft: -8,
  },

  h1: {
    margin: 0,
    fontSize: 30,
    marginBottom: 6,
    fontWeight: 400,
    textAlign: "left",
    color: colors.accent,
  },

  list: {
    fontSize: 15,
    lineHeight: 1.5,
    padding: 0,
    gap: 8,
    color: colors.fgMuted,
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
  },
  li: {
    position: "relative",
    padding: 16,
    paddingLeft: 48,
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: colors.border,
    borderTopLeftRadius: { default: 4, ":first-child": 16 },
    borderTopRightRadius: { default: 4, ":first-child": 16 },
    borderBottomLeftRadius: { default: 4, ":last-child": 16 },
    borderBottomRightRadius: { default: 4, ":last-child": 16 },
    "::before": {
      content: '"✓"',
      height: "1.6em",
      width: "1.6em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.8em",
      backgroundColor: `color-mix(in srgb, ${colors.brand} 40%, transparent)`,
      position: "absolute",
      top: 15,
      left: 14,
    },
  },

  buttonRow: {
    marginTop: 10,
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },

  action: {
    flexGrow: 1,
    borderRadius: 16,
    minHeight: 52,
  },

  linkIcon: {
    display: "inline-flex",
    marginInlineStart: 8,
    transitionProperty: "transform",
    transitionDuration: "0.2s",
    transitionTimingFunction: "ease-in-out",
    transform: {
      default: "translateX(0)",
      [stylex.when.ancestor(":hover")]: "translateX(8px)",
    },
  },
});
