import { Button } from './index';
import { DemoFrame, DemoRow, DemoStack } from '../example-theme/demo';

export function ButtonVariantsDemo() {
  return (
    <DemoFrame
      title="Variants"
      description="Button should show the available variants directly, without surrounding workflow noise."
      showThemes={true}
    >
      <DemoRow>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="danger">Danger</Button>
      </DemoRow>
    </DemoFrame>
  );
}

export function ButtonSizesDemo() {
  return (
    <DemoFrame
      title="States and sizes"
      description="A second frame shows common states at a glance."
      showThemes={true}
    >
      <DemoRow>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add item">
          +
        </Button>
        <Button disabled>Disabled</Button>
      </DemoRow>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <ButtonVariantsDemo />
      <ButtonSizesDemo />
    </DemoStack>
  );
}
