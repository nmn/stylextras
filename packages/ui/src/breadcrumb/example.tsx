"use client";

import { Breadcrumb } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Paths"
        description="Breadcrumb is most useful when you can compare short and deeper paths."
      >
        <DemoStack>
          <Breadcrumb
            items={[{ label: "Docs", href: "#docs" }, { label: "Buttons" }]}
          />
          <Breadcrumb
            items={[
              { label: "Docs", href: "#docs" },
              { label: "Components", href: "#components" },
              { label: "Navigation", href: "#navigation" },
              { label: "Tabs" },
            ]}
          />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
