import * as stylex from '@stylexjs/stylex'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Label } from '../label'
import { spacing } from '../tokens/spacing.stylex'
import { Switch } from './index'

export default function Example() {
  return (
    <DemoFrame title="Switch" description="A styled native checkbox with switch semantics.">
      <DemoStack>
        <Label htmlFor="switch-notifications" sx={styles.option}><Switch id="switch-notifications" defaultChecked /> Notifications</Label>
        <Label htmlFor="switch-profile" sx={styles.option}><Switch id="switch-profile" /> Public profile</Label>
        <Label htmlFor="switch-compact" sx={styles.option}><Switch id="switch-compact" controlSize="sm" /> Compact mode</Label>
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
