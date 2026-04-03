"use client";

import { Table } from "./index";
import { DemoFrame, DemoSection } from "../example-theme/demo";

export default function Example() {
  return (
    <DemoFrame title="Table" description="Tables work best when users need to compare values across rows and columns.">
      <DemoSection title="Token inventory" description="Keep tables dense, but preserve strong headers and predictable scanning order.">
        <Table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Usage</th></tr>
          </thead>
          <tbody>
            <tr><td>color.brand</td><td>color</td><td>Buttons, accents</td></tr>
            <tr><td>spacing.base</td><td>length</td><td>Layout scale</td></tr>
            <tr><td>radius.base</td><td>length</td><td>Surface shape</td></tr>
          </tbody>
        </Table>
      </DemoSection>
    </DemoFrame>
  );
}

