import { Button } from '../button'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from './index'

export default function Example() {
  return (
    <DemoFrame title="Project rows" description="Media, content, and actions remain independently styled parts.">
      <DemoStack>
        <Item as="article">
          <ItemMedia aria-hidden="true">◫</ItemMedia>
          <ItemContent>
            <ItemTitle>Documentation</ItemTitle>
            <ItemDescription>Updated two minutes ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button aria-label="Open Documentation" size="sm" variant="outline">Open</Button>
          </ItemActions>
        </Item>
        <Item as="article">
          <ItemMedia aria-hidden="true">◇</ItemMedia>
          <ItemContent>
            <ItemTitle>Component gallery</ItemTitle>
            <ItemDescription>Seven themes · light and dark</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button aria-label="Open Component gallery" size="sm" variant="outline">Open</Button>
          </ItemActions>
        </Item>
      </DemoStack>
    </DemoFrame>
  )
}
