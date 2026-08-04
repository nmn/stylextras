import { HTML } from "@/contexts/WebsiteThemeContext";
import type { ReactNode } from "react";
import { ErrorBoundary } from "waku/router/client";

export default function RootElement({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <HTML>
        <head />
        <body>{children}</body>
      </HTML>
    </ErrorBoundary>
  );
}

export const getConfig = async () => ({ render: "static" as const });
