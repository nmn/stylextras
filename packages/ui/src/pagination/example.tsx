"use client";

import { Pagination } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Page states" description="Pagination is easiest to read when two current-page states are shown directly.">
        <DemoStack>
          <Pagination currentPage={2} totalPages={5} />
          <Pagination currentPage={4} totalPages={8} />
        </DemoStack>
      </DemoFrame>
    </>
  );
}

