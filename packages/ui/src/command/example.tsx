"use client";

import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { SearchField } from "../search-field";
import { Typography } from "../typography";
import {
  CommandContent,
  type CommandContentProps,
  CommandTrigger,
} from "./index";

function CommandExampleContent(props: CommandContentProps) {
  return (
    <CommandContent {...props}>
      <DemoStack>
        <Typography as="h3" scale="title">
          Quick jump
        </Typography>
        <SearchField label="Search" placeholder="button, tokens, examples" />
        <form method="dialog">
          <ButtonGroup>
            <Button type="button">Open button docs</Button>
            <Button type="button" variant="secondary">
              Jump to tokens
            </Button>
            <Button type="submit" variant="outline">
              Close
            </Button>
          </ButtonGroup>
        </form>
      </DemoStack>
    </CommandContent>
  );
}

export default function Example() {
  return (
    <DemoFrame
      title="Quick jump"
      description="Click the trigger to open the command surface."
    >
      <CommandTrigger content={() => Promise.resolve(CommandExampleContent)}>
        Open command menu
      </CommandTrigger>
    </DemoFrame>
  );
}
