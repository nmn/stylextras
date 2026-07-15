import { ButtonGroup } from '../button-group'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Field, FieldLabel } from '../field'
import { Input } from '../input'
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetFooter,
  SheetHeader,
  type SheetSide,
  SheetTrigger,
} from './index'

function ProjectSettingsSheet({ id, side }: { id: string; side: SheetSide }) {
  return (
    <Sheet id={id} side={side} aria-labelledby={`${id}-title`}>
      <SheetHeader>
        <strong id={`${id}-title`}>Project settings</strong>
      </SheetHeader>
      <SheetBody>
        <DemoStack>
          <Field>
            <FieldLabel htmlFor={`${id}-project-name`}>Project name</FieldLabel>
            <Input id={`${id}-project-name`} defaultValue="StyleXtras" />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-team-name`}>Team</FieldLabel>
            <Input id={`${id}-team-name`} defaultValue="Interface systems" />
          </Field>
        </DemoStack>
      </SheetBody>
      <SheetFooter>
        <ButtonGroup variant="actions" aria-label="Project settings actions">
          <SheetClose target={id}>Cancel</SheetClose>
          <SheetClose target={id} variant="primary">
            Save
          </SheetClose>
        </ButtonGroup>
      </SheetFooter>
    </Sheet>
  )
}

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame title="End sheet" description="A side-aligned native dialog for editing tasks.">
        <SheetTrigger target="end-settings-sheet">Open end sheet</SheetTrigger>
        <ProjectSettingsSheet id="end-settings-sheet" side="end" />
      </DemoFrame>
      <DemoFrame
        title="Start sheet"
        description="The same composition follows the document's inline start edge."
      >
        <SheetTrigger target="start-settings-sheet">Open start sheet</SheetTrigger>
        <ProjectSettingsSheet id="start-settings-sheet" side="start" />
      </DemoFrame>
    </DemoStack>
  )
}
