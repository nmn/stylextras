"use client";

import { Pagination } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Pagination" description="Use pagination when users are navigating a long list with stable page boundaries.">
      <DemoSection title="Archive pages" description="Pair the control with a clear total or context so the user knows what the current page represents.">
        <Pagination currentPage={3} totalPages={8} />
      </DemoSection>
    </DemoFrame>
  );
}

