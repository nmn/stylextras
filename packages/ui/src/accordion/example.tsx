import { DemoFrame } from '../example-theme/demo'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Project questions"
      description="Items with the same native details name stay mutually exclusive."
    >
      <Accordion>
        <AccordionItem name="component-docs-accordion" open>
          <AccordionTrigger>Is JavaScript required?</AccordionTrigger>
          <AccordionContent>
            No. Opening, closing, keyboard activation, and exclusivity come from native details.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem name="component-docs-accordion">
          <AccordionTrigger indicatorPosition="start">Can I render rich content?</AccordionTrigger>
          <AccordionContent>
            Yes. The content part is an ordinary styled div inside the disclosure.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem name="component-docs-accordion">
          <AccordionTrigger>Does it work without enhancement?</AccordionTrigger>
          <AccordionContent>
            It falls back to the browser&apos;s complete details and summary behavior.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem>
          <AccordionTrigger indicator={false}>Independent disclosure</AccordionTrigger>
          <AccordionContent>
            Omitting name preserves independent native details behavior.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DemoFrame>
  )
}
