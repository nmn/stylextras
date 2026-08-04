/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client';

import Footer from '@/components/Footer';
import { RouterLink } from '@/components/router-link';
import { SidebarContext } from '@/contexts/SidebarContext';
import * as stylex from '@stylexjs/stylex';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@stylextras/ui/collapsible';
import {
  SidebarGroupLabel,
  SidebarNavigation,
  Sidebar as UISidebar,
} from '@stylextras/ui/sidebar';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import { TreeContextProvider, useTreeContext } from 'fumadocs-ui/contexts/tree';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, use, useEffect, useRef } from 'react';
import { activeLinkMarker, vars } from '../../theming/vars.stylex';
import { Header } from './home';
import { BaseLayoutProps } from './shared';

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  children: ReactNode;
}

export function DocsLayout({ tree, children, ...props }: DocsLayoutProps) {
  const [sidebarOpen] = use(SidebarContext);

  return (
    <TreeContextProvider tree={tree}>
      <Header
        githubUrl={props.githubUrl}
        i18n={props.i18n}
        links={props.links}
        nav={props.nav}
      />

      <div {...stylex.props(layoutStyles.wrapper)}>
        <div
          id="nd-docs-layout"
          {...stylex.props(
            layoutStyles.main,
            sidebarOpen === false && layoutStyles.mainWithSidebarClosed,
          )}
        >
          <Sidebar />
          <div {...stylex.props(layoutStyles.content)}>{children}</div>
          <Footer />
        </div>
      </div>
    </TreeContextProvider>
  );
}
const layoutStyles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100dvh - 56px)',
  },
  main: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    // eslint-disable-next-line @stylexjs/valid-styles
    ['--fd-nav-height' as any]: '64px',
    paddingInlineStart: {
      default: 292,
      '@media (max-width: 767.9px)': 0,
    },
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '0.15s',
    transitionProperty: 'padding-inline-start',
  },
  mainWithSidebarClosed: {
    paddingInlineStart: 0,
  },
  content: {
    // flexGrow: 1,
    // minWidth: 0,
  },
});

function Sidebar() {
  const { root } = useTreeContext();
  const [open] = use(SidebarContext);

  const sidebarRef = useRef<HTMLElement>(null);

  return (
    <div
      {...stylex.props(
        sidebarStyles.container,
        open === true && sidebarStyles.open,
        open === false && sidebarStyles.closed,
      )}
    >
      <div {...stylex.props(sidebarStyles.blurContainer)}>
        <div {...stylex.props(sidebarStyles.blur)} />
      </div>

      <UISidebar
        aria-label="Documentation"
        mode="inline"
        ref={sidebarRef}
        sx={sidebarStyles.base}
        tabIndex={0}
      >
        <SidebarNavigation
          aria-label="Documentation pages"
          sx={sidebarStyles.navigation}
        >
          <SidebarTreeItems items={root.children} />
        </SidebarNavigation>
      </UISidebar>

      <div {...stylex.props(sidebarStyles.overlayBlur)} />
    </div>
  );
}

function SidebarTreeItems({ items }: { items: PageTree.Node[] }) {
  return items.map((item) => (
    <SidebarItem item={item} key={item.$id}>
      {item.type === 'folder' ? (
        <SidebarTreeItems items={item.children} />
      ) : null}
    </SidebarItem>
  ));
}
const sidebarStyles = stylex.create({
  container: {
    position: 'fixed',
    insetInlineStart: 0,
    top: 64,
    zIndex: 10,
    display: 'flex',
    visibility: {
      default: 'visible',
      '@media (max-width: 767.9px)': 'hidden',
    },
    flexShrink: 0,
    alignSelf: 'flex-start',
    height: 'calc(100dvh - 64px)',
    padding: 8,
    transform: {
      default: 'translateX(0px)',
      '@media (max-width: 767.9px)':
        'translateX(var(--sidebar-closed-translate))',
    },
    transitionDelay: {
      default: '0s',
      '@media (max-width: 767.9px)': '0s, 0.15s',
    },
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '0.15s, 0s',
    transitionProperty: 'transform, visibility',
    '--sidebar-closed-translate': {
      default: '-100%',
      ':dir(rtl)': '100%',
    },
  },
  open: {
    visibility: 'visible',
    transform: 'translateX(0)',
    transitionDelay: '0s',
  },
  closed: {
    visibility: 'hidden',
    transform: 'translateX(var(--sidebar-closed-translate))',
    transitionDelay: '0s, 0.15s',
  },
  blurContainer: {
    position: 'absolute',
    inset: 8,
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: radius.xxl,
    cornerShape: 'squircle',
  },
  blur: {
    position: 'absolute',
    inset: -64,
    insetInlineStart: -8,
    bottom: 0,
    backdropFilter: 'blur(32px) saturate(500%)',
  },
  overlayBlur: {
    position: 'absolute',
    inset: 9,
    zIndex: 1,
    overflow: 'hidden',
    pointerEvents: 'none',
    borderRadius: `max(0px, calc(${radius.xxl} - 1px))`,
    cornerShape: 'squircle',
    backdropFilter: 'blur(32px) saturate(800%)',
    maskImage:
      'linear-gradient(to right, white, transparent 4%, transparent 88%, white)',
  },
  base: {
    zIndex: 1,
    rowGap: 2,
    columnGap: 2,
    width: 280,
    height: '100%',
    padding: 6 * 4,
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    fontSize: '1rem',
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-card']} 35%, transparent)`,
    borderColor: vars['--color-fd-border'],
    borderWidth: 1,
    borderRadius: radius.xxl,
    cornerShape: 'squircle',
  },
  navigation: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'column',
    rowGap: 2,
    columnGap: 2,
    width: '100%',
  },
});

