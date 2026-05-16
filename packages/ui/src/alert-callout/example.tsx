'use client'

import { AlertCallout } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Variants"
        description="Alert Callout is most useful when you can compare tone and emphasis at a glance."
      >
        <DemoStack>
          <AlertCallout variant="neutral">Neutral message</AlertCallout>
          <AlertCallout variant="info">Info message</AlertCallout>
          <AlertCallout variant="success">Success message</AlertCallout>
          <AlertCallout variant="warning">Warning message</AlertCallout>
          <AlertCallout variant="danger">Danger message</AlertCallout>
        </DemoStack>
      </DemoFrame>
    </>
  )
}
