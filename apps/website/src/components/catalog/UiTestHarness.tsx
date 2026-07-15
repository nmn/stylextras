"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { Button } from "@stylextras/ui/button";
import { Calendar } from "@stylextras/ui/calendar";
import { Checkbox } from "@stylextras/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
} from "@stylextras/ui/combobox";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@stylextras/ui/context-menu";
import { DatePicker } from "@stylextras/ui/date-picker";
import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@stylextras/ui/dialog";
import { DialogClient } from "@stylextras/ui/dialog/client";
import { Direction } from "@stylextras/ui/direction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@stylextras/ui/dropdown-menu";
import { Field, FieldDescription, FieldLabel } from "@stylextras/ui/field";
import {
  HoverCard,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@stylextras/ui/hover-card";
import { Input } from "@stylextras/ui/input";
import {
  Popover,
  PopoverClose,
  PopoverTrigger,
} from "@stylextras/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupLegend,
} from "@stylextras/ui/radio-group";
import { Select } from "@stylextras/ui/select";
import { Switch } from "@stylextras/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@stylextras/ui/tabs";
import { Toaster, toast } from "@stylextras/ui/toast";
import { Toggle } from "@stylextras/ui/toggle";
import { Tooltip, TooltipTrigger } from "@stylextras/ui/tooltip";
import { colorThemes } from "@stylextras/ui/color-themes";
import { radiusThemes } from "@stylextras/ui/radius-themes";
import { spacingThemes } from "@stylextras/ui/spacing-themes";

