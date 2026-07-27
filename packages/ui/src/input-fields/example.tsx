"use client";

import { InputFields } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Basic inputs"
        description="Input Fields is a plain styled input wrapper."
      >
        <DemoStack>
          <label htmlFor="input-fields-search">Search tokens</label>
          <InputFields id="input-fields-search" placeholder="Color, spacing, typography" />
          <label htmlFor="input-fields-email">Team email</label>
          <InputFields id="input-fields-email" type="email" placeholder="team@example.com" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
