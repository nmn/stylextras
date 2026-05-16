'use client'

import { CopyToClipboardButton } from './index'
import { DemoFrame, DemoRow } from '../example-theme/demo'

export default function Example() {
  return (
    <DemoFrame
      title="Copy actions"
      description="Copy buttons are icon actions with brief confirmation."
    >
      <DemoRow>
        <CopyToClipboardButton label="Copy install command" value="npx create-stylextras app" />
        <CopyToClipboardButton
          label="Copy package name"
          copiedText="Package copied!"
          value="@stylextras/ui"
        />
      </DemoRow>
    </DemoFrame>
  )
}
