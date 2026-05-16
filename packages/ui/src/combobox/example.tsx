'use client'

import { Combobox } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Options"
        description="Combobox should show a few straightforward option sets."
      >
        <DemoStack>
          <Combobox
            label="Reviewer"
            listId="reviewers"
            options={['Alex Kim', 'Taylor Rivera', 'Jordan Patel', 'Sam Lee']}
          />
          <Combobox
            label="Environment"
            listId="environments"
            options={['Development', 'Preview', 'Production']}
          />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
