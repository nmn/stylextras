import { describe, expectTypeOf, it } from 'vitest'
import type { ComboboxItemProps } from '../src/combobox'

describe('combobox managed attribute contract', () => {
  it('keeps filtering visibility out of consumer props', () => {
    expectTypeOf<ComboboxItemProps>().not.toHaveProperty('hidden')
    expectTypeOf<ComboboxItemProps>().toHaveProperty('onMouseDown')
  })
})
