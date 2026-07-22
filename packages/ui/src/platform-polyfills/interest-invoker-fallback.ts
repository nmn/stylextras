import { showPopoverWithSource } from './popover-source'

type FallbackOptions = {
  hideDelay: number
  interactive: boolean
  showDelay: number
}

/** Event fallback for browsers without `interestfor`. Loaded only after feature detection fails. */
export function installInterestInvokerFallback(
  trigger: HTMLElement,
  popover: HTMLElement,
  { hideDelay, interactive, showDelay }: FallbackOptions,
) {
  const nativeTarget = trigger.getAttribute('popovertarget')
  const nativeAction = trigger.getAttribute('popovertargetaction')
  // This bridge owns click activation. Keeping the native invoker active would
  // make some engines toggle the same popover twice.
  trigger.removeAttribute('popovertarget')
  trigger.removeAttribute('popovertargetaction')

  let showTimer = 0
  let hideTimer = 0
  let openedFromPointerInterest = false
  let openAtPointerDown = false
  const clear = () => {
    window.clearTimeout(showTimer)
    window.clearTimeout(hideTimer)
  }
  const cancelHide = () => window.clearTimeout(hideTimer)
  const scheduleShow = (fromPointerInterest: boolean) => {
    cancelHide()
    window.clearTimeout(showTimer)
    showTimer = window.setTimeout(() => {
      if (!popover.matches(':popover-open')) {
        showPopoverWithSource(popover, trigger)
        openedFromPointerInterest = fromPointerInterest
      }
    }, showDelay)
  }
  const show = () => scheduleShow(false)
  const hide = () => {
    window.clearTimeout(showTimer)
    window.clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => {
      if (popover.matches(':popover-open')) popover.hidePopover()
    }, hideDelay)
  }
  const hideFromPointer = () => {
    if (
      trigger.matches(':focus') ||
      (interactive && popover.contains(document.activeElement))
    ) {
      cancelHide()
      return
    }
    hide()
  }
  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      scheduleShow(true)
    }
  }
  const handleTriggerBlur = (event: FocusEvent) => {
    if (interactive && event.relatedTarget instanceof Node && popover.contains(event.relatedTarget)) {
      cancelHide()
      return
    }
    hide()
  }
  const handlePopoverFocusOut = (event: FocusEvent) => {
    if (!interactive) return
    const nextTarget = event.relatedTarget
    if (
      nextTarget instanceof Node &&
      (popover.contains(nextTarget) || trigger.contains(nextTarget))
    ) {
      return
    }
    hide()
  }
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !popover.matches(':popover-open')) return
    popover.hidePopover()
    if (interactive && popover.contains(document.activeElement)) {
      trigger.focus({ preventScroll: true })
    }
  }
  const handleClick = (event: MouseEvent) => {
    clear()
    const shouldHide =
      openAtPointerDown || (popover.matches(':popover-open') && event.detail === 0)
    openAtPointerDown = false
    if (shouldHide) {
      openedFromPointerInterest = false
      if (popover.matches(':popover-open')) popover.hidePopover()
      return
    }
    // A click adopts a tooltip that appeared only because the pointer moved
    // over the trigger on its way to clicking. The next click can then close it.
    openedFromPointerInterest = false
    trigger.focus({ preventScroll: true })
    window.clearTimeout(showTimer)
    if (!popover.matches(':popover-open')) showPopoverWithSource(popover, trigger)
  }
  const handlePointerDown = () => {
    openAtPointerDown = popover.matches(':popover-open') && !openedFromPointerInterest
  }
  const handlePointerCancel = () => {
    openAtPointerDown = false
  }
  const handleToggle = () => {
    if (!popover.matches(':popover-open')) {
      openedFromPointerInterest = false
      window.clearTimeout(showTimer)
    }
  }

  trigger.addEventListener('pointerenter', handlePointerEnter)
  trigger.addEventListener('pointerleave', hideFromPointer)
  trigger.addEventListener('focus', show)
  trigger.addEventListener('blur', handleTriggerBlur)
  trigger.addEventListener('pointerdown', handlePointerDown)
  trigger.addEventListener('pointercancel', handlePointerCancel)
  trigger.addEventListener('click', handleClick)
  popover.addEventListener('pointerenter', cancelHide)
  popover.addEventListener('pointerleave', hideFromPointer)
  popover.addEventListener('focusin', cancelHide)
  popover.addEventListener('focusout', handlePopoverFocusOut)
  popover.addEventListener('toggle', handleToggle)
  document.addEventListener('keydown', handleEscape)

  return () => {
    clear()
    openAtPointerDown = false
    trigger.removeEventListener('pointerenter', handlePointerEnter)
    trigger.removeEventListener('pointerleave', hideFromPointer)
    trigger.removeEventListener('focus', show)
    trigger.removeEventListener('blur', handleTriggerBlur)
    trigger.removeEventListener('pointerdown', handlePointerDown)
    trigger.removeEventListener('pointercancel', handlePointerCancel)
    trigger.removeEventListener('click', handleClick)
    popover.removeEventListener('pointerenter', cancelHide)
    popover.removeEventListener('pointerleave', hideFromPointer)
    popover.removeEventListener('focusin', cancelHide)
    popover.removeEventListener('focusout', handlePopoverFocusOut)
    popover.removeEventListener('toggle', handleToggle)
    document.removeEventListener('keydown', handleEscape)
    if (nativeTarget) trigger.setAttribute('popovertarget', nativeTarget)
    if (nativeAction) trigger.setAttribute('popovertargetaction', nativeAction)
  }
}