function SidebarItem({
  item,
  children,
}: {
  item: PageTree.Node;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (item.type === 'page') {
    return (
      <RouterLink
        aria-current={pathname === item.url ? 'page' : undefined}
        href={item.url}
        sx={
          [
            linkVariants.base,
            pathname === item.url ? linkVariants.active : linkVariants.inactive,
            pathname === item.url && activeLinkMarker,
          ] as stylex.StyleXStyles
        }
      >
        {item.icon}
        {item.name}
      </RouterLink>
    );
  }

  if (item.type === 'separator') {
    return (
      <SidebarGroupLabel as="p" sx={sidebarItemStyles.separator}>
        {item.icon}
        {item.name}
      </SidebarGroupLabel>
    );
  }

  // type "folder"
  return <SidebarItemFolder item={item}>{children}</SidebarItemFolder>;
}

function SidebarItemFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const pathname = usePathname();
  function checkActiveDescendant(item: PageTree.Node): boolean {
    if (item.type === 'page') {
      return pathname === item.url;
    }
    if (item.type === 'folder') {
      if (item.index && pathname.startsWith(item.index.url)) {
        return true;
      }
      return item.children.some(checkActiveDescendant);
    }
    return false;
  }

  const isDescendantActive = checkActiveDescendant(item);
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (isDescendantActive) {
      if (ref.current) {
        ref.current.open = true;
      }
    }
  }, [isDescendantActive]);

  // type "folder"
  return (
    <Collapsible ref={ref} sx={sidebarItemStyles.details}>
      <CollapsibleTrigger
        indicator={<ChevronDown {...stylex.props(sidebarItemStyles.chevron)} />}
        indicatorPosition="end"
        sx={sidebarItemStyles.summary}
      >
        {item.index ? (
          <RouterLink
            aria-current={pathname === item.index.url ? 'page' : undefined}
            href={item.index.url}
            sx={[
              linkVariants.base,
              sidebarItemStyles.summaryLink,
              pathname === item.index.url
                ? linkVariants.active
                : linkVariants.inactive,
            ]}
          >
            {item.index.icon}
            {item.index.name}
          </RouterLink>
        ) : (
          <p
            {...stylex.props(
              linkVariants.base,
              sidebarItemStyles.summaryLink,
              sidebarItemStyles.textStart,
            )}
          >
            {item.icon}
            {item.name}
          </p>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent sx={sidebarItemStyles.childContainer}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

const sidebarItemStyles = stylex.create({
  separator: {
    padding: 0,
    marginTop: { default: 5 * 4, ':first-child': 0 },
    marginBottom: 1.5 * 4,
    // text-fd-muted-foreground mt-6 mb-2 first:mt-0
    fontSize: `${14 / 16}rem`,
    fontWeight: 'inherit',
    color: colors.fgMuted,
    textTransform: 'none',
    letterSpacing: 'normal',
  },
  details: {
    width: '100%',
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    '--rotation': {
      default: '-90deg',
      ':is([open])': '0deg',
    },
    '--summary-color': {
      default: null,
      [stylex.when.descendant(':is(*)', activeLinkMarker)]: colors.accentText,
    },
    // '--details-child-height': {
    //   default: '0px',
    //   ':is([open])': 'auto',
    // },
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    rowGap: 0,
    columnGap: 0,
    alignItems: 'center',
    minHeight: 'auto',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: {
      default: `var(--summary-color, ${colors.fgSoft})`,
      ':hover': colors.accentText,
    },
    overflowWrap: 'normal',
    listStyle: 'none',
    backgroundColor: 'transparent',
  },
  chevron: {
    flexShrink: 0,
    width: 14,
    height: 14,
    transform: 'rotate(var(--rotation))',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '0.15s',
    transitionProperty: 'transform',
  },
  summaryLink: {
    color: 'inherit',
  },
  textStart: { textAlign: 'start' },
  childContainer: {
    borderBlockWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 2,
    columnGap: 2,
    paddingBlock: 0,
    paddingInlineStart: 15,
    paddingInlineEnd: 0,
    marginInlineStart: 1,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
    overflowWrap: 'normal',
    borderInlineStartColor: vars['--color-fd-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    borderInlineEndWidth: 0,
    // eslint-disable-next-line @stylexjs/valid-styles
    ['--summary-color' as any]: 'initial',
  },
});

const linkVariants = stylex.create({
  base: {
    position: 'relative',
    display: 'inline-flex',
    gap: 2 * 4,
    alignItems: 'center',
    paddingBlock: 1.5 * 4,
    fontFamily: 'inherit',
    fontSize: '1rem',
    lineHeight: 1.42,
    color: `var(--summary-color, ${colors.fgSoft})`,
    textDecoration: 'none',
    borderRadius: radius.md,
  },
  active: {
    fontWeight: 500,
    color: colors.accentText,
  },
  inactive: {
    color: {
      default: `var(--summary-color, ${colors.fgSoft})`,
      ':focus-visible': colors.accentText,
      ':hover': colors.accentText,
    },
  },
});
