"use client";

import { DemoFrame, DemoStack } from "../example-theme/demo";
import {
  PopoverContent,
  type PopoverContentProps,
  PopoverTrigger,
} from "./index";

function PopoverExampleContent(props: PopoverContentProps) {
  return (
    <PopoverContent {...props}>
      <DemoStack>
        <strong>Quick details</strong>
        <span>Short supporting content belongs here.</span>
      </DemoStack>
    </PopoverContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Popover surface"
      description="Click the trigger to toggle the popover."
    >
      <PopoverTrigger content={() => Promise.resolve(PopoverExampleContent)}>
        Open popover
      </PopoverTrigger>
    </DemoFrame>
  );
}
