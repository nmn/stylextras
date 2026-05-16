'use client'

import { Navbar } from './index'
import { DemoFrame } from '../example-theme/demo'
import { Link } from '../link'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Navigation bar"
        description="Navbar should show a straightforward set of primary links."
      >
        <Navbar>
          <Link href="#docs">Docs</Link>
          <Link href="#components">Components</Link>
          <Link href="#themes">Themes</Link>
        </Navbar>
      </DemoFrame>
    </>
  )
}
