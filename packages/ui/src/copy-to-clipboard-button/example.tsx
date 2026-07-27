'use client'

import { DemoFrame, DemoRow } from '../example-theme/demo'
import { CopyToClipboardButton } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Copy actions"
      description="Copy buttons are icon actions with brief confirmation."
    >
      <DemoRow>
        <CopyToClipboardButton
          label="Copy install command"
          resetAfterMs={2000}
          value={() => 'npx create-stylextras app'}
        />
        <CopyToClipboardButton
          copiedIcon="Done"
          label="Copy package name"
          copiedText="Package copied!"
          value="@stylextras/ui"
        />
        <CopyToClipboardButton
          feedback="none"
          label="Copy without popover feedback"
          value="@stylextras/ui/button"
        />
      </DemoRow>
    </DemoFrame>
  )
}
