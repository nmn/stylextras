import { Badge } from '../badge'
import { TagItem, TagList } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Tag group"
        description="Tag Group is best shown as a compact cluster of metadata tags."
      >
        <TagList aria-label="Component metadata">
          <TagItem>
            <Badge>Design system</Badge>
          </TagItem>
          <TagItem>
            <Badge>Experimental</Badge>
          </TagItem>
          <TagItem>
            <Badge>Native popup</Badge>
          </TagItem>
        </TagList>
      </DemoFrame>
    </>
  )
}
