import { ColorWheel } from "./index";
import { DemoFrame, DemoRow } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Color Wheel"
        description="Color Wheel is currently shown as a lightweight color input wrapper."
      >
        <DemoRow>
          <ColorWheel aria-label="Wheel color" defaultValue="#7c3aed" />
        </DemoRow>
      </DemoFrame>
    </>
  );
}
