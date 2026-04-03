"use client";

import { FieldErrors } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Field Errors" description="Render field-level guidance close to the input when validation fails.">
      <DemoSection title="Validation copy" description="Error messages should say what is wrong and how the user can correct it.">
        <DemoStack>
          <FieldErrors>Password must be at least 12 characters.</FieldErrors>
          <FieldErrors>Invite email already belongs to an existing member.</FieldErrors>
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

