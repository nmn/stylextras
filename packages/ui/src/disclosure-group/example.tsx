"use client";

import { Disclosure } from "../disclosure";
import { DisclosureGroup } from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Grouped disclosures" description="Disclosure Group is best shown as a short FAQ-like set.">
        <DisclosureGroup>
          <Disclosure summary="What ships in the starter?">Tokens, components, and the docs site.</Disclosure>
          <Disclosure summary="How much is themeable?">Color, spacing, radius, and typography are themeable.</Disclosure>
        </DisclosureGroup>
      </DemoFrame>
    </>
  );
}

