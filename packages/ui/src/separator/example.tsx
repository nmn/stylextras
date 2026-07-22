import { Separator } from "./index";
import { DemoFrame, DemoRow, DemoStack } from "../example-theme/demo";

export function HorizontalSeparatorDemo() {
  return (
    <DemoFrame
      title="Horizontal"
      description="Use a horizontal separator to divide stacked content."
      showThemes={false}
    >
      <DemoStack>
        <span>Above</span>
        <Separator />
        <span>Below</span>
      </DemoStack>
    </DemoFrame>
  );
}

export function VerticalSeparatorDemo() {
  return (
    <DemoFrame
      title="Vertical"
      description="Use the vertical orientation inside inline control groups."
      showThemes={false}
    >
      <DemoRow>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </DemoRow>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <HorizontalSeparatorDemo />
      <VerticalSeparatorDemo />
    </DemoStack>
  );
}
