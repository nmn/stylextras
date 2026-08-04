import { ButtonGroup } from '../button-group'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Field, FieldDescription, FieldLabel } from '../field'
import { Select } from '../select'
import { AnchoredDialogBridge } from './client'
import {
  AnchoredDialog,
  AnchoredDialogBody,
  AnchoredDialogClose,
  AnchoredDialogDescription,
  AnchoredDialogFooter,
  AnchoredDialogHeader,
  AnchoredDialogRoot,
  AnchoredDialogTitle,
  AnchoredDialogTrigger,
} from './index'

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame
        title="Anchored settings"
        description="A compact modal form placed against its invoker."
      >
        <AnchoredDialogRoot>
          <AnchoredDialogTrigger target="example-anchored-settings">
            View options
          </AnchoredDialogTrigger>
          <AnchoredDialog
            id="example-anchored-settings"
            aria-labelledby="example-anchored-settings-title"
            aria-describedby="example-anchored-settings-description"
            size="md"
          >
            <AnchoredDialogHeader>
              <AnchoredDialogTitle id="example-anchored-settings-title">
                View options
              </AnchoredDialogTitle>
              <AnchoredDialogDescription id="example-anchored-settings-description">
                Adjust how this project is displayed.
              </AnchoredDialogDescription>
            </AnchoredDialogHeader>
            <AnchoredDialogBody>
              <Field>
                <FieldLabel htmlFor="example-density">Density</FieldLabel>
                <Select id="example-density" defaultValue="comfortable">
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </Select>
                <FieldDescription>The setting applies to every project view.</FieldDescription>
              </Field>
            </AnchoredDialogBody>
            <AnchoredDialogFooter>
              <ButtonGroup variant="actions" aria-label="View option actions">
                <AnchoredDialogClose target="example-anchored-settings">Cancel</AnchoredDialogClose>
                <AnchoredDialogClose target="example-anchored-settings" variant="primary">
                  Apply
                </AnchoredDialogClose>
              </ButtonGroup>
            </AnchoredDialogFooter>
            <AnchoredDialogBridge target="example-anchored-settings" />
          </AnchoredDialog>
        </AnchoredDialogRoot>
      </DemoFrame>

      <DemoFrame
        title="Compact action dialog"
        description="The same modal semantics in a popover-sized surface."
      >
        <AnchoredDialogRoot>
          <AnchoredDialogTrigger target="example-anchored-actions" variant="ghost">
            More actions
          </AnchoredDialogTrigger>
          <AnchoredDialog
            id="example-anchored-actions"
            aria-labelledby="example-anchored-actions-title"
            placement="top"
            size="sm"
          >
            <AnchoredDialogHeader>
              <AnchoredDialogTitle id="example-anchored-actions-title">
                Project actions
              </AnchoredDialogTitle>
            </AnchoredDialogHeader>
            <AnchoredDialogBody>
              This is still a modal dialog: background content is inert until it closes.
            </AnchoredDialogBody>
            <AnchoredDialogFooter>
              <AnchoredDialogClose target="example-anchored-actions">Done</AnchoredDialogClose>
            </AnchoredDialogFooter>
            <AnchoredDialogBridge target="example-anchored-actions" />
          </AnchoredDialog>
        </AnchoredDialogRoot>
      </DemoFrame>
    </DemoStack>
  )
}
