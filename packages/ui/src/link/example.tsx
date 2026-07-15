"use client";

import { Link } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Link forms"
        description="Link should show common text-link usage directly."
      >
        <DemoStack>
          <Link href="#docs">View docs</Link>
          <Link href="#components">Browse components</Link>
          <Link href="#themes">Open themes</Link>
        </DemoStack>
      </DemoFrame>
    </>
  );
}
