'use client'

import { CopyToClipboardButton } from '@stylextras/ui/copy-to-clipboard-button'
import { useEffect, useState } from 'react'

export function DocsMigrationCopyErrorFixture() {
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedValue, setCopiedValue] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  return (
    <div
      data-hydrated={hydrated ? 'true' : 'false'}
      data-testid="copy-error-fixture"
    >
      <CopyToClipboardButton
        feedback="none"
        icon="Copy"
        label="Copy error fixture"
        onError={(error) => {
          setErrorMessage(error instanceof Error ? error.message : String(error))
        }}
        onCopy={setCopiedValue}
        resetAfterMs={10_000}
        value="copy error value"
        variant="primary"
      />
      <span data-testid="copy-error-output">{errorMessage}</span>
      <span data-testid="copy-success-output">{copiedValue}</span>
    </div>
  )
}
