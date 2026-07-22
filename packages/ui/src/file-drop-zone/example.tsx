import { FileDropZone } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Drop zones"
        description="File Drop Zone should stay simple and direct in the example."
      >
        <DemoStack>
          <FileDropZone accept="image/*" label="Drop images here or choose files" />
          <FileDropZone accept="application/json" label="Drop JSON files here or choose files" />
        </DemoStack>
      </DemoFrame>
    </>
  )
}
