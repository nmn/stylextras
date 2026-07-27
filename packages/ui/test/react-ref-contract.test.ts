import { describe, expectTypeOf, it } from 'vitest'
import type { FlexProps } from '../src/flex'
import type { FooterProps } from '../src/footer'
import type { FormProps } from '../src/form'
import type { GridProps } from '../src/grid'
import type { ImageCropPreviewProps } from '../src/image-cropper'
import type { MeterProps } from '../src/meter'

describe('React 19 ref contracts', () => {
  it('includes refs on retained DOM-rendering primitives', () => {
    expectTypeOf<FlexProps>().toHaveProperty('ref')
    expectTypeOf<FooterProps>().toHaveProperty('ref')
    expectTypeOf<FormProps>().toHaveProperty('ref')
    expectTypeOf<GridProps>().toHaveProperty('ref')
    expectTypeOf<ImageCropPreviewProps>().toHaveProperty('ref')
    expectTypeOf<MeterProps>().toHaveProperty('ref')
  })
})
