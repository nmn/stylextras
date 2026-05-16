import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef } from 'react'
import { Table } from '../table'

type BaseProps = ComponentPropsWithoutRef<typeof Table>

export type DataTableProps = Omit<BaseProps, 'className' | 'style'> & { sx?: StyleXStyles }

/**
 * Renders a simplified data-table wrapper.
 *
 * Search aliases: data table, table, grid table, tabular data.
 *
 * A11y notes:
 * - Provides basic table semantics only.
 * - Sorting, selection, grid navigation, and virtualization semantics are not implemented.
 */
export function DataTable({ sx, ...props }: DataTableProps) {
  return <Table {...props} sx={sx} />
}
