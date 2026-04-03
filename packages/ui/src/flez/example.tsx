"use client";

import { Flez } from "./index";
import { DemoFrame, DemoPanel, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame title="Legacy flex alias" description="Flez is a compatibility layout primitive.">
        <DemoStack>
          <Flez><DemoPanel>One</DemoPanel><DemoPanel>Two</DemoPanel></Flez>
          <Flez direction="column"><DemoPanel>One</DemoPanel><DemoPanel>Two</DemoPanel></Flez>
        </DemoStack>
      </DemoFrame>
    </>
  );
}

