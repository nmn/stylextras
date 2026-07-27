'use client'

import { ButtonLink, type ButtonLinkProps } from '@stylextras/ui/button'
import { Link, type LinkProps } from '@stylextras/ui/link'
import { useRouter } from 'fumadocs-core/framework'
import type { MouseEvent, MouseEventHandler } from 'react'

type RouterNavigationProps = {
  external?: boolean
  href: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

type WithRouterNavigation<Props> = Props extends unknown
  ? Omit<Props, keyof RouterNavigationProps | 'href'> & RouterNavigationProps
  : never

export type RouterLinkProps = WithRouterNavigation<LinkProps>
export type RouterButtonLinkProps = WithRouterNavigation<ButtonLinkProps>

function isExternalHref(href: string) {
  return /^\w+:/.test(href) || href.startsWith('//')
}

function shouldUseClientNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  external: boolean,
) {
  if (
    external ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return false
  }

  const anchor = event.currentTarget
  if (
    anchor.hasAttribute('download') ||
    anchor.hasAttribute('target') ||
    href.includes('#')
  ) {
    return false
  }

  const url = new URL(href, window.location.href)
  return (
    (url.protocol === 'http:' || url.protocol === 'https:') && url.origin === window.location.origin
  )
}

function useRouterClick({ external = false, href, onClick }: RouterNavigationProps) {
  const router = useRouter()

  return (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (!shouldUseClientNavigation(event, href, external)) return

    const url = new URL(href, window.location.href)
    event.preventDefault()
    router.push(`${url.pathname}${url.search}`)
  }
}

/**
 * A token-styled native link that opts eligible same-origin clicks into Waku
 * navigation while preserving the browser's behavior for every other anchor.
 */
export function RouterLink({
  external,
  href,
  onClick,
  rel,
  target,
  ...props
}: RouterLinkProps) {
  const resolvedExternal = external ?? isExternalHref(href)
  const handleClick = useRouterClick({
    external: resolvedExternal,
    href,
    onClick,
  })
  return (
    <Link
      {...props}
      href={href}
      onClick={handleClick}
      rel={rel ?? (resolvedExternal ? 'noreferrer noopener' : undefined)}
      target={target ?? (resolvedExternal ? '_blank' : undefined)}
    />
  )
}

/** The button-styled counterpart to RouterLink. */
export function RouterButtonLink({
  external,
  href,
  onClick,
  rel,
  target,
  ...props
}: RouterButtonLinkProps) {
  const resolvedExternal = external ?? isExternalHref(href)
  const handleClick = useRouterClick({
    external: resolvedExternal,
    href,
    onClick,
  })
  return (
    <ButtonLink
      {...props}
      href={href}
      onClick={handleClick}
      rel={rel ?? (resolvedExternal ? 'noreferrer noopener' : undefined)}
      target={target ?? (resolvedExternal ? '_blank' : undefined)}
    />
  )
}
