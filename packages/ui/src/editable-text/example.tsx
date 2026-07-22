import { EditableText } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Inline and block"
        description="Editable Text should show its two basic forms directly."
      >
        <DemoStack>
          <EditableText aria-label="Title" defaultValue="Editable title" />
          <EditableText aria-label="Body" multiline defaultValue="Editable multiline body copy." />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
