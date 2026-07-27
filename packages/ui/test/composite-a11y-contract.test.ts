import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { CarouselItemProps, CarouselProps } from '../src/carousel'
import type {
  ComboboxEmptyProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxListProps,
  ComboboxStatusProps,
} from '../src/combobox'
import type { CommandInputProps, CommandItemProps, CommandStatusProps } from '../src/command'
import type { CommandEmptyProps, CommandListProps } from '../src/command'
import type { ResizableHandleProps } from '../src/resizable'

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')

describe('composite accessibility contracts', () => {
  it('keeps composite input and option ownership controlled by each root', () => {
    expectTypeOf<ComboboxInputProps['type']>().toEqualTypeOf<'search' | 'text' | undefined>()
    expectTypeOf<ComboboxInputProps>().not.toHaveProperty('disabled')
    expectTypeOf<ComboboxInputProps>().not.toHaveProperty('form')
    expectTypeOf<ComboboxInputProps>().not.toHaveProperty('required')
    expectTypeOf<ComboboxListProps>().not.toHaveProperty('role')
    expectTypeOf<ComboboxItemProps>().not.toHaveProperty('aria-selected')
    expectTypeOf<ComboboxItemProps>().not.toHaveProperty('tabIndex')
    expectTypeOf<ComboboxEmptyProps>().not.toHaveProperty('hidden')

    expectTypeOf<CommandInputProps['type']>().toEqualTypeOf<'search' | 'text' | undefined>()
    expectTypeOf<CommandItemProps>().not.toHaveProperty('tabIndex')
    expectTypeOf<CommandItemProps>().not.toHaveProperty('id')
    expectTypeOf<CommandItemProps>().toHaveProperty('disabled')
    expectTypeOf<CommandListProps>().not.toHaveProperty('id')
    expectTypeOf<CommandEmptyProps>().not.toHaveProperty('hidden')
    expectTypeOf<ComboboxStatusProps['children']>().toEqualTypeOf<
      string | ((count: number) => string)
    >()
    expectTypeOf<CommandStatusProps['children']>().toEqualTypeOf<
      string | ((count: number) => string)
    >()
  })

  it('keeps active identity separate from duplicate consumer values', () => {
    const combobox = readFileSync(path.join(sourceRoot, 'combobox/index.tsx'), 'utf8')
    const command = readFileSync(path.join(sourceRoot, 'command/index.tsx'), 'utf8')

    expect(combobox).toContain('context.selectedId === id')
    expect(combobox).not.toContain('context.selectedValue === value')
    expect(command).toContain('item.onSelect?.(item.value)')
  })

  it('constrains carousel roles and renders control labels as HTML', () => {
    expectTypeOf<CarouselProps['role']>().toEqualTypeOf<'group' | 'region' | undefined>()
    expectTypeOf<CarouselItemProps['role']>().toEqualTypeOf<'group' | undefined>()

    const source = readFileSync(path.join(sourceRoot, 'carousel/index.tsx'), 'utf8')
    expect(source).toContain('{previousButtonLabel}</span>')
    expect(source).toContain('{nextButtonLabel}</span>')
    expect(source).not.toContain('data-carousel-')
    expect(source).not.toContain('content:')
  })

  it('requires resizable relationships and localized value text', () => {
    expectTypeOf<ResizableHandleProps>().toHaveProperty('aria-controls')
    expectTypeOf<ResizableHandleProps>().toHaveProperty('getValueText')
    expectTypeOf<ResizableHandleProps>().not.toHaveProperty('label')
    expectTypeOf<ResizableHandleProps>().not.toHaveProperty('aria-valuetext')
  })
})
