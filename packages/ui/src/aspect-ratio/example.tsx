'use client'

import { AspectRatio } from './index'
import { DemoFrame, DemoGrid, DemoPanel } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Ratios"
        description="Aspect Ratio should show its main presets side by side."
      >
        <DemoGrid>
          <DemoPanel>
            <AspectRatio ratio="square">Square</AspectRatio>
          </DemoPanel>
          <DemoPanel>
            <AspectRatio ratio="video">Video</AspectRatio>
          </DemoPanel>
          <DemoPanel>
            <AspectRatio ratio="portrait">Portrait</AspectRatio>
          </DemoPanel>
          <DemoPanel>
            <AspectRatio ratio="landscape">Landscape</AspectRatio>
          </DemoPanel>
        </DemoGrid>
      </DemoFrame>
    </>
  )
}
