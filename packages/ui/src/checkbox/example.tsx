import * as stylex from '@stylexjs/stylex'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Label } from '../label'
import { spacing } from '../tokens/spacing.stylex'
import { Checkbox } from './index'

export default function Example() {
  return (
    <DemoFrame title="Checkbox" description="Native checked, disabled, validation, and form behavior.">
      <DemoStack>
        <Label htmlFor="checkbox-updates" sx={styles.option}><Checkbox id="checkbox-updates" defaultChecked name="updates" /> Product updates</Label>
        <Label htmlFor="checkbox-analytics" sx={styles.option}><Checkbox id="checkbox-analytics" name="analytics" /> Usage analytics</Label>
        <Label htmlFor="checkbox-unavailable" sx={styles.option}><Checkbox id="checkbox-unavailable" disabled /> Unavailable option</Label>
        <Label htmlFor="checkbox-compact" sx={styles.option}><Checkbox id="checkbox-compact" controlSize="sm" /> Compact option</Label>
      </DemoStack>
    </DemoFrame>
  )
}

const styles = stylex.create({
  option: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.sm,
    minHeight: { default: spacing.targetMin, '@media (pointer: coarse)': spacing.targetCoarse },
  },
})
