import { Badge } from '../badge'
import { TagList } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Tag group"
        description="Tag Group is best shown as a compact cluster of metadata tags."
      >
        <TagList aria-label="Component metadata">
          <Badge>Design system</Badge>
          <Badge>Experimental</Badge>
          <Badge>Native popup</Badge>
        </TagList>
      </DemoFrame>
    </>
  )
}
