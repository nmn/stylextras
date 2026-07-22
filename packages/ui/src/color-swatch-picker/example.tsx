import { ColorSwatchPicker } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <DemoFrame
      title="Swatch Picker"
      description="A labeled native radio group provides selection, keyboard, reset, and form behavior."
    >
      <ColorSwatchPicker
        colors={['#2563eb', '#0f766e', '#9333ea', '#ea580c', '#dc2626']}
        defaultValue="#2563eb"
        legend="Accent color"
        name="accentColor"
      />
    </DemoFrame>
  )
}
