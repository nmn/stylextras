import { AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from '../alert-dialog'
import { LazyAlertDialogTrigger } from '../alert-dialog/lazy'
import { Button, type ButtonSize } from '../button'
import { CommandTrigger } from '../command'
import { ContextMenuButton } from '../context-menu'
import { LazyContextMenuButton } from '../context-menu/lazy'
import { CopyToClipboardButton } from '../copy-to-clipboard-button'
import { DialogClose, DialogTrigger } from '../dialog'
import { LazyDialogTrigger } from '../dialog/lazy'
import { DrawerClose, DrawerTrigger } from '../drawer'
import { DropdownMenuTrigger } from '../dropdown-menu'
import { LazyDropdownMenuTrigger } from '../dropdown-menu/lazy'
import { HoverCardTrigger } from '../hover-card'
import { PopoverClose, PopoverTrigger } from '../popover'
import { LazyPopoverMenuTrigger, LazyPopoverTrigger } from '../popover/lazy'
import { SheetClose, SheetTrigger } from '../sheet'
import { SidebarTrigger } from '../sidebar'
import { TooltipTrigger } from '../tooltip'

declare const dynamicSize: ButtonSize

// @ts-expect-error icon Buttons require an accessible name
const invalidButton = <Button size="icon">×</Button>
// @ts-expect-error a dynamic size that could be icon-only also requires an accessible name
const invalidDynamicButton = <Button size={dynamicSize}>Dynamic</Button>
// @ts-expect-error icon dialog triggers require an accessible name
const invalidDialogTrigger = <DialogTrigger target="dialog" size="icon-sm" />
// @ts-expect-error icon dialog close buttons require an accessible name
const invalidDialogClose = <DialogClose target="dialog" size="icon-lg" />
// @ts-expect-error icon lazy dialog triggers require an accessible name
const invalidLazyDialogTrigger = <LazyDialogTrigger size="icon" />
// @ts-expect-error icon popover triggers require an accessible name
const invalidPopoverTrigger = <PopoverTrigger target="popover" size="icon" />
// @ts-expect-error icon popover close buttons require an accessible name
const invalidPopoverClose = <PopoverClose target="popover" size="icon-sm" />
// @ts-expect-error icon lazy popover triggers require an accessible name
const invalidLazyPopoverTrigger = <LazyPopoverTrigger size="icon-lg" />
// @ts-expect-error icon lazy menu triggers require an accessible name
const invalidLazyPopoverMenuTrigger = <LazyPopoverMenuTrigger size="icon" />
// @ts-expect-error icon dropdown triggers require an accessible name
const invalidDropdownMenuTrigger = <DropdownMenuTrigger target="menu" size="icon" />
// @ts-expect-error icon lazy dropdown triggers require an accessible name
const invalidLazyDropdownMenuTrigger = <LazyDropdownMenuTrigger size="icon-sm" />
// @ts-expect-error icon context-menu buttons require an accessible name
const invalidContextMenuButton = <ContextMenuButton target="context-menu" size="icon" />
// @ts-expect-error icon lazy context-menu buttons require an accessible name
const invalidLazyContextMenuButton = <LazyContextMenuButton size="icon-lg" />
// @ts-expect-error icon alert-dialog triggers require an accessible name
const invalidAlertDialogTrigger = <AlertDialogTrigger target="alert" size="icon" />
// @ts-expect-error icon alert-dialog cancel buttons require an accessible name
const invalidAlertDialogCancel = <AlertDialogCancel target="alert" size="icon-sm" />
// @ts-expect-error icon alert-dialog action buttons require an accessible name
const invalidAlertDialogAction = <AlertDialogAction target="alert" size="icon-lg" />
// @ts-expect-error icon lazy alert-dialog triggers require an accessible name
const invalidLazyAlertDialogTrigger = <LazyAlertDialogTrigger size="icon" />
// @ts-expect-error icon drawer triggers require an accessible name
const invalidDrawerTrigger = <DrawerTrigger target="drawer" size="icon" />
// @ts-expect-error icon drawer close buttons require an accessible name
const invalidDrawerClose = <DrawerClose target="drawer" size="icon-sm" />
// @ts-expect-error icon sheet triggers require an accessible name
const invalidSheetTrigger = <SheetTrigger target="sheet" size="icon" />
// @ts-expect-error icon sheet close buttons require an accessible name
const invalidSheetClose = <SheetClose target="sheet" size="icon-lg" />
// @ts-expect-error icon tooltip triggers require an accessible name
const invalidTooltipTrigger = <TooltipTrigger target="tooltip" size="icon" />
// @ts-expect-error icon hover-card triggers require an accessible name
const invalidHoverCardTrigger = <HoverCardTrigger target="hover-card" size="icon-sm" />
// @ts-expect-error icon command triggers require an accessible name
const invalidCommandTrigger = <CommandTrigger target="command" size="icon-lg" />
// @ts-expect-error SidebarTrigger always renders an icon-sized Button
const invalidSidebarTrigger = <SidebarTrigger target="sidebar" />

const namedButton = <Button size="icon" aria-label="Close" />
const labelledButton = <Button size="icon-sm" aria-labelledby="close-label" />
const namedDynamicButton = <Button size={dynamicSize} aria-label="Dynamic action" />
const namedDialogTrigger = <DialogTrigger target="dialog" size="icon" aria-label="Open" />
const namedDialogClose = <DialogClose target="dialog" size="icon" aria-label="Close" />
const namedLazyDialogTrigger = <LazyDialogTrigger size="icon" aria-label="Open" />
const namedPopoverTrigger = <PopoverTrigger target="popover" size="icon" aria-label="Open" />
const namedPopoverClose = <PopoverClose target="popover" size="icon" aria-label="Close" />
const namedLazyPopoverTrigger = <LazyPopoverTrigger size="icon" aria-label="Open" />
const namedLazyPopoverMenuTrigger = <LazyPopoverMenuTrigger size="icon" aria-label="Open menu" />
const namedDropdownMenuTrigger = (
  <DropdownMenuTrigger target="menu" size="icon" aria-label="Open menu" />
)
const namedLazyDropdownMenuTrigger = (
  <LazyDropdownMenuTrigger size="icon" aria-label="Open menu" />
)
const namedContextMenuButton = (
  <ContextMenuButton target="context-menu" size="icon" aria-label="Open context menu" />
)
const namedLazyContextMenuButton = (
  <LazyContextMenuButton size="icon" aria-label="Open context menu" />
)
const namedAlertDialogTrigger = (
  <AlertDialogTrigger target="alert" size="icon" aria-label="Open warning" />
)
const namedAlertDialogCancel = (
  <AlertDialogCancel target="alert" size="icon" aria-label="Cancel" />
)
const namedAlertDialogAction = (
  <AlertDialogAction target="alert" size="icon" aria-label="Confirm" />
)
const namedLazyAlertDialogTrigger = (
  <LazyAlertDialogTrigger size="icon" aria-label="Open warning" />
)
const namedDrawerTrigger = <DrawerTrigger target="drawer" size="icon" aria-label="Open drawer" />
const namedDrawerClose = <DrawerClose target="drawer" size="icon" aria-label="Close drawer" />
const namedSheetTrigger = <SheetTrigger target="sheet" size="icon" aria-label="Open sheet" />
const namedSheetClose = <SheetClose target="sheet" size="icon" aria-label="Close sheet" />
const namedTooltipTrigger = <TooltipTrigger target="tooltip" size="icon" aria-label="Help" />
const namedHoverCardTrigger = (
  <HoverCardTrigger target="hover-card" size="icon" aria-label="Profile" />
)
const namedCommandTrigger = <CommandTrigger target="command" size="icon" aria-label="Search" />
const namedSidebarTrigger = <SidebarTrigger target="sidebar" aria-label="Open sidebar" />
const internallyNamedCopyButton = <CopyToClipboardButton value="copy me" />

void [
  invalidButton,
  invalidDynamicButton,
  invalidDialogTrigger,
  invalidDialogClose,
  invalidLazyDialogTrigger,
  invalidPopoverTrigger,
  invalidPopoverClose,
  invalidLazyPopoverTrigger,
  invalidLazyPopoverMenuTrigger,
  invalidDropdownMenuTrigger,
  invalidLazyDropdownMenuTrigger,
  invalidContextMenuButton,
  invalidLazyContextMenuButton,
  invalidAlertDialogTrigger,
  invalidAlertDialogCancel,
  invalidAlertDialogAction,
  invalidLazyAlertDialogTrigger,
  invalidDrawerTrigger,
  invalidDrawerClose,
  invalidSheetTrigger,
  invalidSheetClose,
  invalidTooltipTrigger,
  invalidHoverCardTrigger,
  invalidCommandTrigger,
  invalidSidebarTrigger,
  namedButton,
  labelledButton,
  namedDynamicButton,
  namedDialogTrigger,
  namedDialogClose,
  namedLazyDialogTrigger,
  namedPopoverTrigger,
  namedPopoverClose,
  namedLazyPopoverTrigger,
  namedLazyPopoverMenuTrigger,
  namedDropdownMenuTrigger,
  namedLazyDropdownMenuTrigger,
  namedContextMenuButton,
  namedLazyContextMenuButton,
  namedAlertDialogTrigger,
  namedAlertDialogCancel,
  namedAlertDialogAction,
  namedLazyAlertDialogTrigger,
  namedDrawerTrigger,
  namedDrawerClose,
  namedSheetTrigger,
  namedSheetClose,
  namedTooltipTrigger,
  namedHoverCardTrigger,
  namedCommandTrigger,
  namedSidebarTrigger,
  internallyNamedCopyButton,
]
