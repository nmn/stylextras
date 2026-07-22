import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@stylextras/ui/dialog'
import type { LazyDialogContentProps } from '@stylextras/ui/dialog/lazy'

type LazyDialogFixtureProps = LazyDialogContentProps & {
  titleId: string
}

export default function LazyDialogFixture({ titleId, ...props }: LazyDialogFixtureProps) {
  return (
    <Dialog {...props}>
      <DialogHeader>
        <DialogTitle id={titleId}>Deferred settings</DialogTitle>
      </DialogHeader>
      <DialogBody>Loaded only after interaction intent.</DialogBody>
      <DialogFooter>
        <DialogClose target={props.id} autoFocus>
          Close deferred settings
        </DialogClose>
      </DialogFooter>
    </Dialog>
  )
}
