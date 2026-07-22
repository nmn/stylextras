import { Typography } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export function TypographyScalesDemo() {
  return (
    <DemoFrame
      title="Scales"
      description="Typography should show all major scales at a glance."
      showThemes={false}
    >
      <DemoStack>
        <Typography scale="display" as="h1">
          Display
        </Typography>
        <Typography scale="title" as="h2">
          Title
        </Typography>
        <Typography scale="body" as="p">
          Body copy
        </Typography>
        <Typography scale="label" as="span">
          Label
        </Typography>
      </DemoStack>
    </DemoFrame>
  );
}

export function TypographySemanticsDemo() {
  return (
    <DemoFrame
      title="Semantic headings and tones"
      description="A second frame shows heading levels and text tones."
      showThemes={false}
    >
      <DemoStack>
        <Typography as="h1" scale="display">
          Heading 1
        </Typography>
        <Typography as="h2" scale="title">
          Heading 2
        </Typography>
        <Typography as="h3" scale="title">
          Heading 3
        </Typography>
        <Typography as="p" tone="default">
          Default paragraph
        </Typography>
        <Typography as="p" tone="muted">
          Muted paragraph
        </Typography>
        <Typography as="p" tone="brand">
          Brand paragraph
        </Typography>
      </DemoStack>
    </DemoFrame>
  );
}

export default function Example() {
  return (
    <DemoStack>
      <TypographyScalesDemo />
      <TypographySemanticsDemo />
    </DemoStack>
  );
}
