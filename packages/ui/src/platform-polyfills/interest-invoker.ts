'use client'

import { type Ref, useCallback, useEffect, useRef } from 'react'
import { showPopoverWithSource } from './popover-source'

type InterestOptions = {
  hideDelay?: number | undefined
  interactive?: boolean | undefined
  showDelay?: number | undefined
  target: string
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

/** A small event bridge used only when interest invokers are unavailable. */
export function useInterestInvoker<T extends HTMLElement>(
  externalRef: Ref<T> | undefined,
  { hideDelay = 120, interactive = false, showDelay = 500, target }: InterestOptions,
) {
  const ref = useRef<T>(null)

  const setRef = useCallback(
    (node: T | null) => {
      ref.current = node
      assignRef(externalRef, node)
    },
    [externalRef],
  )

  useEffect(() => {
    const trigger = ref.current
    if (!trigger || 'interestForElement' in trigger) return
    const popover = document.getElementById(target)
    if (!(popover instanceof HTMLElement)) return
    const relationship = interactive ? 'aria-details' : 'aria-describedby'
    const nativeTarget = trigger.getAttribute('popovertarget')
    const nativeAction = trigger.getAttribute('popovertargetaction')
    trigger.setAttribute(relationship, target)
    // The bridge owns click activation. Leaving the native invoker relationship
    // active can make Firefox apply a second toggle after the click handler.
    trigger.removeAttribute('popovertarget')
    trigger.removeAttribute('popovertargetaction')

    let showTimer = 0
    let hideTimer = 0
    let pointerActivationPending = false
    let openAtActivationStart = false
    const clear = () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
    const show = () => {
      window.clearTimeout(hideTimer)
      showTimer = window.setTimeout(() => {
        if (!popover.matches(':popover-open')) {
          showPopoverWithSource(popover, trigger)
        }
      }, showDelay)
    }
    const hide = () => {
      window.clearTimeout(showTimer)
      hideTimer = window.setTimeout(() => {
        if (popover.matches(':popover-open')) popover.hidePopover()
      }, hideDelay)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && popover.matches(':popover-open')) popover.hidePopover()
    }
    const handleClick = (event: MouseEvent) => {
      event.preventDefault()
      clear()
      const shouldHide =
        (event.detail > 0 && pointerActivationPending && openAtActivationStart) ||
        popover.matches(':popover-open')
      pointerActivationPending = false
      openAtActivationStart = false
      if (shouldHide) {
        if (popover.matches(':popover-open')) popover.hidePopover()
      } else {
        showPopoverWithSource(popover, trigger)
        trigger.focus({ preventScroll: true })
        clear()
      }
    }
    const handlePointerDown = () => {
      pointerActivationPending = true
      openAtActivationStart = popover.matches(':popover-open')
    }
    const handlePointerCancel = () => {
      pointerActivationPending = false
      openAtActivationStart = false
    }
    const handleToggle = () => {
      if (!popover.matches(':popover-open')) window.clearTimeout(showTimer)
    }
    const cancelHide = () => window.clearTimeout(hideTimer)

    trigger.addEventListener('pointerenter', show)
    trigger.addEventListener('pointerleave', hide)
    trigger.addEventListener('focus', show)
    trigger.addEventListener('blur', hide)
    trigger.addEventListener('pointerdown', handlePointerDown)
    trigger.addEventListener('pointercancel', handlePointerCancel)
    trigger.addEventListener('click', handleClick)
    popover.addEventListener('pointerenter', cancelHide)
    popover.addEventListener('pointerleave', hide)
    popover.addEventListener('toggle', handleToggle)
    document.addEventListener('keydown', handleEscape)

    return () => {
      clear()
      trigger.removeEventListener('pointerenter', show)
      trigger.removeEventListener('pointerleave', hide)
      trigger.removeEventListener('focus', show)
      trigger.removeEventListener('blur', hide)
      trigger.removeEventListener('pointerdown', handlePointerDown)
      trigger.removeEventListener('pointercancel', handlePointerCancel)
      trigger.removeEventListener('click', handleClick)
      popover.removeEventListener('pointerenter', cancelHide)
      popover.removeEventListener('pointerleave', hide)
      popover.removeEventListener('toggle', handleToggle)
      document.removeEventListener('keydown', handleEscape)
      trigger.removeAttribute(relationship)
      if (nativeTarget) trigger.setAttribute('popovertarget', nativeTarget)
      if (nativeAction) trigger.setAttribute('popovertargetaction', nativeAction)
    }
  }, [hideDelay, interactive, showDelay, target])

  return setRef
}
