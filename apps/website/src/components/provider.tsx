/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client'

import { FrameworkProvider, type Framework } from 'fumadocs-core/framework'
import { RootProvider } from 'fumadocs-ui/provider/base'
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { unstable_RouterContext, unstable_parseRoute } from 'waku/router/client'
import { SearchDialog } from './search-dialog'
import { RouterLink } from './router-link'

type FrameworkLinkProps = ComponentProps<'a'> & { prefetch?: boolean }

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}

function usePathname() {
  const router = useContext(unstable_RouterContext)
  const hydrated = useHydrated()

  if (!hydrated) {
    return '/'
  }

  return router?.route.path ?? window.location.pathname
}

function useParams() {
  const router = useContext(unstable_RouterContext)
  const hydrated = useHydrated()
  const query = hydrated ? (router?.route.query ?? window.location.search.slice(1)) : ''

  return useMemo(() => {
    const params: Record<string, string | string[]> = {}

    for (const [key, value] of new URLSearchParams(query)) {
      const current = params[key]
      params[key] = current
        ? Array.isArray(current)
          ? [...current, value]
          : [current, value]
        : value
    }

    return params
  }, [query])
}

function useRouter() {
  const router = useContext(unstable_RouterContext)

  const push = useCallback(
    (url: string) => {
      if (!router) {
        window.location.assign(url)
        return
      }

      const nextUrl = new URL(url, window.location.href)
      const currentPath = window.location.pathname
      const pathChanged = nextUrl.pathname !== currentPath

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
              '',
              nextUrl,
            )
          }
        })
        .catch(() => {
          window.location.assign(url)
        })
    },
    [router],
  )

  return useMemo(
    () => ({
      push,
      refresh() {
        window.location.reload()
      },
    }),
    [push],
  )
}

function Link({ children, href = '', prefetch: _prefetch, ...props }: FrameworkLinkProps) {
  return (
    <RouterLink href={href} {...props}>
      {children}
    </RouterLink>
  )
}

const framework: Framework = {
  Link,
  useParams,
  usePathname,
  useRouter,
}

export function Provider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.dataset.websiteHydrated = 'true'
    return () => {
      delete document.body.dataset.websiteHydrated
    }
  }, [])

  return (
    <FrameworkProvider {...framework}>
      <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
    </FrameworkProvider>
  )
}
