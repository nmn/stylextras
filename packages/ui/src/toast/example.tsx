'use client'

import * as stylex from '@stylexjs/stylex'
import { Button } from '../button'
import { Toast, Toaster, ToastDescription, ToastTitle, toast } from './index'
import { DemoFrame, DemoStack } from '../example-theme/demo'

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Notifications"
        description="Toast parts can be composed directly, while the queue announces transient app events."
      >
        <DemoStack>
          <ol aria-label="Toast variants" {...stylex.props(styles.list)}>
            <Toast>
              <div>
                <ToastTitle>Draft restored</ToastTitle>
                <ToastDescription>Your local changes are available again.</ToastDescription>
              </div>
            </Toast>
            <Toast variant="success">
              <div>
                <ToastTitle>Theme saved</ToastTitle>
                <ToastDescription>The Zinc preset is now active.</ToastDescription>
              </div>
            </Toast>
            <Toast variant="danger">
              <div>
                <ToastTitle>Publish failed</ToastTitle>
                <ToastDescription>Check the connection and try again.</ToastDescription>
              </div>
            </Toast>
          </ol>
          <Button
            onClick={() =>
              toast({
                title: 'Export complete',
                description: 'stylextras-ui-0.2.0-beta.tgz is ready.',
                duration: 8_000,
                variant: 'success',
              })
            }
          >
            Queue a toast
          </Button>
        </DemoStack>
        <Toaster />
      </DemoFrame>
    </>
  )
}

const styles = stylex.create({
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
})
