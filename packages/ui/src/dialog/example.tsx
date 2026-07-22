import { ButtonGroup } from '../button-group'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Field, FieldLabel } from '../field'
import { Input } from '../input'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogSize,
} from './index'
import { DialogCommandBridge } from './client'

function RenameDialog({ id, size }: { id: string; size: DialogSize }) {
  return (
    <Dialog id={id} size={size} aria-labelledby={`${id}-title`}>
      <DialogHeader>
        <DialogTitle id={`${id}-title`}>Rename component</DialogTitle>
        <DialogDescription>Choose a concise display name.</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <Field>
          <FieldLabel htmlFor={`${id}-display-name`}>Display name</FieldLabel>
          <Input id={`${id}-display-name`} name="displayName" defaultValue="Segmented Control" />
        </Field>
      </DialogBody>
      <DialogFooter>
        <ButtonGroup variant="actions" aria-label="Rename component actions">
          <DialogClose target={id}>Cancel</DialogClose>
          <DialogClose target={id} variant="primary">
            Done
          </DialogClose>
        </ButtonGroup>
      </DialogFooter>
      <DialogCommandBridge target={id} />
    </Dialog>
  )
}

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame title="Small dialog" description="Compact confirmations and single-field tasks.">
        <DialogTrigger target="rename-small-dialog">Open small dialog</DialogTrigger>
        <RenameDialog id="rename-small-dialog" size="sm" />
      </DemoFrame>
      <DemoFrame title="Medium dialog" description="The default size for ordinary editing flows.">
        <DialogTrigger target="rename-medium-dialog">Open medium dialog</DialogTrigger>
        <RenameDialog id="rename-medium-dialog" size="md" />
      </DemoFrame>
      <DemoFrame title="Large dialog" description="More room for dense forms and review content.">
        <DialogTrigger target="rename-large-dialog">Open large dialog</DialogTrigger>
        <RenameDialog id="rename-large-dialog" size="lg" />
      </DemoFrame>
    </DemoStack>
  )
}
;('use client')
