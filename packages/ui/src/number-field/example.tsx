"use client";

import { NumberField } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Numeric inputs"
        description="Number Field should show simple quantity and length entry."
      >
        <DemoStack>
          <NumberField label="Columns" defaultValue={12} min={1} max={24} />
          <NumberField label="Gutter" defaultValue={24} min={0} max={64} />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
