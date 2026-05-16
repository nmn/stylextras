'use client'

import { Select } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Select fields"
        description="Select should show compact, familiar option sets directly."
      >
        <DemoStack>
          <Select label="Environment" options={['Development', 'Preview', 'Production']} />
          <Select label="Category" options={['Buttons', 'Form', 'Navigation', 'Popups']} />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
