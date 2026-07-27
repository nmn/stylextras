"use client";

import { Sidebar } from "../sidebar";
import { SidebarLayout, SidebarNavigation } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Link } from "../link";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Sidebar layout"
        description="Sidebar Layout is another case where a tiny bit of composition is intrinsic."
      >
        <SidebarLayout
          sidebar={
            <Sidebar aria-label="Documentation">
              <SidebarNavigation aria-label="Documentation sections">
                <Link href="#intro">Introduction</Link>
                <Link href="#api">API</Link>
                <Link href="#examples">Examples</Link>
              </SidebarNavigation>
            </Sidebar>
          }
        >
          <DemoStack>
            <strong>Button</strong>
            <span>
              The button primitive is intentionally small and native-first.
            </span>
          </DemoStack>
        </SidebarLayout>
      </DemoFrame>
    </>
  );
}
