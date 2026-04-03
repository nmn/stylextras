"use client";

import { EditableText } from "./index";
import { DemoFrame, DemoSection, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Editable Text" description="A contenteditable primitive for inline editing when a full input field would feel too heavy.">
      <DemoSection title="Inline and multiline" description="Use it sparingly. Contenteditable is powerful, but it has rough edges across assistive technology and browser engines.">
        <DemoStack>
          <EditableText defaultValue="Project Apollo" />
          <EditableText as="div" multiline defaultValue="Ship the first token-driven documentation refresh by Friday afternoon." />
        </DemoStack>
      </DemoSection>
    </DemoFrame>
  );
}

