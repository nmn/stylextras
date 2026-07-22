import { ColorPicker } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Color Picker"
        description="Color Picker is shown here as a small set of direct color choices."
      >
        <DemoRow>
          <ColorPicker aria-label="Brand" defaultValue="#0f766e" />
          <ColorPicker aria-label="Info" defaultValue="#2563eb" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}
