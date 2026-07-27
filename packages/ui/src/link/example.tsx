import { DemoFrame, DemoStack } from '../example-theme/demo'
import { Link } from './index'

export default function Example() {
  return (
    <DemoFrame title="Link forms" description="Link shows common native text-link usage directly.">
      <DemoStack>
        <Link href="#docs">View docs</Link>
        <Link href="#components">Browse components</Link>
        <Link href="#themes">Open themes</Link>
      </DemoStack>
    </DemoFrame>
  )
}
