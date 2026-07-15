import { ButtonGroup } from '../button-group'
import { DemoFrame } from '../example-theme/demo'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './index'

const dialogId = 'delete-draft-dialog'

export default function Example() {
  return (
    <DemoFrame title="Confirmation" description="Native modal semantics and explicit invokers.">
      <AlertDialogTrigger target={dialogId}>Delete draft</AlertDialogTrigger>
      <AlertDialog id={dialogId} aria-labelledby={`${dialogId}-title`}>
        <AlertDialogHeader>
          <AlertDialogTitle id={`${dialogId}-title`}>Delete draft?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ButtonGroup variant="actions" aria-label="Delete draft actions">
            <AlertDialogCancel target={dialogId}>Cancel</AlertDialogCancel>
            <AlertDialogAction target={dialogId}>Delete</AlertDialogAction>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialog>
    </DemoFrame>
  )
}
;('use client')
