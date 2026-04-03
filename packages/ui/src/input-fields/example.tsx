"use client";

import { InputFields } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Basic inputs" description="Input Fields is a plain styled input wrapper.">
        <DemoStack>
          <InputFields placeholder="Search tokens" />
          <InputFields type="email" placeholder="team@example.com" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}

