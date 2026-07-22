import { Button } from '../button'
import { DemoFrame, DemoGrid, DemoStack } from '../example-theme/demo'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './index'

export function CardCompositionDemo() {
  return (
    <DemoFrame
      title="Card composition"
      description="Individually styled card parts keep spacing predictable without an unstyled primitive layer."
      showThemes={false}
    >
      <DemoGrid>
        <Card as="article" aria-label="Native popups">
          <CardHeader>
            <CardTitle>Native popups</CardTitle>
            <CardDescription>Popover behavior with much less JavaScript.</CardDescription>
            <CardAction>
              <Button size="icon-sm" variant="ghost" aria-label="Options for Native popups">
                ···
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>Use explicit trigger and target relationships.</CardContent>
          <CardFooter>
            <Button size="sm">Read more</Button>
            <Button size="sm" variant="outline">
              Dismiss
            </Button>
          </CardFooter>
        </Card>
        <Card as="article">
          <CardHeader>
            <CardTitle>Token-driven surface</CardTitle>
            <CardDescription>
              Every nested layer gets lighter in dark mode and keeps the active tint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card as="article">
              <CardHeader>
                <CardTitle as="h4">Nested layer</CardTitle>
                <CardDescription>
                  Raised surfaces compound naturally without contextual JavaScript.
                </CardDescription>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </DemoGrid>
    </DemoFrame>
  )
}

export default function Example() {
  return (
    <DemoStack>
      <CardCompositionDemo />
    </DemoStack>
  )
}
