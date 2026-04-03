"use client";

import { Link } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Link" description="Links should describe the destination, not the interaction itself.">
      <DemoSection title="Editorial links" description="Keep link text meaningful even when it is read out of surrounding context.">
        <DemoStack>
          <Link href="#tokens">View token documentation</Link>
          <Link href="#components">Browse component examples</Link>
          <Link href="#themes">Open theme presets</Link>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

