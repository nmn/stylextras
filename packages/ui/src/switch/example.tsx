import * as stylex from '@stylexjs/stylex'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Label } from '../label'
import { spacing } from '../tokens/spacing.stylex'
import { Switch } from './index'

export default function Example() {
  return (
    <DemoFrame title="Switch" description="A styled native checkbox with switch semantics.">
      <DemoStack>
        <Label sx={styles.option}><Switch defaultChecked /> Notifications</Label>
        <Label sx={styles.option}><Switch /> Public profile</Label>
        <Label sx={styles.option}><Switch controlSize="sm" /> Compact mode</Label>
      </DemoStack>
    </DemoFrame>
  )
}

const styles = stylex.create({ option: { alignItems: 'center', display: 'flex', gap: spacing.sm } })
'use client'
