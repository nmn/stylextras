"use client";

import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Command } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { SearchField } from "../search-field";
import { Typography } from "../typography";

export default function Example() {
  return (
    <>
      <DemoFrame title="Quick jump" description="Command is easiest to read as a direct command sheet.">
        <Command open>
          <DemoStack>
            <Typography as="h3" scale="title">Quick jump</Typography>
            <SearchField label="Search" placeholder="button, tokens, examples" />
            <ButtonGroup>
              <Button>Open button docs</Button>
              <Button variant="secondary">Jump to tokens</Button>
              <Button variant="outline">Open get started</Button>
            </ButtonGroup>
          </DemoStack>
        </Command>
      </DemoFrame>
    </>
  );
}

