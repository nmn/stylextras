import { InputGroup } from "./index";
import { DemoFrame } from "../example-theme/demo";
import { Button } from "../button";
import { Field, FieldDescription, FieldLabel } from "../field";
import { Input } from "../input";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Grouped input"
        description="Input Group is another case where minimal composition is the point of the component."
      >
        <Field>
          <FieldLabel htmlFor="invite-email">Invite email</FieldLabel>
          <InputGroup>
            <Input
              id="invite-email"
              aria-describedby="invite-email-description"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="teammate@example.com"
            />
            <Button>Invite</Button>
          </InputGroup>
          <FieldDescription id="invite-email-description">The label and validation remain attached to the native input.</FieldDescription>
        </Field>
      </DemoFrame>
    </>
  );
}
