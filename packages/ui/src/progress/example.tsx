import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Label } from '../label'
import { Progress } from './index'

export default function Example() {
  return (
    <DemoFrame title="Build progress" description="The browser exposes the value through a native progress element.">
      <DemoStack>
        <Label htmlFor="tokens-progress">Token migration · 82%</Label>
        <Progress id="tokens-progress" value={82} />
        <Label htmlFor="components-progress">Component migration · 64%</Label>
        <Progress id="components-progress" value={64} />
        <Label htmlFor="indeterminate-progress">Publishing package</Label>
        <Progress id="indeterminate-progress" />
      </DemoStack>
    </DemoFrame>
  )
}
