"use client";

import { Disclosure } from "../disclosure";
import { DisclosureGroup } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Disclosure Group" description="Use grouped disclosures for short FAQs, changelog notes, and setup checklists.">
      <DemoSection title="Frequently asked questions" description="Keep the summary text specific so the user knows what is hidden inside each section.">
        <DisclosureGroup>
          <Disclosure summary="What ships in the starter?">Base tokens, native-first components, and the docs website.</Disclosure>
          <Disclosure summary="How much is themeable?">Colors, spacing, radius, and typography can all be changed through StyleX themes.</Disclosure>
        </DisclosureGroup>
      </DemoSection>
    </DemoFrame>
  );
}

