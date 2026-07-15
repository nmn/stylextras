import { Button } from '../button'
import { DemoFrame, DemoGrid, DemoPanel, DemoStack } from '../example-theme/demo'
import { Field, FieldLabel } from '../field'
import { Input } from '../input'
import { Direction } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Bidirectional boundaries"
      description="Each subtree uses its own native dir attribute without changing the surrounding page."
    >
      <DemoGrid>
        <DemoPanel>
          <Direction dir="ltr" lang="en">
            <DemoStack>
              <Field>
                <FieldLabel htmlFor="direction-project">Project name</FieldLabel>
                <Input id="direction-project" defaultValue="Native interface" />
              </Field>
              <Button>Save changes</Button>
            </DemoStack>
          </Direction>
        </DemoPanel>
        <DemoPanel>
          <Direction dir="rtl" lang="ar">
            <DemoStack>
              <Field>
                <FieldLabel htmlFor="direction-project-ar">اسم المشروع</FieldLabel>
                <Input id="direction-project-ar" defaultValue="واجهة أصلية" />
              </Field>
              <Button>حفظ التغييرات</Button>
            </DemoStack>
          </Direction>
        </DemoPanel>
      </DemoGrid>
    </DemoFrame>
  )
}
'use client'
