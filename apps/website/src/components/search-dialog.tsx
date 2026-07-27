/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use client'
import { Fragment, type ReactNode, useEffect, useEffectEvent, useRef, useState } from 'react'
import * as stylex from '@stylexjs/stylex'
import scrollIntoView from 'scroll-into-view-if-needed'
import { ChevronRight, Hash, Search } from 'lucide-react'
import { liteClient, type SearchForHitsOptions } from 'algoliasearch/lite'
import { useRouter } from 'fumadocs-core/framework'
import type { HighlightedText, ReactSortedResult, SortedResult } from 'fumadocs-core/search'
import { I18nLabel, useI18n } from 'fumadocs-ui/contexts/i18n'
import type { SearchLink, SharedProps, TagItem } from 'fumadocs-ui/contexts/search'
import { EASINGS, vars } from '@/theming/vars.stylex'
import { Button } from '@stylextras/ui/button'
import { DialogTitle } from '@stylextras/ui/dialog'
import { DialogClient } from '@stylextras/ui/dialog/client'
import { Input } from '@stylextras/ui/input'
import { Kbd } from '@stylextras/ui/kbd'
import { ScrollArea } from '@stylextras/ui/scroll-area'
import { Spinner } from '@stylextras/ui/spinner'
type SearchItem =
  | (ReactSortedResult & {
      external?: boolean
    })
  | {
      id: string
      type: 'action'
      node: ReactNode
      onSelect: () => void
    }
