import type { ReactElement } from 'react'
import { Toast, toast } from '../toast'

const staticToast: ReactElement = <Toast>Saved locally</Toast>
const liveToast: ReactElement = (
  <Toast priority="polite" announcement="Saved">
    <button type="button">Undo</button>
  </Toast>
)

toast({ title: 'Saved' })
toast({ announcement: 'Saved', title: <strong>Saved</strong> })

// @ts-expect-error Rich queue content needs a plain-text announcement.
toast({ title: <strong>Saved</strong> })
// @ts-expect-error A live primitive Toast needs explicit announcement text.
const unnamedLiveToast = <Toast priority="assertive">Failed</Toast>

void staticToast
void liveToast
void unnamedLiveToast
