'use client';

import * as stylex from '@stylexjs/stylex';
import { Button } from '@stylextras/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@stylextras/ui/card';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@stylextras/ui/combobox';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@stylextras/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@stylextras/ui/dropdown-menu';
import { Field, FieldDescription, FieldLabel } from '@stylextras/ui/field';
import { Input } from '@stylextras/ui/input';
import { Select } from '@stylextras/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stylextras/ui/tabs';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { elevation } from '@stylextras/ui/tokens/elevation.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { spacing } from '@stylextras/ui/tokens/spacing.stylex';
import { stroke } from '@stylextras/ui/tokens/stroke.stylex';
import { typography } from '@stylextras/ui/tokens/typography.stylex';
import type { ReactNode } from 'react';

export function ReferenceGallery() {
  return (
    <section
      {...stylex.props(styles.root)}
      aria-labelledby="reference-gallery-title"
    >
      <header {...stylex.props(styles.toolbar)}>
        <div>
          <h2 {...stylex.props(styles.title)} id="reference-gallery-title">
            Reference slice
          </h2>
          <p {...stylex.props(styles.subtitle)}>
            Every variable group applies independently to the same component
            set.
          </p>
        </div>
      </header>

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
            <Input
              id="reference-email"
              aria-describedby="reference-email-description"
              type="email"
              placeholder="you@example.com"
            />
            <FieldDescription id="reference-email-description">
              Used for account notifications.
            </FieldDescription>
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
              <ComboboxInput
                id="reference-framework"
                placeholder="Search frameworks…"
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxItem value="react">React</ComboboxItem>
                  <ComboboxItem value="preact">Preact</ComboboxItem>
                  <ComboboxItem value="vue">Vue</ComboboxItem>
                  <ComboboxItem value="svelte">Svelte</ComboboxItem>
                </ComboboxList>
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
            <DialogTrigger target="reference-dialog">
              Rename project
            </DialogTrigger>
          </div>
          <Dialog
            id="reference-dialog"
            aria-labelledby="reference-dialog-title"
            aria-describedby="reference-dialog-description"
          >
            <DialogHeader>
              <DialogTitle id="reference-dialog-title">
                Rename project
              </DialogTitle>
              <DialogDescription id="reference-dialog-description">
                The dialog is opened through a declarative command target.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Field>
                <FieldLabel htmlFor="reference-project-name">
                  Project name
                </FieldLabel>
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
              <DropdownMenuTrigger target="reference-menu">
                Open actions
              </DropdownMenuTrigger>
              <DropdownMenuContent id="reference-menu">
                <DropdownMenuGroup aria-labelledby="reference-menu-project-label">
                  <DropdownMenuLabel id="reference-menu-project-label">
                    Project
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    Rename <DropdownMenuShortcut>R</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
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
  );
}

function Preview({
  badge,
  children,
  title,
}: {
  badge: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <section {...stylex.props(styles.preview)}>
      <header {...stylex.props(styles.previewHeader)}>
        <h3 {...stylex.props(styles.previewTitle)}>{title}</h3>
        <span {...stylex.props(styles.badge)}>{badge}</span>
      </header>
      <div {...stylex.props(styles.previewBody)}>{children}</div>
    </section>
  );
}

const styles = stylex.create({
  root: {
    display: 'grid',
    width: '100%',
    minWidth: 0,
    overflow: 'clip',
    fontFamily: typography.fontSans,
    color: colors.fg,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.lg,
    boxShadow: elevation.sm,
  },
  toolbar: {
    padding: spacing.lg,
    backgroundColor: colors.bgSubtle,
  },
  title: {
    margin: 0,
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
    color: colors.fg,
  },
  subtitle: {
    marginBlock: `${spacing.xxs} 0`,
    fontSize: typography.stepMinus1,
    color: colors.fgMuted,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 760px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: spacing.md,
    padding: spacing.lg,
  },
  preview: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    minWidth: 0,
    minHeight: 210,
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.md,
  },
  previewHeader: {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.thin,
  },
  previewTitle: {
    margin: 0,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    color: colors.fg,
  },
  badge: {
    paddingBlock: spacing.xxs,
    paddingInline: spacing.xs,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    lineHeight: 1,
    color: colors.fgMuted,
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.round,
  },
  previewBody: {
    display: 'grid',
    alignContent: 'center',
    minWidth: 0,
    padding: spacing.lg,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  sampleCard: {
    width: '100%',
  },
  cardCopy: {
    margin: 0,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    color: colors.fgMuted,
  },
  tabCopy: {
    margin: 0,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    color: colors.fgMuted,
  },
});
