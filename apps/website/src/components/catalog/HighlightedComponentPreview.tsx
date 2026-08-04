import { codeHighlightThemes } from '@/lib/code-highlight-theme'
import { highlight } from 'fumadocs-core/highlight'
import type { ReactNode } from 'react'
import { ComponentPreview as ClientComponentPreview } from './ComponentPreview'

interface ComponentPreviewProps {
  children: ReactNode
  code?: string
  name: string
}

function HighlightedCodeContents({ children }: { children?: ReactNode }) {
  return <>{children}</>
}

export async function ComponentPreview({ children, code, name }: ComponentPreviewProps) {
  const trimmedCode = code?.trim()
  const highlightedCode = trimmedCode
    ? await highlight(trimmedCode, {
        components: {
          code: HighlightedCodeContents,
          pre: HighlightedCodeContents,
        },
        lang: 'tsx',
        themes: codeHighlightThemes,
      })
    : undefined

  return (
    <ClientComponentPreview code={trimmedCode} highlightedCode={highlightedCode} name={name}>
      {children}
    </ClientComponentPreview>
  )
}
