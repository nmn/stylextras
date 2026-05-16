"use client";

import { DemoFrame, DemoStack } from "../example-theme/demo";
import {
  TooltipContent,
  type TooltipContentProps,
  TooltipTrigger,
} from "./index";

function TooltipExampleContent(props: TooltipContentProps) {
  return (
    <TooltipContent {...props}>
      Creates a static JSON snapshot of the current theme.
    </TooltipContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Tooltip surface"
      description="Hover or focus the trigger to show the tooltip."
    >
      <DemoStack>
        <TooltipTrigger content={() => Promise.resolve(TooltipExampleContent)}>
          Export token snapshot
        </TooltipTrigger>
      </DemoStack>
    </DemoFrame>
  );
}
