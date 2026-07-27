/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DocsMigrationCodeFixture } from '@/components/catalog/DocsMigrationCodeFixture'
import { DocsMigrationCopyErrorFixture } from '@/components/catalog/DocsMigrationCopyErrorFixture'
import { Callout } from '@/components/mdx/Callout'
import { Card, Cards } from '@/components/mdx/Cards'
import Heading from '@/components/mdx/Heading'
import { ScrollableCodeBlock } from '@/components/mdx/ScrollableCodeBlock'
import Table from '@/components/mdx/Table'
import * as stylex from '@stylexjs/stylex'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@stylextras/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@stylextras/ui/collapsible'
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@stylextras/ui/table'

export default function DocsMigrationTestPage() {
  return (
    <>
      <title>Documentation migration verification | StyleXtras</title>
      <main
        aria-labelledby="docs-migration-title"
        data-testid="docs-migration-fixture"
        {...stylex.props(styles.main)}
      >
        <h1 id="docs-migration-title" {...stylex.props(styles.title)}>
          Documentation migration verification
        </h1>

        <section aria-labelledby="mdx-surfaces-title" {...stylex.props(styles.section)}>
          <h2 id="mdx-surfaces-title" {...stylex.props(styles.heading)}>
            MDX surfaces
          </h2>
          <Callout title="Native alert composition" type="success">
            The documentation callout composes the package alert parts.
          </Callout>
          <Cards>
            <Card
              data-testid="linked-mdx-card"
              description="The linked card composes the package card surface."
              href="/docs/get-started"
              title="Read the setup guide"
            />
          </Cards>
        </section>

        <section aria-labelledby="mdx-tabs-title" {...stylex.props(styles.section)}>
          <h2 id="mdx-tabs-title" {...stylex.props(styles.heading)}>
            MDX tabs and code
          </h2>
          <DocsMigrationCodeFixture />
          <DocsMigrationCopyErrorFixture />
        </section>

        <section aria-labelledby="mdx-disclosures-title" {...stylex.props(styles.section)}>
          <h2 id="mdx-disclosures-title" {...stylex.props(styles.heading)}>
            MDX disclosures
          </h2>

          <Collapsible data-testid="standalone-disclosure">
            <CollapsibleTrigger>Standalone details</CollapsibleTrigger>
            <CollapsibleContent>
              <p>Standalone disclosure content.</p>
            </CollapsibleContent>
          </Collapsible>

          <Accordion>
            <AccordionItem data-testid="single-disclosure-one" name="docs-migration-single" open>
              <AccordionTrigger>Single disclosure one</AccordionTrigger>
              <AccordionContent>
                <p>First exclusive disclosure content.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem data-testid="single-disclosure-two" name="docs-migration-single">
              <AccordionTrigger>Single disclosure two</AccordionTrigger>
              <AccordionContent>
                <p>Second exclusive disclosure content.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion>
            <AccordionItem data-testid="multiple-disclosure-one">
              <AccordionTrigger>Multiple disclosure one</AccordionTrigger>
              <AccordionContent>
                <p>First independent disclosure content.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem data-testid="multiple-disclosure-two">
              <AccordionTrigger>Multiple disclosure two</AccordionTrigger>
              <AccordionContent>
                <p>Second independent disclosure content.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section aria-labelledby="mdx-adapters-title" {...stylex.props(styles.section)}>
          <Heading as="h2" id="mdx-adapters-title">
            MDX table, permalink, and scrolling code
          </Heading>
          <Table data-testid="mdx-table">
            <TableCaption>Package primitives inside the documentation table adapter.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Surface</TableHead>
                <TableHead>Implementation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Table</TableCell>
                <TableCell>@stylextras/ui/table</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ScrollableCodeBlock
            content="const documentationMigration = compose(packagePrimitives, websiteAdapters)"
            title="Scrollable adapter example"
          />
        </section>
      </main>
    </>
  )
}

const styles = stylex.create({
  main: {
    display: 'grid',
    gap: 32,
    width: 'min(100% - 32px, 760px)',
    paddingBlock: 32,
    marginInline: 'auto',
  },
  section: {
    display: 'grid',
    gap: 12,
    minWidth: 0,
  },
  title: {
    margin: 0,
  },
  heading: {
    margin: 0,
  },
})

export const getConfig = async () => ({ render: 'static' as const })
