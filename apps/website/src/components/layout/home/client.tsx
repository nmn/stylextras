/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client'

import { Fragment } from 'react'
import * as stylex from '@stylexjs/stylex'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@stylextras/ui/navigation-menu'
import { BaseLinkItem, type LinkItemType, type StyleXComponentProps } from '../shared/index'
import { RouterButtonLink, RouterLink } from '../../router-link'
import { vars } from '../../../theming/vars.stylex'

export function Navbar({
  children,
  xstyle,
  disableShadowBlur,
  ...props
}: StyleXComponentProps<'header'> & { disableShadowBlur?: boolean }) {
  return (
    <>
      <div {...stylex.props(navbarStyles.gap)} />
      <header id="nd-nav" {...props} {...stylex.props(navbarStyles.header, xstyle)}>
        <div
          {...stylex.props(
            navbarStyles.gradientBlur,
            disableShadowBlur && navbarStyles.disableShadowBlur,
          )}
        />
        <div
          {...stylex.props(
            navbarStyles.gradientFade,
            disableShadowBlur && navbarStyles.disableShadowBlur,
          )}
        />
        <div {...stylex.props(navbarStyles.backdrop)}>
          <div {...stylex.props(navbarStyles.blur)} />
        </div>

        <NavigationMenu
          aria-label="Primary navigation"
          sx={[navbarStyles.menuList, navbarStyles.nav, xstyle]}
        >
          {children}
        </NavigationMenu>
        <div {...stylex.props(navbarStyles.overlayBlur)} />
      </header>
    </>
  )
}

