"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";
import { Button } from "@stylextras/ui/button";
import { ButtonGroup } from "@stylextras/ui/button-group";
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
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandTrigger,
} from "@stylextras/ui/command";
import {
  ContextMenu,
  ContextMenuButton,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@stylextras/ui/context-menu";
import {
  LazyContextMenu,
  LazyContextMenuButton,
  LazyContextMenuTrigger,
} from "@stylextras/ui/context-menu/lazy";
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
import {
  LazyDialog,
  LazyDialogTrigger,
  type LazyDialogContentProps,
} from "@stylextras/ui/dialog/lazy";
import { Direction } from "@stylextras/ui/direction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@stylextras/ui/dropdown-menu";
import {
  LazyDropdownMenu,
  LazyDropdownMenuTrigger,
} from "@stylextras/ui/dropdown-menu/lazy";
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
import { ToggleGroup } from "@stylextras/ui/toggle-group";
import { Tooltip, TooltipTrigger } from "@stylextras/ui/tooltip";
import { installInterestInvokerFallback } from "@stylextras/ui/platform-polyfills/interest-invoker-fallback";
import { colorThemes } from "@stylextras/ui/color-themes";
import { radiusThemes } from "@stylextras/ui/radius-themes";
import { spacingThemes } from "@stylextras/ui/spacing-themes";

const managedTabsListOverrides = {
  "aria-orientation": "vertical",
  role: "list",
} as const;
const managedTabsTriggerOverrides = {
  "aria-controls": "consumer-panel",
  "aria-selected": false,
  id: "consumer-tab",
  role: "button",
  tabIndex: 12,
  type: "submit",
} as const;
const managedTabsContentOverrides = {
  "aria-labelledby": "consumer-tab",
  hidden: true,
  id: "consumer-panel",
  role: "region",
  tabIndex: -1,
} as const;
const managedComboboxItemOverrides = {
  hidden: true,
  onMouseDown: () => {},
} as const;

type MissingLazyDialogProps = LazyDialogContentProps & { titleId: string };

function MissingLazyDialogContent({ id }: MissingLazyDialogProps) {
  return <div id={id}>This module omitted its required dialog.</div>;
}

export function UiTestHarness() {
  const [hydrated, setHydrated] = useState(false);
  const [selectResult, setSelectResult] = useState("");
  const [comboboxResult, setComboboxResult] = useState("");
  const [controlledComboboxValue, setControlledComboboxValue] =
    useState("react");
  const [showControlledVue, setShowControlledVue] = useState(false);
  const [dateResult, setDateResult] = useState("");
  const [calendarValue, setCalendarValue] = useState("2026-07-11");
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const [fallbackSubmitCount, setFallbackSubmitCount] = useState(0);
  const [canceledLazyErrorCount, setCanceledLazyErrorCount] = useState(0);
  const [showDefaultOpenDialog, setShowDefaultOpenDialog] = useState(false);
  const fallbackTriggerRef = useRef<HTMLButtonElement>(null);
  const fallbackPopoverRef = useRef<HTMLDivElement>(null);
  const lazyDialogRetryAttempts = useRef(0);
  const lazyMenuRetryAttempts = useRef(0);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    const trigger = fallbackTriggerRef.current;
    const popover = fallbackPopoverRef.current;
    if (!trigger || !popover) return;
    return installInterestInvokerFallback(trigger, popover, {
      hideDelay: 0,
      interactive: false,
      showDelay: 0,
    });
  }, []);

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
                    <ComboboxItem
                      value="svelte"
                      data-testid="managed-combobox-item"
                      {...managedComboboxItemOverrides}
                    >
                      Svelte
                    </ComboboxItem>
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

          <TestCard title="Controlled combobox synchronization">
            <Field>
              <FieldLabel htmlFor="test-controlled-framework">
                Controlled framework
              </FieldLabel>
              <Combobox
                value={controlledComboboxValue}
                onValueChange={setControlledComboboxValue}
              >
                <ComboboxInput
                  id="test-controlled-framework"
                  data-testid="controlled-combobox-input"
                />
                <ComboboxContent>
                  <ComboboxItem value="react">React</ComboboxItem>
                  {showControlledVue ? (
                    <ComboboxItem value="vue">Vue</ComboboxItem>
                  ) : null}
                  <ComboboxEmpty>No controlled results.</ComboboxEmpty>
                </ComboboxContent>
              </Combobox>
            </Field>
            <div {...stylex.props(styles.actions)}>
              <Button
                size="sm"
                onClick={() => {
                  setShowControlledVue(false);
                  setControlledComboboxValue("vue");
                }}
              >
                Select deferred Vue
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowControlledVue(true)}
              >
                Mount deferred Vue
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setControlledComboboxValue("react")}
              >
                Select controlled React
              </Button>
            </div>
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
                  id="test-due-date"
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
              <ButtonGroup aria-label="Harness toolbar">
                <Button variant="ghost">Align start</Button>
                <Button variant="ghost">Align center</Button>
                <Button variant="ghost">Align end</Button>
              </ButtonGroup>
              <ToggleGroup aria-label="Harness formatting">
                <Toggle aria-pressed="true">Bold</Toggle>
                <Toggle aria-pressed="false">Italic</Toggle>
              </ToggleGroup>
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
            <Button
              variant="outline"
              onClick={() => setShowDefaultOpenDialog(true)}
            >
              Mount default-open dialog
            </Button>
            {showDefaultOpenDialog ? (
              <DialogClient
                id="test-default-open-dialog"
                aria-label="Default-open dialog"
                defaultOpen
              >
                <DialogBody>Opened during the initial client effect.</DialogBody>
                <DialogFooter>
                  <DialogClose target="test-default-open-dialog" autoFocus>
                    Close default-open dialog
                  </DialogClose>
                </DialogFooter>
              </DialogClient>
            ) : null}
          </TestCard>

          <TestCard title="Deferred dialog">
            <LazyDialog
              id="test-lazy-dialog"
              aria-labelledby="test-lazy-dialog-title"
              contentProps={{ titleId: "test-lazy-dialog-title" }}
              load={() => import("./LazyDialogFixture")}
              loadingLabel="Loading deferred settings"
              loadErrorLabel="Could not open deferred settings"
            >
              <LazyDialogTrigger>Open lazy dialog</LazyDialogTrigger>
            </LazyDialog>
            <LazyDialog
              id="test-retry-lazy-dialog"
              aria-label="Recovered deferred dialog"
              contentProps={{ titleId: "test-retry-lazy-dialog-title" }}
              load={async () => {
                lazyDialogRetryAttempts.current += 1;
                if (lazyDialogRetryAttempts.current === 1) {
                  return { default: MissingLazyDialogContent };
                }
                return import("./LazyDialogFixture");
              }}
              loadErrorLabel="Retry deferred dialog failed"
              preload="none"
            >
              <LazyDialogTrigger>Open retry lazy dialog</LazyDialogTrigger>
            </LazyDialog>
            <LazyDialog
              id="test-cancel-lazy-dialog"
              aria-label="Canceled deferred dialog"
              contentProps={{ titleId: "test-cancel-lazy-dialog-title" }}
              load={() =>
                new Promise<never>((_resolve, reject) => {
                  setTimeout(() => reject(new Error("Canceled dialog load")), 250);
                })
              }
              loadingLabel="Loading cancelable dialog"
              loadErrorLabel="Canceled dialog load failed"
              onLoadError={() => setCanceledLazyErrorCount((count) => count + 1)}
              preload="none"
            >
              <LazyDialogTrigger>Open cancelable lazy dialog</LazyDialogTrigger>
            </LazyDialog>
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

          <TestCard title="Deferred menus">
            <div {...stylex.props(styles.actions)}>
              <LazyDropdownMenu
                id="test-lazy-menu"
                aria-label="Deferred project actions"
                contentProps={{}}
                load={() => import("./LazyMenuFixture")}
                loadingLabel="Loading deferred menu"
                loadErrorLabel="Could not open deferred menu"
              >
                <LazyDropdownMenuTrigger>Open lazy menu</LazyDropdownMenuTrigger>
              </LazyDropdownMenu>
              <LazyDropdownMenu
                id="test-retry-lazy-menu"
                aria-label="Recovered deferred menu"
                contentProps={{}}
                load={async () => {
                  lazyMenuRetryAttempts.current += 1;
                  if (lazyMenuRetryAttempts.current === 1) {
                    return { default: undefined as never };
                  }
                  return import("./LazyMenuFixture");
                }}
                loadErrorLabel="Retry deferred menu failed"
                preload="none"
              >
                <LazyDropdownMenuTrigger>Open retry lazy menu</LazyDropdownMenuTrigger>
              </LazyDropdownMenu>
              <LazyDropdownMenu
                id="test-cancel-lazy-menu"
                aria-label="Canceled deferred menu"
                contentProps={{}}
                load={() =>
                  new Promise<never>((_resolve, reject) => {
                    setTimeout(() => reject(new Error("Canceled menu load")), 250);
                  })
                }
                loadingLabel="Loading cancelable menu"
                loadErrorLabel="Canceled menu load failed"
                onLoadError={() => setCanceledLazyErrorCount((count) => count + 1)}
                preload="none"
              >
                <LazyDropdownMenuTrigger>Open cancelable lazy menu</LazyDropdownMenuTrigger>
              </LazyDropdownMenu>
              <LazyContextMenu
                id="test-lazy-context-menu"
                aria-label="Deferred canvas actions"
                contentProps={{}}
                load={() => import("./LazyContextMenuFixture")}
                loadingLabel="Loading deferred context menu"
                loadErrorLabel="Could not open deferred context menu"
              >
                <LazyContextMenuButton>Open lazy canvas actions</LazyContextMenuButton>
                <LazyContextMenuTrigger aria-label="Deferred canvas context region">
                  <span data-testid="lazy-context-target">Right-click deferred region</span>
                </LazyContextMenuTrigger>
              </LazyContextMenu>
            </div>
            <output data-testid="canceled-lazy-error-count">
              {canceledLazyErrorCount}
            </output>
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
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setFallbackSubmitCount((count) => count + 1);
                }}
              >
                <Button
                  ref={fallbackTriggerRef}
                  type="submit"
                  popoverTarget="test-fallback-submit-tooltip"
                  popoverTargetAction="toggle"
                >
                  Submit with fallback hint
                </Button>
                <Tooltip ref={fallbackPopoverRef} id="test-fallback-submit-tooltip">
                  Submitting keeps its native default action
                </Tooltip>
                <output data-testid="fallback-submit-result">{fallbackSubmitCount}</output>
              </form>
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
            <ContextMenuButton target="test-context-menu">
              Open canvas actions
            </ContextMenuButton>
            <ContextMenuTrigger
              target="test-context-menu"
              tabIndex={0}
              aria-label="Canvas context menu"
            >
              <div data-testid="context-target" {...stylex.props(styles.contextTarget)}>
                Right-click this region
              </div>
            </ContextMenuTrigger>
            <ContextMenu id="test-context-menu" aria-label="Canvas actions">
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
            <Tabs
              defaultValue="account"
              onValueChange={() => setTabChangeCount((count) => count + 1)}
            >
              <TabsList
                aria-label="Settings sections"
                data-testid="managed-tabs-list"
                {...managedTabsListOverrides}
              >
                <TabsTrigger
                  value="account"
                  data-testid="managed-tabs-trigger"
                  {...managedTabsTriggerOverrides}
                >
                  Account
                </TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="billing" disabled>
                  Billing
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="account"
                data-testid="managed-tabs-content"
                {...managedTabsContentOverrides}
              >
                Account settings
              </TabsContent>
              <TabsContent value="security">Security settings</TabsContent>
              <TabsContent value="billing">Billing settings</TabsContent>
            </Tabs>
            <output data-testid="tab-change-count">{tabChangeCount}</output>
            <Tabs defaultValue="unavailable">
              <TabsList aria-label="Disabled selection fallback">
                <TabsTrigger value="unavailable" disabled>
                  Unavailable
                </TabsTrigger>
                <TabsTrigger value="fallback" data-testid="disabled-selected-fallback">
                  Fallback
                </TabsTrigger>
              </TabsList>
              <TabsContent value="unavailable">Unavailable content</TabsContent>
              <TabsContent value="fallback">Fallback content</TabsContent>
            </Tabs>
          </TestCard>

          <TestCard title="Calendar">
            <Calendar
              data-testid="bounded-calendar"
              value={calendarValue}
              min="2026-07-01"
              max="2026-08-20"
              onValueChange={setCalendarValue}
            />
            <output data-testid="calendar-result" {...stylex.props(styles.output)}>
              {calendarValue}
            </output>
          </TestCard>

          <TestCard title="Command visibility model">
            <CommandTrigger target="test-command">Open command palette</CommandTrigger>
            <Command id="test-command" aria-label="Harness commands">
              <CommandInput
                aria-label="Filter harness commands"
                data-testid="command-input"
              />
              <CommandList>
                <CommandItem value="visible">Visible command</CommandItem>
                <CommandItem value="hidden" hidden>
                  Hidden command
                </CommandItem>
                <CommandEmpty data-testid="command-empty">
                  No available commands.
                </CommandEmpty>
              </CommandList>
            </Command>
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
            <div {...stylex.props(styles.actions)}>
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
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    announcement: "First batched notification. Review details.",
                    description: (
                      <a id="batch-toast-details" href="#forms-heading">
                        Review details
                      </a>
                    ),
                    duration: 10_000,
                    id: "batch-toast-first",
                    title: <span id="batch-toast-title">First batched notification</span>,
                  });
                  toast({
                    description: "Queued in the same update.",
                    duration: 10_000,
                    id: "batch-toast-second",
                    title: "Second batched notification",
                  });
                }}
              >
                Show toast batch
              </Button>
            </div>
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
