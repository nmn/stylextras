'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { formatDisplayDate } from '../calendar/date-utils'
import { Input } from '../input'
import { Popover } from '../popover'
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { radius } from '../tokens/radius.stylex'

type NativeRootProps = ComponentPropsWithRef<'div'>

export type DatePickerProps = Omit<NativeRootProps, 'className' | 'defaultValue' | 'style'> & {
  defaultValue?: string
  disabled?: boolean
  inputId?: string
  locale?: string
  max?: string
  min?: string
  name?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  sx?: StyleXStyles
  value?: string
}

/** Calendar, input, and Popover API composed into a form-compatible date picker. */
export function DatePicker({
  defaultValue = '',
  disabled = false,
  inputId,
  locale = 'en-US',
  max,
  min,
  name,
  onValueChange,
  placeholder = 'Pick a date',
  ref,
  required = false,
  sx,
  value,
  ...props
}: DatePickerProps) {
  const generatedId = useId().replaceAll(':', '')
  const popoverId = `stylextras-date-picker-${generatedId}`
  const inputRef = useRef<HTMLInputElement>(null)
  const defaultValueRef = useRef(defaultValue)
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = value ?? internalValue

  const setValue = (nextValue: string) => {
    if (!controlled) setInternalValue(nextValue)
    onValueChange?.(nextValue)
    document.getElementById(popoverId)?.hidePopover()
    inputRef.current?.focus()
  }

  const open = () => {
    if (disabled) return
    const popover = document.getElementById(popoverId)
    if (popover && !popover.matches(':popover-open')) {
      const source = inputRef.current
      showPopoverWithSource(popover, source ?? undefined)
    }
  }

  useEffect(() => {
    const form = inputRef.current?.form
    if (!form || controlled) return
    const reset = () => {
      setInternalValue(defaultValueRef.current)
    }
    form.addEventListener('reset', reset)
    return () => form.removeEventListener('reset', reset)
  }, [controlled])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  return (
    <div ref={ref} {...props} {...stylex.props(styles.root, sx)}>
      <Input
        ref={inputRef}
        id={inputId}
        readOnly
        aria-controls={popoverId}
        aria-haspopup="dialog"
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        value={selectedValue ? formatDisplayDate(selectedValue, locale) : ''}
        onClick={open}
        onKeyDown={handleKeyDown}
        sx={styles.input}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Open calendar"
        disabled={disabled}
        popoverTarget={popoverId}
        sx={styles.trigger}
      >
        ◫
      </Button>
      <Popover id={popoverId} size="sm" aria-label="Choose a date" sx={styles.popover}>
        <Calendar
          locale={locale}
          {...(min ? { min } : {})}
          {...(max ? { max } : {})}
          value={selectedValue}
          onValueChange={setValue}
        />
      </Popover>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
        />
      ) : null}
    </div>
  )
}

const styles = stylex.create({
  root: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    position: 'relative',
  },
  input: {
    borderEndEndRadius: 0,
    borderStartEndRadius: 0,
    cursor: 'pointer',
    paddingInlineEnd: '2.5rem',
  },
  trigger: {
    borderEndStartRadius: 0,
    borderStartStartRadius: 0,
    marginInlineStart: -1,
  },
  popover: {
    borderRadius: radius.sm,
    padding: 0,
  },
})
