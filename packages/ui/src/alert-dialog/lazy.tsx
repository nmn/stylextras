'use client'

import {
  LazyDialog,
  LazyDialogTrigger,
  type LazyDialogProps,
  type LazyDialogTriggerProps,
} from '../dialog/lazy'

export type LazyAlertDialogProps<Props extends object = Record<string, never>> = Omit<
  LazyDialogProps<Props>,
  'aria-describedby'
> & {
  'aria-describedby': string
}
export type LazyAlertDialogTriggerProps = LazyDialogTriggerProps

/** Alert dialogs require a programmatic description of the decision. */
export function LazyAlertDialog<Props extends object = Record<string, never>>(
  props: LazyAlertDialogProps<Props>,
) {
  return <LazyDialog<Props> {...(props as LazyDialogProps<Props>)} />
}

export { LazyDialogTrigger as LazyAlertDialogTrigger }
