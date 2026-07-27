import { DemoFrame } from '../example-theme/demo'
import {
  TableOfContents,
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Outline"
      description="Table Of Contents shows a compact compound page outline."
    >
      <TableOfContents aria-labelledby="toc-example-title">
        <TableOfContentsTitle as="h3" id="toc-example-title">
          On this page
        </TableOfContentsTitle>
        <TableOfContentsList>
          <TableOfContentsItem>
            <TableOfContentsLink href="#overview" active>
              Overview
            </TableOfContentsLink>
          </TableOfContentsItem>
          <TableOfContentsItem>
            <TableOfContentsLink href="#usage">Usage</TableOfContentsLink>
            <TableOfContentsList>
              <TableOfContentsItem>
                <TableOfContentsLink href="#examples">Examples</TableOfContentsLink>
              </TableOfContentsItem>
            </TableOfContentsList>
          </TableOfContentsItem>
          <TableOfContentsItem>
            <TableOfContentsLink href="#accessibility">Accessibility</TableOfContentsLink>
          </TableOfContentsItem>
        </TableOfContentsList>
      </TableOfContents>
    </DemoFrame>
  )
}
