import * as stylex from "@stylexjs/stylex";
import { stylePresetThemes } from "@stylextras/ui/style-presets";
import { websiteLegacyColorTheme } from "@/theming/vars.stylex";
import type { ReactNode } from "react";
import { ErrorBoundary } from "waku/router/client";

export default function RootElement({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          {...stylex.props(
            ...stylePresetThemes("docs"),
            websiteLegacyColorTheme,
          )}
        >
          {children}
        </body>
      </html>
    </ErrorBoundary>
  );
}

export const getConfig = async () => ({ render: "static" as const });
