import * as stylex from '@stylexjs/stylex'
import { DemoFrame } from '../example-theme/demo'
import { Label } from '../label'
import { spacing } from '../tokens/spacing.stylex'
import { RadioGroup, RadioGroupItem, RadioGroupLegend } from './index'

export default function Example() {
  return (
    <DemoFrame title="Radio group" description="A native fieldset and radio controls.">
      <RadioGroup>
        <RadioGroupLegend>Density</RadioGroupLegend>
        {['Compact', 'Default', 'Comfortable'].map((label) => (
          <Label key={label} sx={styles.option}>
            <RadioGroupItem name="density" value={label.toLowerCase()} defaultChecked={label === 'Default'} />
            {label}
          </Label>
        ))}
      </RadioGroup>
    </DemoFrame>
  )
}

const styles = stylex.create({ option: { alignItems: 'center', display: 'flex', gap: spacing.sm } })
'use client'