export function NavbarLinkItem({
  item,
  menuId,
  xstyle,
}: {
  item: LinkItemType
  menuId: string
  xstyle?: stylex.StyleXStyles
}) {
  if (item.type === 'custom') {
    return (
      <NavigationMenuItem sx={navItemStyles.listItem}>
        <div {...stylex.props(xstyle)}>{item.children}</div>
      </NavigationMenuItem>
    )
  }

  if (item.type === 'menu') {
    return (
      <NavigationMenuItem sx={navItemStyles.listItem}>
        <NavigationMenuTrigger
          target={menuId}
          sx={[navItemVariants.base, navItemVariants.default, navItemStyles.menuTrigger, xstyle]}
        >
          {item.text}
        </NavigationMenuTrigger>
        <NavigationMenuContent id={menuId} sx={navItemStyles.menuContent}>
          {item.url ? (
            <RouterLink
              external={item.external}
              href={item.url}
              sx={[navItemStyles.menuLink, navItemStyles.menuRootLink]}
            >
              {item.text}
            </RouterLink>
          ) : null}
          {item.items.map((child, index) => {
            if (child.type === 'custom') {
              return <Fragment key={index}>{child.children}</Fragment>
            }

            const {
              banner = child.icon ? (
                <div {...stylex.props(navItemStyles.iconContainer)}>{child.icon}</div>
              ) : null,
              xstyle: menuLinkXstyle,
              ...rest
            } = child.menu ?? {}

            return (
              <RouterLink
                external={child.external}
                href={child.url}
                key={`${index}-${child.url}`}
                {...rest}
                sx={[navItemStyles.menuLink, menuLinkXstyle]}
              >
                {rest.children ?? (
                  <>
                    {banner}
                    <p {...stylex.props(navItemStyles.menuLinkTitle)}>{child.text}</p>
                    <p {...stylex.props(navItemStyles.menuLinkDescription)}>{child.description}</p>
                  </>
                )}
              </RouterLink>
            )
          })}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  if (item.type === 'icon') {
    const accessibleName = item.label ?? (typeof item.text === 'string' ? item.text : 'Open link')
    return (
      <NavigationMenuItem sx={navItemStyles.listItem}>
        <RouterButtonLink
          aria-label={accessibleName}
          external={item.external}
          href={item.url}
          size="icon"
          sx={[navItemVariants.base, xstyle]}
          variant="ghost"
        >
          {item.icon}
        </RouterButtonLink>
      </NavigationMenuItem>
    )
  }

  if (item.type === 'button') {
    return (
      <NavigationMenuItem sx={navItemStyles.listItem}>
        <RouterButtonLink
          external={item.external}
          href={item.url}
          size="md"
          sx={[navItemVariants.base, navItemVariants.button, xstyle]}
          variant="secondary"
        >
          {item.icon}
          {item.text}
        </RouterButtonLink>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem sx={navItemStyles.listItem}>
      <BaseLinkItem item={item} xstyle={[navItemVariants.base, navItemVariants.default, xstyle]}>
        {item.text}
      </BaseLinkItem>
    </NavigationMenuItem>
  )
}

const navbarStyles = stylex.create({
  gap: {
    height: 56,
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4 * 4,
    alignItems: 'center',
    paddingInline: 4 * 4,
  },
  header: {
    position: 'fixed',
    insetInline: 0,
    top: 0,
    zIndex: 10,
    height: 56 + 16,
    padding: 8,
  },
  backdrop: {
    position: 'absolute',
    inset: 8,
    overflow: 'hidden',
    pointerEvents: 'none',
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    cornerShape: 'squircle',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
  },
  blur: {
    position: 'absolute',
    inset: -8,
    bottom: -32,
    pointerEvents: 'none',
    backdropFilter: 'blur(16px) saturate(600%)',
  },
  gradientBlur: {
    position: 'absolute',
    inset: -8,
    bottom: -32,
    pointerEvents: 'none',
    backdropFilter: 'blur(32px)',
    maskImage: 'linear-gradient(to bottom, white 30%, transparent)',
  },
  gradientFade: {
    position: 'absolute',
    inset: -8,
    bottom: -32,
    pointerEvents: 'none',
    backgroundColor: vars['--color-fd-background'],
    maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 50%, transparent)',
  },
  disableShadowBlur: {
    bottom: -8,
  },
  overlayBlur: {
    position: 'absolute',
    inset: 9,
    zIndex: 10,
    overflow: 'hidden',
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    borderRadius: 19,
    cornerShape: 'squircle',
    backdropFilter: 'blur(20px) saturate(1000%)',
    maskImage: 'linear-gradient(to bottom, white, transparent 16%, transparent 84%, white)',
  },
  menuList: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 'var(--max-w-fd-container)',
    height: 14 * 4,
    paddingInline: 4 * 4,
    marginInline: 'auto',
  },
})

const navItemVariants = stylex.create({
  base: {
    // eslint-disable-next-line @stylexjs/valid-styles
    ['--svg-size' as any]: '4px',
  },
  default: {
    display: 'inline-flex',
    gap: 1 * 4,
    alignItems: 'center',
    minHeight: 0,
    padding: 2 * 4,
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: {
      default: vars['--color-fd-secondary-foreground'],
      ':where([data-active=true])': vars['--color-fd-primary'],
      ':hover': vars['--color-fd-primary'],
    },
    textDecoration: 'none',
    borderColor: 'transparent',
    borderRadius: 8,
    cornerShape: 'squircle',
  },
  button: {
    gap: 1.5 * 4,
    minHeight: 0,
    padding: 2 * 4,
    fontSize: `${14 / 16}rem`,
  },
})

const navItemStyles = stylex.create({
  listItem: {
    listStyleType: 'none',
  },
  iconContainer: {
    width: 'fit-content',
    padding: 4,
    backgroundColor: vars['--color-fd-muted'],
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: '8px',
    // eslint-disable-next-line @stylexjs/valid-styles
    ['--svg-size' as any]: '4px',
  },
  menuLink: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2 * 4,
    padding: 3 * 4,
    color: { default: null, ':hover': vars['--color-fd-primary'] },
    backgroundColor: {
      default: vars['--color-fd-card'],
      ':hover': `color-mix(in oklab, ${vars['--color-fd-accent']} 80%, transparent)`,
    },
    borderColor: vars['--color-fd-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: '8px',
    textDecoration: 'none',
    transitionProperty: 'background-color, color',
  },
  menuRootLink: {
    gridColumn: '1 / -1',
  },
  menuLinkTitle: {
    margin: 0,
    fontSize: `${15 / 16}rem`,
    fontWeight: 500,
  },
  menuLinkDescription: {
    display: { default: null, ':empty': 'none' },
    margin: 0,
    fontSize: `${12 / 16}rem`,
    color: vars['--color-fd-muted-foreground'],
  },
  menuTrigger: {
    borderRadius: '8px',
  },
  menuContent: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 1024px)': 'repeat(3, 1fr)',
      '@media (min-width: 768px) and (max-width: 1024px)': 'repeat(2, 1fr)',
    },
    gap: 2 * 4,
    padding: 4 * 4,
  },
})
