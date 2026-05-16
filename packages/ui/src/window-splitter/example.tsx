'use client'

import { WindowSplitter } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Orientations"
        description="Window Splitter should show both orientations directly."
      >
        <DemoStack>
          <WindowSplitter orientation="horizontal" />
          <WindowSplitter orientation="vertical" />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
