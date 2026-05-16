"use client";

import { Disclosure } from "../disclosure";
import { DemoFrame } from "../example-theme/demo";
import { DisclosureGroup } from "./index";

export function DisclosureGroupBasicDemo() {
  return (
    <DemoFrame
      title="Grouped disclosures"
      description="A regular disclosure group allows multiple sections to stay open."
      showThemes={false}
    >
      <DisclosureGroup>
        <Disclosure summary="What ships in the starter?">
          Tokens, components, and the docs site.
        </Disclosure>
        <Disclosure summary="How much is themeable?">
          Color, spacing, radius, and typography are themeable.
        </Disclosure>
        <Disclosure summary="Can I swap themes at runtime?">
          Yes. The examples use theme selectors to switch token sets live.
        </Disclosure>
      </DisclosureGroup>
    </DemoFrame>
  );
}

export function DisclosureGroupExclusiveDemo() {
  return (
    <DemoFrame
      description="An exclusive disclosure group behaves like an accordion. Opening one section closes the others."
      showThemes={false}
      title="Exclusive accordion"
    >
      <DisclosureGroup exclusive>
        <Disclosure summary="Design tokens">
          Keep the token layer small and derive the rest from core values.
        </Disclosure>
        <Disclosure summary="Native primitives">
          Prefer details, dialog, popover, and real form controls over custom
          state machines.
        </Disclosure>
        <Disclosure summary="Documentation">
          Examples should show the different forms a component can take, not
          mini apps.
        </Disclosure>
      </DisclosureGroup>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <>
      <DisclosureGroupBasicDemo />
      <DisclosureGroupExclusiveDemo />
    </>
  );
}
