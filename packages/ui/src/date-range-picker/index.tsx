'use client'

import {
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FieldError } from '../field'
import { isAriaInvalid, mergeIdRefs } from '../internal/field-relationships'
import { composeRefs } from '../internal/refs'
import {
  RangeCalendar,
  type RangeCalendarFieldProps,
  type RangeCalendarProps,
} from '../range-calendar'

export type DateRangePickerProps = Omit<
  RangeCalendarProps,
  'children' | 'endProps' | 'startProps'
> & {
  children?: ReactNode
  endProps?: RangeCalendarFieldProps
  /** Plain text used for native constraint validation and the associated error. */
  invalidRangeMessage?: string
  startProps?: RangeCalendarFieldProps
}

/**
 * Enhances the native RangeCalendar with cross-field ordering validation while
 * retaining normal form submission, external form association, and reset.
 */
export function DateRangePicker({
  children,
  endId,
  endProps,
  invalidRangeMessage = 'End date must be on or after start date.',
  startId,
  startProps,
  ...props
}: DateRangePickerProps) {
  const generatedId = useId().replaceAll(':', '')
  const resolvedStartId = startId ?? `stylextras-date-range-start-${generatedId}`
  const resolvedEndId = endId ?? `stylextras-date-range-end-${generatedId}`
  const errorId = `${resolvedEndId}-range-error`
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const [interacted, setInteracted] = useState(false)
  const [rangeInvalid, setRangeInvalid] = useState(false)

  const {
    onBlur: onStartBlur,
    onChange: onStartChange,
    onInvalid: onStartInvalid,
    ref: startRefProp,
    ...startInputProps
  } = startProps ?? {}
  const {
    'aria-describedby': endDescribedBy,
    'aria-errormessage': endErrorMessage,
    'aria-invalid': endAriaInvalid,
    onBlur: onEndBlur,
    onChange: onEndChange,
    onInvalid: onEndInvalid,
    ref: endRefProp,
    ...endInputProps
  } = endProps ?? {}
  const setStartRef = useMemo(() => composeRefs(startRef, startRefProp), [startRefProp])
  const setEndRef = useMemo(() => composeRefs(endRef, endRefProp), [endRefProp])

  const syncValidity = useCallback(() => {
    const start = startRef.current
    const end = endRef.current
    if (!start || !end) return false

    const invalid = start.value !== '' && end.value !== '' && start.value > end.value
    end.setCustomValidity(invalid ? invalidRangeMessage : '')
    setRangeInvalid(invalid)
    return invalid
  }, [invalidRangeMessage])

  useEffect(() => {
    syncValidity()
  }, [syncValidity])

  useEffect(() => {
    const forms = new Set(
      [startRef.current?.form, endRef.current?.form].filter(
        (form): form is HTMLFormElement => form !== null && form !== undefined,
      ),
    )
    if (forms.size === 0) return

    const handleReset = () => {
      setInteracted(false)
      requestAnimationFrame(() => syncValidity())
    }
    for (const form of forms) form.addEventListener('reset', handleReset)
    return () => {
      for (const form of forms) form.removeEventListener('reset', handleReset)
    }
  }, [syncValidity])

  function handleStartChange(event: ChangeEvent<HTMLInputElement>) {
    onStartChange?.(event)
    setInteracted(true)
    syncValidity()
  }

  function handleEndChange(event: ChangeEvent<HTMLInputElement>) {
    onEndChange?.(event)
    setInteracted(true)
    syncValidity()
  }

  function handleStartBlur(event: FocusEvent<HTMLInputElement>) {
    onStartBlur?.(event)
    setInteracted(true)
    syncValidity()
  }

  function handleEndBlur(event: FocusEvent<HTMLInputElement>) {
    onEndBlur?.(event)
    setInteracted(true)
    syncValidity()
  }

  function handleStartInvalid(event: FormEvent<HTMLInputElement>) {
    onStartInvalid?.(event)
    setInteracted(true)
    syncValidity()
  }

  function handleEndInvalid(event: FormEvent<HTMLInputElement>) {
    onEndInvalid?.(event)
    setInteracted(true)
    syncValidity()
  }

  const showRangeError = interacted && rangeInvalid
  const consumerEndInvalid = isAriaInvalid(endAriaInvalid)
  const resolvedEndInvalid = showRangeError ? true : endAriaInvalid
  const resolvedEndErrorMessage =
    showRangeError || consumerEndInvalid
      ? mergeIdRefs(endErrorMessage, showRangeError ? errorId : undefined)
      : undefined

  return (
    <RangeCalendar
      {...props}
      startId={resolvedStartId}
      endId={resolvedEndId}
      startProps={{
        ...startInputProps,
        ref: setStartRef,
        onBlur: handleStartBlur,
        onChange: handleStartChange,
        onInvalid: handleStartInvalid,
      }}
      endProps={{
        ...endInputProps,
        'aria-describedby': mergeIdRefs(endDescribedBy, resolvedEndErrorMessage),
        'aria-errormessage': resolvedEndErrorMessage,
        'aria-invalid': resolvedEndInvalid,
        ref: setEndRef,
        onBlur: handleEndBlur,
        onChange: handleEndChange,
        onInvalid: handleEndInvalid,
      }}
    >
      {showRangeError ? <FieldError id={errorId}>{invalidRangeMessage}</FieldError> : null}
      {children}
    </RangeCalendar>
  )
}
