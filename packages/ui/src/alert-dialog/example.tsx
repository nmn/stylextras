import { ButtonGroup } from '../button-group'
import { DialogCommandBridge } from '../dialog/client'
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
      <DialogCommandBridge target={dialogId} />
      <AlertDialog
        id={dialogId}
        aria-describedby={`${dialogId}-description`}
        aria-labelledby={`${dialogId}-title`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle id={`${dialogId}-title`}>Delete draft?</AlertDialogTitle>
          <AlertDialogDescription id={`${dialogId}-description`}>
            This action cannot be undone.
          </AlertDialogDescription>
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
