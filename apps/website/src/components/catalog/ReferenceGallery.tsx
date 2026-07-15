'use client'

import * as stylex from '@stylexjs/stylex'
import { blurThemes } from '@stylextras/ui/blur-themes'
import { Button } from '@stylextras/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@stylextras/ui/card'
import { colorThemes } from '@stylextras/ui/color-themes'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
} from '@stylextras/ui/combobox'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@stylextras/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@stylextras/ui/dropdown-menu'
import { elevationThemes } from '@stylextras/ui/elevation-themes'
import { Field, FieldDescription, FieldLabel } from '@stylextras/ui/field'
import { Input } from '@stylextras/ui/input'
import { motionThemes } from '@stylextras/ui/motion-themes'
import { radiusThemes } from '@stylextras/ui/radius-themes'
import { Select } from '@stylextras/ui/select'
import { spacingThemes } from '@stylextras/ui/spacing-themes'
import { strokeThemes } from '@stylextras/ui/stroke-themes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stylextras/ui/tabs'
import { colors } from '@stylextras/ui/tokens/color.stylex'
import { elevation } from '@stylextras/ui/tokens/elevation.stylex'
import { radius } from '@stylextras/ui/tokens/radius.stylex'
import { spacing } from '@stylextras/ui/tokens/spacing.stylex'
import { stroke } from '@stylextras/ui/tokens/stroke.stylex'
import { typography } from '@stylextras/ui/tokens/typography.stylex'
import { typographyThemes } from '@stylextras/ui/typography-themes'
import { type ReactNode, useEffect, useState } from 'react'
import { PreviewThemeControls } from './PreviewThemeControls'
import {
  type PreviewStyleSelection,
  type PreviewThemeSelection,
  defaultPreviewTheme,
  previewStylePresets,
} from './preview-theme-config'

export function ReferenceGallery() {
  const [selection, setSelection] = useState<PreviewThemeSelection>(defaultPreviewTheme)
  const [styleName, setStyleName] = useState<PreviewStyleSelection>('vega')
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  const changeSelection = (key: keyof PreviewThemeSelection, value: string) => {
    setSelection((current) => ({ ...current, [key]: value }))
    if (key !== 'appearance' && key !== 'color') setStyleName('custom')
  }

  const changeStyle = (nextStyle: PreviewStyleSelection) => {
    setStyleName(nextStyle)
    if (nextStyle === 'custom') return
    setSelection((current) => ({
      ...current,
      ...previewStylePresets[nextStyle],
    }))
  }

  return (
    <section
      {...stylex.props(
        colorThemes[selection.color],
        spacingThemes[selection.spacing],
        radiusThemes[selection.radius],
        strokeThemes[selection.stroke],
        typographyThemes[selection.typography],
        elevationThemes[selection.elevation],
        blurThemes[selection.blur],
        motionThemes[selection.motion],
        styles.root,
        selection.appearance === 'light' ? styles.light : styles.dark,
      )}
      data-preview-appearance={selection.appearance}
      data-preview-color={selection.color}
      data-preview-ready={ready ? 'true' : 'false'}
      data-preview-style={styleName}
      data-testid="reference-gallery"
    >
      <header {...stylex.props(styles.toolbar)}>
        <div>
          <h2 {...stylex.props(styles.title)}>Reference slice</h2>
          <p {...stylex.props(styles.subtitle)}>
            Every variable group applies independently to the same component set.
          </p>
        </div>
      </header>

      <PreviewThemeControls
        onSelectionChange={changeSelection}
        onStyleChange={changeStyle}
        selection={selection}
        styleName={styleName}
      />

      <div {...stylex.props(styles.grid)}>
        <Preview title="Button" badge="native">
          <div {...stylex.props(styles.row)}>
            <Button>Continue</Button>
            <Button variant="outline">Preview</Button>
            <Button variant="ghost" size="icon" aria-label="Add item">
              +
            </Button>
          </div>
        </Preview>

        <Preview title="Input" badge="native">
          <Field>
            <FieldLabel htmlFor="reference-email">Email</FieldLabel>
            <Input id="reference-email" type="email" placeholder="you@example.com" />
            <FieldDescription>Used for account notifications.</FieldDescription>
          </Field>
        </Preview>

        <Preview title="Select" badge="enhanced native">
          <Field>
            <FieldLabel htmlFor="reference-region">Region</FieldLabel>
            <Select id="reference-region" name="region" defaultValue="pdx">
              <optgroup label="Americas">
                <option value="pdx">Portland</option>
                <option value="nyc">New York</option>
              </optgroup>
              <optgroup label="Europe">
                <option value="ams">Amsterdam</option>
                <option value="lhr" disabled>
                  London — unavailable
                </option>
              </optgroup>
            </Select>
          </Field>
        </Preview>

        <Preview title="Combobox" badge="client">
          <Field>
            <FieldLabel htmlFor="reference-framework">Framework</FieldLabel>
            <Combobox name="framework" defaultValue="react">
              <ComboboxInput id="reference-framework" placeholder="Search frameworks…" />
              <ComboboxContent>
                <ComboboxItem value="react">React</ComboboxItem>
                <ComboboxItem value="preact">Preact</ComboboxItem>
                <ComboboxItem value="vue">Vue</ComboboxItem>
                <ComboboxItem value="svelte">Svelte</ComboboxItem>
                <ComboboxEmpty>No matching framework.</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </Field>
        </Preview>

        <Preview title="Card" badge="native">
          <Card sx={styles.sampleCard}>
            <CardHeader>
              <CardTitle>Design review</CardTitle>
              <CardDescription>Friday at 10:30 AM</CardDescription>
            </CardHeader>
            <CardContent>
              <p {...stylex.props(styles.cardCopy)}>
                Review density, focus treatment, and native fallbacks.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Join</Button>
              <Button size="sm" variant="outline">
                Reschedule
              </Button>
            </CardFooter>
          </Card>
        </Preview>

        <Preview title="Dialog" badge="native invoker">
          <div {...stylex.props(styles.row)}>
            <DialogTrigger target="reference-dialog">Rename project</DialogTrigger>
          </div>
          <Dialog id="reference-dialog" aria-labelledby="reference-dialog-title">
            <DialogHeader>
              <DialogTitle id="reference-dialog-title">Rename project</DialogTitle>
              <DialogDescription>
                The dialog is opened through a declarative command target.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Field>
                <FieldLabel htmlFor="reference-project-name">Project name</FieldLabel>
                <Input id="reference-project-name" defaultValue="StyleXtras" />
              </Field>
            </DialogBody>
            <DialogFooter>
              <DialogClose target="reference-dialog">Cancel</DialogClose>
              <DialogClose target="reference-dialog" variant="primary">
                Save
              </DialogClose>
            </DialogFooter>
          </Dialog>
        </Preview>

        <Preview title="Dropdown menu" badge="popover + focusgroup">
          <div {...stylex.props(styles.row)}>
            <DropdownMenu>
              <DropdownMenuTrigger target="reference-menu">Open actions</DropdownMenuTrigger>
              <DropdownMenuContent id="reference-menu">
                <DropdownMenuLabel>Project</DropdownMenuLabel>
                <DropdownMenuItem>
                  Rename <DropdownMenuShortcut>R</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Preview>

        <Preview title="Tabs" badge="client + focusgroup">
          <Tabs defaultValue="overview">
            <TabsList aria-label="Project sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p {...stylex.props(styles.tabCopy)}>
                Native-first components with compact tokenized styling.
              </p>
            </TabsContent>
            <TabsContent value="activity">
              <p {...stylex.props(styles.tabCopy)}>Last updated just now.</p>
            </TabsContent>
          </Tabs>
        </Preview>
      </div>
    </section>
  )
}

