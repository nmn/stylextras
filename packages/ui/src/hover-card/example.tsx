"use client";

import * as stylex from "@stylexjs/stylex";
import { Button } from "../button";
import { Avatar } from "../avatar";
import { DemoFrame } from "../example-theme/demo";
import { colors } from "../tokens/color.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { typography } from "../tokens/typography.stylex";
import {
  HoverCardContent,
  type HoverCardContentProps,
  HoverCardTrigger,
} from "./index";

function HoverCardExampleContent(props: HoverCardContentProps) {
  return (
    <HoverCardContent {...props} sx={styles.card}>
      <div {...stylex.props(styles.profileHeader)}>
        <Avatar
          alt=""
          aria-hidden="true"
          size="lg"
          src={profile.avatar}
          sx={styles.profileAvatar}
        />
        <div {...stylex.props(styles.identity)}>
          <strong {...stylex.props(styles.name)}>{profile.name}</strong>
          <span {...stylex.props(styles.handle)}>{profile.handle}</span>
        </div>
      </div>

      <p {...stylex.props(styles.bio)}>{profile.bio}</p>

      <div {...stylex.props(styles.stats)}>
        <span>
          <strong>{profile.followers}</strong> followers
        </span>
        <span>
          <strong>{profile.following}</strong> following
        </span>
      </div>

      <div {...stylex.props(styles.actions)}>
        <Button type="button" size="sm" variant="primary">
          Follow
        </Button>
        <Button type="button" size="sm" variant="secondary">
          Message
        </Button>
      </div>
    </HoverCardContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Profile preview"
      description="Hover or focus the avatar link for a tooltip preview. Press ArrowDown or move into the card to open the dialog."
    >
      <HoverCardTrigger
        aria-label={`Open ${profile.name}'s profile`}
        as="a"
        content={() => Promise.resolve(HoverCardExampleContent)}
        href="#basic-usage"
        sx={styles.trigger}
      >
        <Avatar alt={profile.name} size="lg" src={profile.avatar} />
      </HoverCardTrigger>
    </DemoFrame>
  );
}

const profile = {
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  bio: "Design systems engineer building accessible, platform-native interfaces.",
  followers: "18.4k",
  following: "412",
  handle: "@maya",
  name: "Maya Chen",
};

const styles = stylex.create({
  actions: {
    gap: spacing.sm,
    display: "flex",
  },
  bio: {
    margin: 0,
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
  card: {
    width: "min(320px, calc(100vw - 32px))",
  },
  handle: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
  },
  identity: {
    gap: spacing.xxs,
    display: "grid",
  },
  name: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
  },
  profileAvatar: {
    flexShrink: 0,
  },
  profileHeader: {
    gap: spacing.sm,
    alignItems: "center",
    display: "flex",
  },
  stats: {
    gap: spacing.md,
    color: colors.fgMuted,
    display: "flex",
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
  },
  trigger: {
    borderRadius: "999px",
    textDecoration: "none",
    display: "inline-flex",
  },
});
