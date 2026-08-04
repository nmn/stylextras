/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use client";

import { vars } from "@/theming/vars.stylex";
import * as stylex from "@stylexjs/stylex";
import {
  Card as UICard,
  CardContent as UICardContent,
  CardDescription as UICardDescription,
  CardHeader as UICardHeader,
  CardTitle as UICardTitle,
} from "@stylextras/ui/card";
import type { HTMLAttributes, ReactNode } from "react";
import { RouterLink } from "@/components/router-link";
import { cardLinkMarker } from "./mdx.stylex";

export interface CardsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  children: ReactNode;
}

export function Cards({ children, ...props }: CardsProps) {
  return (
    <div {...stylex.props(styles.cards)} {...props}>
      {children}
    </div>
  );
}

export interface CardProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "style" | "title"
> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  external?: boolean;
  children?: ReactNode;
}

export function Card({
  icon,
  title,
  description,
  href,
  external,
  children,
  ...props
}: CardProps) {
  const content = (
    <>
      <UICardHeader>
        {icon != null && <div {...stylex.props(styles.icon)}>{icon}</div>}
        <UICardTitle>{title}</UICardTitle>
        {description != null && (
          <UICardDescription>{description}</UICardDescription>
        )}
      </UICardHeader>
      {children != null && (
        <UICardContent>{children}</UICardContent>
      )}
    </>
  );

  if (href != null) {
    return (
      <RouterLink
        external={external}
        href={href}
        sx={
          [styles.cardLink, cardLinkMarker] as unknown as stylex.StyleXStyles
        }
        {...props}
      >
        <UICard sx={styles.linkedCard}>{content}</UICard>
      </RouterLink>
    );
  }

  return (
    <UICard {...props}>
      {content}
    </UICard>
  );
}

const DURATION = "0.2s";
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const styles = stylex.create({
  cards: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, 1fr)",
      "@media (max-width: 768px)": "1fr",
    },
    gap: 12,
    marginTop: 12,
    containerType: "inline-size",
  },
  cardLink: {
    display: "block",
    cursor: "pointer",
    textDecoration: "none",
  },
  linkedCard: {
    height: "100%",
    backgroundColor: {
      default: vars["--color-fd-card"],
      [stylex.when.ancestor(":hover", cardLinkMarker)]:
        "light-dark(hsl(0, 0%, 97%), hsl(0, 0%, 16%))",
    },
    borderColor: {
      default: vars["--color-fd-border"],
      [stylex.when.ancestor(":hover", cardLinkMarker)]:
        vars["--color-fd-primary"],
    },
    transitionTimingFunction: EASING,
    transitionDuration: DURATION,
    transitionProperty: "background-color, border-color",
  },
  icon: {
    width: "fit-content",
    padding: 6,
    marginBottom: 8,
    color: vars["--color-fd-muted-foreground"],
    backgroundColor: vars["--color-fd-muted"],
    borderColor: vars["--color-fd-border"],
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
});