function Preview({
  badge,
  children,
  title,
}: {
  badge: string
  children: ReactNode
  title: string
}) {
  return (
    <section {...stylex.props(styles.preview)}>
      <header {...stylex.props(styles.previewHeader)}>
        <h3 {...stylex.props(styles.previewTitle)}>{title}</h3>
        <span {...stylex.props(styles.badge)}>{badge}</span>
      </header>
      <div {...stylex.props(styles.previewBody)}>{children}</div>
    </section>
  )
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.sm,
    color: colors.fg,
    display: 'grid',
    fontFamily: typography.fontSans,
    minWidth: 0,
    overflow: 'clip',
    width: '100%',
  },
  light: {
    colorScheme: 'light',
  },
  dark: {
    colorScheme: 'dark',
  },
  toolbar: {
    backgroundColor: colors.bgSubtle,
    padding: spacing.lg,
  },
  title: {
    color: colors.fg,
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
    margin: 0,
  },
  subtitle: {
    color: colors.fgMuted,
    fontSize: typography.stepMinus1,
    marginBlock: `${spacing.xxs} 0`,
  },
  grid: {
    display: 'grid',
    gap: spacing.md,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 760px)': 'repeat(2, minmax(0, 1fr))',
    },
    padding: spacing.lg,
  },
  preview: {
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    minHeight: 210,
    minWidth: 0,
  },
  previewHeader: {
    alignItems: 'center',
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.thin,
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
  },
  previewTitle: {
    color: colors.fg,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    margin: 0,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderRadius: radius.round,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    color: colors.fgMuted,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    lineHeight: 1,
    paddingBlock: spacing.xxs,
    paddingInline: spacing.xs,
  },
  previewBody: {
    alignContent: 'center',
    display: 'grid',
    minWidth: 0,
    padding: spacing.lg,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sampleCard: {
    width: '100%',
  },
  cardCopy: {
    color: colors.fgMuted,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
  tabCopy: {
    color: colors.fgMuted,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
})
