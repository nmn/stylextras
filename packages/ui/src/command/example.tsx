'use client'

import { DemoFrame } from '../example-theme/demo'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandStatus,
  CommandTrigger,
} from './index'

const commandId = 'quick-jump-command'

export default function Example() {
  return (
    <DemoFrame title="Quick jump" description="Filter and run commands with the keyboard.">
      <CommandTrigger target={commandId}>Open command menu</CommandTrigger>
      <Command id={commandId} aria-label="Quick jump">
        <CommandInput aria-label="Search commands" autoFocus placeholder="Search commands…" />
        <CommandList>
          <CommandItem value="button-docs" keywords="components actions">
            Open button docs
          </CommandItem>
          <CommandItem value="tokens" keywords="theme variables">
            Jump to tokens
          </CommandItem>
          <CommandItem value="examples" keywords="gallery demos">
            Browse examples
          </CommandItem>
          <CommandEmpty />
          <CommandStatus>
            {(count) => `${count} command${count === 1 ? '' : 's'} available.`}
          </CommandStatus>
        </CommandList>
      </Command>
    </DemoFrame>
  )
}
