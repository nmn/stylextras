'use client'

import { Listbox } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Listbox"
        description="Listbox is best shown as a visible option list, not embedded in extra flow."
      >
        <DemoStack>
          <Listbox
            aria-label="Enabled modules"
            options={['Tokens', 'Components', 'Themes', 'Examples', 'Docs']}
            size={5}
          />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
