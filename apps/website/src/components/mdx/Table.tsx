/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as stylex from '@stylexjs/stylex'
import { Table as UITable, TableScrollArea } from '@stylextras/ui/table'
import type { ComponentProps } from 'react'

export type TableProps = Omit<ComponentProps<typeof UITable>, 'className' | 'style' | 'sx'>

export default function Table(props: TableProps) {
  return (
    <TableScrollArea aria-label="Scrollable table" sx={styles.wrapper}>
      <UITable {...props} sx={styles.table} />
    </TableScrollArea>
  )
}

const styles = stylex.create({
  table: {
    fontSize: 14,
  },
  wrapper: {
    position: 'relative',
    marginBlock: 24,
  },
})
