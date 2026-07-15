import * as stylex from '@stylexjs/stylex'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Label } from '../label'
import { spacing } from '../tokens/spacing.stylex'
import { Checkbox } from './index'

export default function Example() {
  return (
    <DemoFrame title="Checkbox" description="Native checked, disabled, validation, and form behavior.">
      <DemoStack>
        <Label sx={styles.option}><Checkbox defaultChecked name="updates" /> Product updates</Label>
        <Label sx={styles.option}><Checkbox name="analytics" /> Usage analytics</Label>
        <Label sx={styles.option}><Checkbox disabled /> Unavailable option</Label>
        <Label sx={styles.option}><Checkbox controlSize="sm" /> Compact option</Label>
      </DemoStack>
    </DemoFrame>
  )
}

const styles = stylex.create({ option: { alignItems: 'center', display: 'flex', gap: spacing.sm } })
'use client'
