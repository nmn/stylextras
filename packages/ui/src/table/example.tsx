'use client'

import { Table } from './index'
import { DemoFrame } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Simple table"
        description="Table should show the component plainly as tabular structure."
      >
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>color.brand</td>
              <td>color</td>
              <td>Buttons, accents</td>
            </tr>
            <tr>
              <td>spacing.base</td>
              <td>length</td>
              <td>Layout scale</td>
            </tr>
            <tr>
              <td>radius.base</td>
              <td>length</td>
              <td>Surface shape</td>
            </tr>
          </tbody>
        </Table>
      </DemoFrame>
    </>
  )
}
