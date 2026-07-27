'use client'

import { CodeBlock, Pre } from '@/components/mdx/CodeBlock'
import { tabsMarker } from '@/components/mdx/mdx.stylex'
import * as stylex from '@stylexjs/stylex'
import { Button } from '@stylextras/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stylextras/ui/tabs'
import { useEffect, useState } from 'react'

export function DocsMigrationCodeFixture() {
  const [content, setContent] = useState('npm install @stylextras/ui')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  return (
    <Tabs
      data-hydrated={hydrated ? 'true' : 'false'}
      data-testid="dynamic-code-fixture"
      defaultValue="npm"
      sx={[styles.tabs, tabsMarker] as stylex.StyleXStyles}
    >
      <TabsList aria-label="Content tabs">
        <TabsTrigger value="npm">npm</TabsTrigger>
        <TabsTrigger value="bun">bun</TabsTrigger>
      </TabsList>
      <TabsContent value="npm">
        <div>
          <Button onClick={() => setContent('npm install @stylextras/ui@current')} size="sm">
            Use current install command
          </Button>
          <CodeBlock data-testid="mdx-code-block">
            <Pre data-testid="mdx-code-value">{content}</Pre>
          </CodeBlock>
        </div>
      </TabsContent>
      <TabsContent value="bun">
        <p>bun add @stylextras/ui</p>
      </TabsContent>
    </Tabs>
  )
}

const styles = stylex.create({
  tabs: {
    marginTop: 16,
  },
})
