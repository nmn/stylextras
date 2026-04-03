"use client";

import { Disclosure } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Disclosure states" description="Disclosure should show a couple of concise expandable items.">
        <DemoStack>
          <Disclosure summary="Why use popover here?">It keeps the surfaced content local to the trigger.</Disclosure>
          <Disclosure open summary="When should this become a dialog?">Use a dialog once the content becomes task-focused or needs stronger interruption.</Disclosure>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

