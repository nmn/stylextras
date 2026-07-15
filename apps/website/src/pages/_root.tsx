import type { ReactNode } from "react";
import { ErrorBoundary } from "waku/router/client";

export default function RootElement({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>{children}</body>
      </html>
    </ErrorBoundary>
  );
}

export const getConfig = async () => ({ render: "static" as const });
