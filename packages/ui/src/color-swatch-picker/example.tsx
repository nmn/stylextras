import { ColorSwatchPicker } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <DemoFrame
      title="Swatch Picker"
      description="A labeled native radio group provides selection, keyboard, reset, and form behavior."
    >
      <ColorSwatchPicker
        colors={[
          { color: '#2563eb', label: 'Blue', value: 'blue' },
          { color: '#0f766e', label: 'Teal', value: 'teal' },
          { color: '#9333ea', label: 'Purple', value: 'purple' },
          { color: '#ea580c', label: 'Orange', value: 'orange' },
          { color: '#dc2626', label: 'Red', value: 'red' },
        ]}
        defaultValue="blue"
        legend="Accent color"
        name="accentColor"
      />
    </DemoFrame>
  )
}
