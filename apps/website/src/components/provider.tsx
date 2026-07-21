/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use client";

import {
  FrameworkProvider,
  type Framework,
} from "fumadocs-core/framework";
import { RootProvider } from "fumadocs-ui/provider/base";
import {
  type ComponentType,
  type ComponentProps,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link as WakuLink,
  unstable_RouterContext,
  unstable_parseRoute,
} from "waku/router/client";
import { SearchDialog } from "./search-dialog";

type FrameworkLinkProps = ComponentProps<"a"> & { prefetch?: boolean };

// Bun may resolve Waku and the app through separate @types/react peer paths.
// Their runtime anchor contract is the same, so keep that boundary local here.
const CompatibleWakuLink = WakuLink as unknown as ComponentType<
  Omit<FrameworkLinkProps, "href" | "prefetch"> & { to: string }
>;

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

function usePathname() {
  const router = useContext(unstable_RouterContext);
  const hydrated = useHydrated();

  if (!hydrated) {
    return "/";
  }

  return router?.route.path ?? window.location.pathname;
}

function useParams() {
  const router = useContext(unstable_RouterContext);
  const hydrated = useHydrated();
  const query = hydrated
    ? (router?.route.query ?? window.location.search.slice(1))
    : "";

  return useMemo(() => {
    const params: Record<string, string | string[]> = {};

    for (const [key, value] of new URLSearchParams(query)) {
      const current = params[key];
      params[key] = current
        ? Array.isArray(current)
          ? [...current, value]
          : [current, value]
        : value;
    }

    return params;
  }, [query]);
}

function useRouter() {
  const router = useContext(unstable_RouterContext);

  const push = useCallback(
    (url: string) => {
      if (!router) {
        window.location.assign(url);
        return;
      }

      const nextUrl = new URL(url, window.location.href);
      const currentPath = window.location.pathname;
      const pathChanged = nextUrl.pathname !== currentPath;

      void router
        .changeRoute(unstable_parseRoute(nextUrl), {
          shouldScroll: pathChanged,
        })
        .then(() => {
          if (window.location.pathname === currentPath) {
            window.history.pushState(
              {
                ...window.history.state,
                waku_new_path: pathChanged,
              },
              "",
              nextUrl,
            );
          }
        })
        .catch(() => {
          window.location.assign(url);
        });
    },
    [router],
  );

  return useMemo(
    () => ({
      push,
      refresh() {
        window.location.reload();
      },
    }),
    [push],
  );
}

function Link({
  children,
  href = "",
  prefetch: _prefetch,
  ...props
}: FrameworkLinkProps) {
  return (
    <CompatibleWakuLink to={href} {...props}>
      {children}
    </CompatibleWakuLink>
  );
}

const framework: Framework = {
  Link,
  useParams,
  usePathname,
  useRouter,
};

export function Provider({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider {...framework}>
      <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
    </FrameworkProvider>
  );
}