export function UiTestHarness() {
  const [hydrated, setHydrated] = useState(false);
  const [selectResult, setSelectResult] = useState("");
  const [comboboxResult, setComboboxResult] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [calendarValue, setCalendarValue] = useState("2026-07-11");

  useEffect(() => setHydrated(true), []);

  return (
    <main
      {...stylex.props(
        colorThemes.neutral,
        spacingThemes.compact,
        radiusThemes.rounded,
        styles.main,
      )}
      data-hydrated={hydrated ? "true" : "false"}
    >
      <header {...stylex.props(styles.header)}>
        <p {...stylex.props(styles.eyebrow)}>Internal verification route</p>
        <h1 {...stylex.props(styles.title)}>StyleXtras interaction matrix</h1>
        <p {...stylex.props(styles.description)}>
          Deterministic native, enhanced, and client cases for browser tests.
        </p>
      </header>

      <section aria-labelledby="forms-heading" {...stylex.props(styles.section)}>
        <h2 id="forms-heading" {...stylex.props(styles.sectionTitle)}>
          Forms
        </h2>
        <div {...stylex.props(styles.grid)}>
          <TestCard title="Native select">
            <form
              data-testid="select-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSelectResult(
                  String(new FormData(event.currentTarget).get("region") ?? ""),
                );
              }}
            >
              <Field>
                <FieldLabel htmlFor="test-region">Region</FieldLabel>
                <Select
                  id="test-region"
                  data-testid="native-select"
                  name="region"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Choose a region
                  </option>
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
                <FieldDescription>
                  Native submission, validity, keyboard, optgroup, and reset.
                </FieldDescription>
              </Field>
              <div {...stylex.props(styles.actions)}>
                <Button type="submit" size="sm">
                  Submit select
                </Button>
                <Button type="reset" size="sm" variant="outline">
                  Reset
                </Button>
              </div>
              <output data-testid="select-result" {...stylex.props(styles.output)}>
                {selectResult}
              </output>
            </form>
          </TestCard>

          <TestCard title="Combobox">
            <form
              data-testid="combobox-form"
              onSubmit={(event) => {
                event.preventDefault();
                setComboboxResult(
                  String(
                    new FormData(event.currentTarget).get("framework") ?? "",
                  ),
                );
              }}
            >
              <Field>
                <FieldLabel htmlFor="test-framework">Framework</FieldLabel>
                <Combobox name="framework" defaultValue="react" required>
                  <ComboboxInput
                    id="test-framework"
                    data-testid="combobox-input"
                    placeholder="Search frameworks"
                  />
                  <ComboboxContent data-testid="combobox-content">
                    <ComboboxItem value="react">React</ComboboxItem>
                    <ComboboxItem value="preact">Preact</ComboboxItem>
                    <ComboboxItem value="svelte">Svelte</ComboboxItem>
                    <ComboboxItem value="vue">Vue</ComboboxItem>
                    <ComboboxItem value="angular" disabled>
                      Angular
                    </ComboboxItem>
                    <ComboboxEmpty>No results found.</ComboboxEmpty>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <div {...stylex.props(styles.actions)}>
                <Button type="submit" size="sm">
                  Submit combobox
                </Button>
                <Button type="reset" size="sm" variant="outline">
                  Reset
                </Button>
              </div>
              <output
                data-testid="combobox-result"
                {...stylex.props(styles.output)}
              >
                {comboboxResult}
              </output>
            </form>
          </TestCard>

          <TestCard title="Date picker">
            <form
              data-testid="date-form"
              onSubmit={(event) => {
                event.preventDefault();
                setDateResult(
                  String(new FormData(event.currentTarget).get("due") ?? ""),
                );
              }}
            >
              <Field>
                <FieldLabel htmlFor="test-due-date">Due date</FieldLabel>
                <DatePicker
                  name="due"
                  inputId="test-due-date"
                  defaultValue="2026-07-11"
                  min="2026-07-01"
                  max="2026-08-31"
                  required
                />
              </Field>
              <div {...stylex.props(styles.actions)}>
                <Button type="submit" size="sm">
                  Submit date
                </Button>
                <Button type="reset" size="sm" variant="outline">
                  Reset
                </Button>
              </div>
              <output data-testid="date-result" {...stylex.props(styles.output)}>
                {dateResult}
              </output>
            </form>
          </TestCard>

          <TestCard title="Native choices">
            <div {...stylex.props(styles.choices)}>
              <label {...stylex.props(styles.choice)}>
                <Checkbox name="updates" defaultChecked /> Product updates
              </label>
              <label {...stylex.props(styles.choice)}>
                <Switch name="notifications" defaultChecked /> Notifications
              </label>
              <RadioGroup>
                <RadioGroupLegend>Density</RadioGroupLegend>
                <label {...stylex.props(styles.choice)}>
                  <RadioGroupItem name="density" value="compact" defaultChecked />
                  Compact
                </label>
                <label {...stylex.props(styles.choice)}>
                  <RadioGroupItem name="density" value="cozy" /> Cozy
                </label>
              </RadioGroup>
              <Toggle aria-pressed="false">Pin panel</Toggle>
            </div>
          </TestCard>
        </div>
      </section>

      <section aria-labelledby="layers-heading" {...stylex.props(styles.section)}>
        <h2 id="layers-heading" {...stylex.props(styles.sectionTitle)}>
          Native layers
        </h2>
        <div {...stylex.props(styles.grid)}>
          <TestCard title="Dialog and nested popover">
            <DialogTrigger target="test-dialog">Open dialog</DialogTrigger>
            <DialogClient id="test-dialog" aria-labelledby="test-dialog-title">
              <DialogHeader>
                <DialogTitle id="test-dialog-title">Edit project</DialogTitle>
                <DialogDescription>
                  Native modal, explicit command target, and nested top layer.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Field>
                  <FieldLabel htmlFor="test-project-name">Name</FieldLabel>
                  <Input id="test-project-name" defaultValue="StyleXtras" />
                </Field>
                <div {...stylex.props(styles.dialogPopover)}>
                  <PopoverTrigger target="dialog-popover" size="sm">
                    Open nested popover
                  </PopoverTrigger>
                  <Popover id="dialog-popover" size="sm">
                    <p {...stylex.props(styles.copy)}>Nested popover content.</p>
                    <PopoverClose target="dialog-popover" size="sm">
                      Close popover
                    </PopoverClose>
                  </Popover>
                </div>
              </DialogBody>
              <DialogFooter>
                <form method="dialog">
                  <Button type="submit" variant="outline">
                    Native close form
                  </Button>
                </form>
                <DialogClose target="test-dialog" variant="primary">
                  Save
                </DialogClose>
              </DialogFooter>
            </DialogClient>
          </TestCard>

          <TestCard title="Popover and menu">
            <div {...stylex.props(styles.actions)}>
              <PopoverTrigger target="test-popover">Open popover</PopoverTrigger>
              <Popover id="test-popover" size="sm">
                <p {...stylex.props(styles.copy)}>Popover API content.</p>
                <PopoverClose target="test-popover" size="sm">
                  Close
                </PopoverClose>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger target="test-menu">
                  Open menu
                </DropdownMenuTrigger>
                <DropdownMenuContent id="test-menu" data-testid="dropdown-menu">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TestCard>

          <TestCard title="Tooltip and hover card">
            <div {...stylex.props(styles.actions)}>
              <TooltipTrigger
                target="test-tooltip"
                showDelay={20}
                hideDelay={20}
              >
                Hover for tip
              </TooltipTrigger>
              <Tooltip id="test-tooltip">Keyboard shortcut: ⌘K</Tooltip>
              <HoverCardTrigger
                target="test-hover-card"
                showDelay={20}
                hideDelay={40}
              >
                Project owner
              </HoverCardTrigger>
              <HoverCard id="test-hover-card">
                <HoverCardHeader>
                  <HoverCardTitle>Alex Morgan</HoverCardTitle>
                  <HoverCardDescription>
                    Maintains the native platform layer.
                  </HoverCardDescription>
                </HoverCardHeader>
                <Button size="sm" variant="outline">
                  View profile
                </Button>
              </HoverCard>
            </div>
          </TestCard>

          <TestCard title="Context menu">
            <ContextMenuTrigger
              target="test-context-menu"
              tabIndex={0}
              aria-label="Canvas context menu"
            >
              <div data-testid="context-target" {...stylex.props(styles.contextTarget)}>
                Right-click this region
              </div>
            </ContextMenuTrigger>
            <ContextMenu id="test-context-menu">
              <ContextMenuLabel>Canvas</ContextMenuLabel>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenu>
          </TestCard>
        </div>
      </section>

      <section aria-labelledby="composites-heading" {...stylex.props(styles.section)}>
        <h2 id="composites-heading" {...stylex.props(styles.sectionTitle)}>
          Composites
        </h2>
        <div {...stylex.props(styles.grid)}>
          <TestCard title="Tabs">
            <Tabs defaultValue="account">
              <TabsList aria-label="Settings sections">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="billing" disabled>
                  Billing
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">Account settings</TabsContent>
              <TabsContent value="security">Security settings</TabsContent>
              <TabsContent value="billing">Billing settings</TabsContent>
            </Tabs>
          </TestCard>

          <TestCard title="Calendar">
            <Calendar
              value={calendarValue}
              min="2026-07-01"
              max="2026-08-31"
              onValueChange={setCalendarValue}
            />
            <output data-testid="calendar-result" {...stylex.props(styles.output)}>
              {calendarValue}
            </output>
          </TestCard>

          <TestCard title="RTL">
            <Direction dir="rtl" lang="ar">
              <Field>
                <FieldLabel htmlFor="rtl-name">الاسم</FieldLabel>
                <Input id="rtl-name" placeholder="أدخل الاسم" />
              </Field>
              <div {...stylex.props(styles.actions)}>
                <Button>حفظ</Button>
                <Button variant="outline">إلغاء</Button>
              </div>
            </Direction>
          </TestCard>

          <TestCard title="Toast">
            <Button
              onClick={() =>
                toast({
                  description: "The project settings were updated.",
                  duration: 10_000,
                  title: "Changes saved",
                })
              }
            >
              Show toast
            </Button>
          </TestCard>
        </div>
      </section>
      <Toaster />
    </main>
  );
}

function TestCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article {...stylex.props(styles.card)}>
      <h3 {...stylex.props(styles.cardTitle)}>{title}</h3>
      <div {...stylex.props(styles.cardBody)}>{children}</div>
    </article>
  );
}

const styles = stylex.create({
  main: {
    backgroundColor: "light-dark(oklch(98.5% 0 0), oklch(13.5% 0 0))",
    color: "light-dark(oklch(14.5% 0 0), oklch(98.5% 0 0))",
    display: "grid",
    fontFamily: 'Geist, "Geist Sans", ui-sans-serif, system-ui, sans-serif',
    gap: 36,
    minHeight: "100dvh",
    padding: {
      default: 18,
      "@media (min-width: 760px)": 32,
    },
  },
  header: {
    display: "grid",
    gap: 7,
    marginInline: "auto",
    maxWidth: 1120,
    width: "100%",
  },
  eyebrow: {
    color: "light-dark(oklch(48% 0 0), oklch(70% 0 0))",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    margin: 0,
    textTransform: "uppercase",
  },
  title: {
    fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
    letterSpacing: "-0.035em",
    lineHeight: 1.05,
    margin: 0,
  },
  description: {
    color: "light-dark(oklch(45% 0 0), oklch(72% 0 0))",
    fontSize: 14,
    margin: 0,
  },
  section: {
    display: "grid",
    gap: 14,
    marginInline: "auto",
    maxWidth: 1120,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 650,
    margin: 0,
  },
  grid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      "@media (min-width: 760px)": "repeat(2, minmax(0, 1fr))",
    },
  },
  card: {
    backgroundColor: "light-dark(white, oklch(17% 0 0))",
    borderColor: "light-dark(oklch(89% 0 0), oklch(28% 0 0))",
    borderRadius: 12,
    borderStyle: "solid",
    borderWidth: 1,
    display: "grid",
    minWidth: 0,
  },
  cardTitle: {
    borderBlockEndColor: "light-dark(oklch(91% 0 0), oklch(27% 0 0))",
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: 1,
    fontSize: 13,
    fontWeight: 650,
    margin: 0,
    minWidth: 0,
    paddingBlock: 11,
    paddingInline: 14,
  },
  cardBody: {
    alignContent: "start",
    display: "grid",
    gap: 14,
    minHeight: 150,
    minWidth: 0,
    padding: 16,
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBlockStart: 12,
  },
  output: {
    color: "light-dark(oklch(42% 0 0), oklch(72% 0 0))",
    display: "block",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
    minHeight: 18,
    marginBlockStart: 8,
  },
  choices: {
    display: "grid",
    gap: 12,
  },
  choice: {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    gap: 8,
  },
  dialogPopover: {
    marginBlockStart: 16,
  },
  copy: {
    fontSize: 14,
    lineHeight: 1.5,
    marginBlock: "0 12px",
  },
  contextTarget: {
    alignItems: "center",
    borderColor: "light-dark(oklch(78% 0 0), oklch(35% 0 0))",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    display: "flex",
    fontSize: 13,
    justifyContent: "center",
    minHeight: 100,
    userSelect: "none",
  },
});