// eslint-disable-next-line no-useless-concat
const appId = '94L' + 'A' + 'F81A4P'
// Public API key it is safe to commit it
const apiKey = 'd7b1348f1d8a68c1c5a868c54536759c'
const indexName = 'stylexjs'
const client = liteClient(appId, apiKey)
// DocSearch hit structure from Algolia
type DocSearchHit = {
  objectID: string
  url: string
  url_without_anchor?: string
  anchor?: string
  content: string | null
  type: 'lvl0' | 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' | 'lvl6' | 'content'
  hierarchy: {
    lvl0: string | null
    lvl1: string | null
    lvl2: string | null
    lvl3: string | null
    lvl4: string | null
    lvl5: string | null
    lvl6: string | null
  }
}
// Convert absolute URLs to relative paths and normalize
function toRelativeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // Normalize: remove trailing slash from pathname (but keep root /)
    let pathname = parsed.pathname
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1)
    }
    return pathname + parsed.hash
  } catch {
    // If it's already a relative URL, normalize it
    let path = url
    // Split path and hash
    const hashIndex = path.indexOf('#')
    let hash = ''
    if (hashIndex !== -1) {
      hash = path.slice(hashIndex)
      path = path.slice(0, hashIndex)
    }
    // Remove trailing slash
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    return path + hash
  }
}
// Transform DocSearch results to fumadocs format
function transformDocSearchResults(hits: DocSearchHit[]): SortedResult[] {
  const results: SortedResult[] = []
  // Track seen URLs to prevent duplicates (normalized full URL with anchor)
  const seenUrls = new Set<string>()
  // Track seen page URLs (without anchor) for page-level deduplication
  const seenPageUrls = new Set<string>()
  for (const hit of hits) {
    const fullUrl = toRelativeUrl(hit.url)
    const baseUrl = toRelativeUrl(hit.url_without_anchor || hit.url)
    // Skip if we've already seen this exact URL
    if (seenUrls.has(fullUrl)) {
      continue
    }
    // Build breadcrumbs from hierarchy (all non-null levels)
    const breadcrumbs = [
      hit.hierarchy.lvl0,
      hit.hierarchy.lvl1,
      hit.hierarchy.lvl2,
      hit.hierarchy.lvl3,
      hit.hierarchy.lvl4,
      hit.hierarchy.lvl5,
      hit.hierarchy.lvl6,
    ].filter((level): level is string => level != null)
    // Get the page title (usually lvl1, fallback to lvl0)
    const pageTitle = hit.hierarchy.lvl1 || hit.hierarchy.lvl0 || 'Untitled'
    // If this is a page-level hit (lvl0 or lvl1) and we haven't seen this page yet
    if ((hit.type === 'lvl0' || hit.type === 'lvl1') && !seenPageUrls.has(baseUrl)) {
      seenPageUrls.add(baseUrl)
      seenUrls.add(fullUrl)
      results.push({
        type: 'page',
        id: hit.objectID,
        url: baseUrl,
        content: pageTitle,
        // For pages, breadcrumbs are just lvl0 (the section/category)
        breadcrumbs: hit.hierarchy.lvl0 ? [hit.hierarchy.lvl0] : [],
      })
    } else if (hit.type === 'content' && hit.content) {
      // Content-level hit - show with page context
      seenUrls.add(fullUrl)
      results.push({
        type: 'text',
        id: hit.objectID,
        url: fullUrl,
        content: hit.content,
        // Include full breadcrumb trail for context
        breadcrumbs,
      })
    } else if (hit.type.startsWith('lvl') && hit.type !== 'lvl0' && hit.type !== 'lvl1') {
      // Heading-level hit (lvl2, lvl3, lvl4, etc.)
      seenUrls.add(fullUrl)
      const headingText = hit.hierarchy[hit.type as keyof typeof hit.hierarchy] ?? pageTitle
      results.push({
        type: 'heading',
        id: hit.objectID,
        url: fullUrl,
        content: headingText,
        // Include breadcrumbs up to (but not including) the current heading level
        breadcrumbs: breadcrumbs.slice(0, -1),
      })
    }
  }
  return results
}
// Custom search function for DocSearch-formatted Algolia index
async function searchAlgoliaDocSearch(query: string): Promise<SortedResult[] | 'empty'> {
  if (query.trim().length === 0) {
    return 'empty'
  }
  const result = await client.searchForHits({
    requests: [
      {
        indexName,
        query,
        distinct: 5,
        hitsPerPage: 20,
      } as SearchForHitsOptions,
    ],
  })
  const hits = result.results[0]?.hits as unknown as DocSearchHit[]
  if (!hits || hits.length === 0) {
    return []
  }
  return transformDocSearchResults(hits)
}
export type SearchDialogProps = SharedProps & {
  links?: SearchLink[]
  type?: 'fetch' | 'static'
  defaultTag?: string
  tags?: TagItem[]
  api?: string
  delayMs?: number
  footer?: ReactNode
  allowClear?: boolean
}
export function SearchDialog({
  open,
  onOpenChange,
  // type = 'fetch',
  defaultTag,
  tags = [],
  // api = '/api/search',
  // delayMs,
  allowClear = false,
  links = [],
  footer,
}: SearchDialogProps) {
  const { text } = useI18n()
  const router = useRouter()
  const [tag, setTag] = useState(defaultTag)
  // Custom search state management for DocSearch-formatted Algolia index
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState<{
    isLoading: boolean
    data?: SortedResult[] | 'empty'
    error?: Error
  }>({ isLoading: false, data: 'empty' })
  // Debounced search effect
  useEffect(() => {
    if (search.trim().length === 0) {
      setQuery({ isLoading: false, data: 'empty' })
      return
    }
    setQuery((prev) => ({ ...prev, isLoading: true }))
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchAlgoliaDocSearch(search)
        setQuery({ isLoading: false, data: results })
      } catch (error) {
        setQuery({ isLoading: false, error: error as Error })
      }
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [search])
  useEffect(() => {
    setTag(defaultTag)
  }, [defaultTag])
  const defaultItems: SearchItem[] | null =
    links.length === 0
      ? null
      : links.map(([name, href]) => ({
          type: 'page',
          id: name,
          content: name,
          url: href,
        }))
  const items =
    query.data === 'empty' ? defaultItems : query.data ? (query.data as SearchItem[]) : null
  const [activeId, setActiveId] = useState<string | null>(null)
  const itemsRef = useRef<SearchItem[] | null>(null)
  const listContainerRef = useRef<HTMLDivElement | null>(null)
  const listViewportRef = useRef<HTMLDivElement | null>(null)
  function onOpenItem(item: SearchItem) {
    if (item.type === 'action') {
      item.onSelect()
      onOpenChange(false)
      return
    }
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
      onOpenChange(false)
      return
    }
    const [pathname, hash] = item.url.split('#')
    const normalizedPathname = pathname?.replaceAll('%20', '-') ?? ''
    const url = hash ? `${normalizedPathname}#${hash}` : normalizedPathname
    router.push(url)
    onOpenChange(false)
  }
  useEffect(() => {
    itemsRef.current = items
    if (items && items.length > 0) {
      setActiveId(items[0]?.id ?? null)
    } else {
      setActiveId(null)
    }
  }, [items])
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const currentItems = itemsRef.current
    if (!currentItems || currentItems.length === 0 || e.isComposing) {
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      let index = currentItems.findIndex((item) => item.id === activeId)
      if (index === -1) {
        index = 0
      }
      index =
        e.key === 'ArrowDown'
          ? (index + 1) % currentItems.length
          : (index - 1 + currentItems.length) % currentItems.length
      setActiveId(currentItems[index]?.id ?? null)
      e.preventDefault()
    }
    if (e.key === 'Enter') {
      const selected = currentItems.find((item) => item.id === activeId)
      if (selected) {
        onOpenItem(selected)
        e.preventDefault()
      }
    }
  })
  useEffect(() => {
    if (!open) {
      return
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onKeyDown])
  useEffect(() => {
    const container = listContainerRef.current
    const viewport = listViewportRef.current
    if (!container || !viewport) {
      return
    }
    const updateHeight = () => {
      container.style.setProperty('--fd-animated-height', `${viewport.clientHeight}px`)
    }
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [items])
  useEffect(() => {
    if (!listViewportRef.current || !activeId) {
      return
    }
    const element = listViewportRef.current.querySelector<HTMLElement>(
      `[data-search-item="${activeId}"]`,
    )
    if (element) {
      scrollIntoView(element, {
        scrollMode: 'if-needed',
        block: 'nearest',
        boundary: listViewportRef.current,
      })
    }
  }, [activeId])
  const showFooter = tags.length > 0 || footer != null
  return (
    <DialogClient
      aria-labelledby="search-dialog-title"
      onOpenChange={onOpenChange}
      open={open}
      sx={styles.content}
    >
      <div {...stylex.props(styles.bgBlurContainer)}>
        <div {...stylex.props(styles.bgBlur)} />
      </div>
      <DialogTitle id="search-dialog-title" sx={styles.visuallyHidden}>
        {text.search}
      </DialogTitle>
      <div {...stylex.props(styles.header)}>
        {query.isLoading ? (
          <Spinner aria-label="Loading search results" sx={styles.searchSpinner} />
        ) : (
          <Search aria-hidden {...stylex.props(styles.searchIcon)} />
        )}
        <Input
          autoFocus
          onChange={(event) => setSearch(event.target.value)}
          placeholder={text.search}
          sx={styles.inputLayout}
          value={search}
        />
        <Button
          aria-label="Close search"
          onClick={() => onOpenChange(false)}
          size="sm"
          sx={styles.closeButton}
          variant="outline"
        >
          <Kbd aria-hidden size="sm" sx={styles.closeKey}>
            ESC
          </Kbd>
        </Button>
      </div>
      <div
        data-empty={items == null}
        ref={listContainerRef}
        {...stylex.props(styles.listContainer)}
      >
        <ScrollArea
          aria-label="Search results"
          ref={listViewportRef}
          role="listbox"
          scrollbar="overlay"
          sx={[styles.listViewport, items == null && styles.listViewportHidden]}
        >
          {items && items.length === 0 && (
            <div {...stylex.props(styles.emptyState)}>
              <I18nLabel label="searchNoResult" />
            </div>
          )}
          {items?.map((item) => {
            const active = item.id === activeId
            if (item.type === 'action') {
              return (
                <Button
                  aria-selected={active}
                  data-search-item={item.id}
                  key={item.id}
                  onClick={() => onOpenItem(item)}
                  onPointerMove={() => setActiveId(item.id)}
                  role="option"
                  size="md"
                  sx={[styles.itemButton, active && styles.itemButtonActive]}
                  variant="ghost"
                >
                  {item.node}
                </Button>
              )
            }
            const content = item.contentWithHighlights ? (
              <SearchHighlights highlights={item.contentWithHighlights} />
            ) : (
              item.content
            )
            return (
              <Button
                aria-selected={active}
                data-search-item={item.id}
                key={item.id}
                onClick={() => onOpenItem(item)}
                onPointerMove={() => setActiveId(item.id)}
                role="option"
                size="md"
                sx={[styles.itemButton, active && styles.itemButtonActive]}
                variant="ghost"
              >
                {item.breadcrumbs?.length ? (
                  <div {...stylex.props(styles.breadcrumbs)}>
                    {item.breadcrumbs.map((crumb, index) => (
                      <Fragment key={index}>
                        {index > 0 && (
                          <ChevronRight aria-hidden {...stylex.props(styles.breadcrumbIcon)} />
                        )}
                        {crumb}
                      </Fragment>
                    ))}
                  </div>
                ) : null}
                <p
                  {...stylex.props(
                    styles.itemContent,
                    item.type !== 'page' && styles.itemContentIndented,
                    item.type === 'page' || item.type === 'heading'
                      ? styles.itemContentStrong
                      : styles.itemContentMuted,
                  )}
                >
                  {item.type === 'heading' && (
                    <Hash aria-hidden {...stylex.props(styles.hashIcon)} />
                  )}
                  {content}
                </p>
              </Button>
            )
          })}
        </ScrollArea>
      </div>
      {showFooter && (
        <div {...stylex.props(styles.footer)}>
          {tags.length > 0 && (
            <div {...stylex.props(styles.tagList)}>
              {tags.map((tagItem) => {
                const isActive = tagItem.value === tag
                return (
                  <Button
                    aria-pressed={isActive}
                    key={tagItem.value}
                    onClick={() => setTag(isActive && allowClear ? undefined : tagItem.value)}
                    size="sm"
                    sx={[styles.tagButton, isActive && styles.tagButtonActive]}
                    variant="outline"
                  >
                    {tagItem.name}
                  </Button>
                )
              })}
            </div>
          )}
          {footer}
        </div>
      )}
    </DialogClient>
  )
}
function SearchHighlights({
  highlights,
}: {
  highlights: HighlightedText<ReactNode>[]
}) {
  return highlights.map((node, index) =>
    node.styles?.highlight ? (
      <span key={index} {...stylex.props(styles.highlight)}>
        {node.content}
      </span>
    ) : (
      <Fragment key={index}>{node.content}</Fragment>
    ),
  )
}
const styles = stylex.create({
  content: {
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-popover']} 35%, transparent)`,
    borderRadius: 12,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    color: vars['--color-fd-popover-foreground'],
    position: 'fixed',
    top: {
      default: 4 * 4,
      '@media (min-width: 768px)': 'calc(50% - 250px)',
    },
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: 'calc(100% - 16px)',
    maxWidth: 640,
    overflow: 'hidden',
    opacity: {
      default: 0,
      ':open': 1,
    },
    transform: {
      default: 'translateX(-50%) translateY(8px) scale(0.98)',
      ':open': 'translateX(-50%) translateY(0) scale(1)',
      '@media (prefers-reduced-motion: reduce)': 'translateX(-50%)',
    },
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: '300ms',
      '@media (prefers-reduced-motion: reduce)': '0ms',
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: EASINGS.dialog,
  },
  bgBlurContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'clip',
    pointerEvents: 'none',
  },
  bgBlur: {
    position: 'absolute',
    inset: -64,
    backdropFilter: 'blur(48px) saturate(400%)',
  },
  visuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderWidth: 0,
    clip: 'rect(0, 0, 0, 0)',
  },
  header: {
    position: 'relative',
    display: 'flex',
    gap: 2 * 4,
    alignItems: 'center',
    padding: 3 * 4,
    borderBottomColor: vars['--color-fd-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  searchIcon: {
    flexShrink: 0,
    width: 20,
    height: 20,
    color: vars['--color-fd-muted-foreground'],
  },
  searchSpinner: {
    flexShrink: 0,
    width: 20,
    height: 20,
  },
  inputLayout: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: vars['--color-fd-popover-foreground'],
    flexGrow: 1,
    fontSize: `${18 / 16}rem`,
    minHeight: 0,
    minWidth: 0,
    outlineColor: 'transparent',
    outlineStyle: 'none',
    outlineWidth: 0,
    paddingInline: 0,
  },
  closeButton: {
    paddingInline: 1.5 * 4,
    fontFamily: 'var(--font-mono)',
    color: {
      default: vars['--color-fd-muted-foreground'],
      ':hover': vars['--color-fd-accent-foreground'],
    },
    backgroundColor: {
      default: vars['--color-fd-background'],
      ':hover': 'color-mix(in oklab, var(--color-fd-accent) 80%, transparent)',
    },
    borderColor: {
      default: vars['--color-fd-border'],
      ':focus-visible': vars['--color-fd-primary'],
      ':hover': vars['--color-fd-primary'],
    },
  },
  closeKey: {
    minWidth: 0,
    minHeight: 0,
    padding: 0,
    paddingBlock: 0,
    paddingInline: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  listContainer: {
    position: 'relative',
    // eslint-disable-next-line @stylexjs/valid-styles
    ['--fd-animated-height' as any]: '0px',
    height: 'var(--fd-animated-height)',
    overflow: 'hidden',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
    transitionProperty: 'height',
  },
  listViewport: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 460,
    padding: 1 * 4,
  },
  listViewportHidden: {
    display: 'none',
  },
  emptyState: {
    paddingBlock: 12 * 4,
    fontSize: `${14 / 16}rem`,
    color: vars['--color-fd-muted-foreground'],
    textAlign: 'center',
  },
  itemButton: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5 * 4,
    alignItems: 'flex-start',
    width: '100%',
    paddingBlock: 2 * 4,
    color: vars['--color-fd-popover-foreground'],
    textAlign: 'start',
    backgroundColor: {
      default: 'transparent',
      ':hover': `color-mix(in oklab, ${vars['--color-fd-accent']} 45%, transparent)`,
    },
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
  },
  itemButtonActive: {
    color: vars['--color-fd-accent-foreground'],
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-accent']} 45%, transparent)`,
  },
  breadcrumbs: {
    display: 'inline-flex',
    gap: 1 * 4,
    alignItems: 'center',
    fontSize: `${10 / 16}rem`,
    color: vars['--color-fd-muted-foreground'],
  },
  breadcrumbIcon: {
    width: 16,
    height: 16,
    color: vars['--color-fd-muted-foreground'],
  },
  itemContent: {
    display: 'block',
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: vars['--color-fd-foreground'],
    whiteSpace: 'nowrap',
  },
  itemContentIndented: {},
  itemContentStrong: {
    fontWeight: 500,
  },
  itemContentMuted: {
    color: `color-mix(in oklab, ${vars['--color-fd-popover-foreground']} 80%, transparent)`,
  },
  hashIcon: {
    width: 16,
    height: 16,
    marginInlineEnd: 1 * 4,
    color: vars['--color-fd-muted-foreground'],
  },
  highlight: {
    color: vars['--color-fd-primary'],
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 2 * 4,
    padding: 3 * 4,
    backgroundColor: `color-mix(in oklab, ${vars['--color-fd-secondary']} 50%, transparent)`,
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1 * 4,
    alignItems: 'center',
  },
  tagButton: {
    color: vars['--color-fd-muted-foreground'],
    backgroundColor: {
      default: 'transparent',
      ':hover': vars['--color-fd-accent'],
    },
  },
  tagButtonActive: {
    color: vars['--color-fd-accent-foreground'],
    backgroundColor: vars['--color-fd-accent'],
  },
})
