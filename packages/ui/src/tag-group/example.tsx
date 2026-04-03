"use client";

import { TagGroup } from "./index";
import { Badge } from "../badge";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Tag Group" description="Tag groups are useful for applied filters, categories, and lightweight metadata.">
      <DemoSection title="Applied filters" description="Keep tags scannable and make removal or editing affordances obvious when the tags are interactive.">
        <TagGroup>
          <Badge>Design system</Badge>
          <Badge>Experimental</Badge>
          <Badge>Native overlay</Badge>
        </TagGroup>
      </DemoSection>
    </DemoFrame>
  );
}

