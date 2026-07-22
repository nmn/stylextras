import { Label } from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";
import { Input } from "../input";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Labels"
        description="Label should be shown as direct field labels."
      >
        <DemoStack>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" />
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" />
        </DemoStack>
      </DemoFrame>
    </>
  );
}
