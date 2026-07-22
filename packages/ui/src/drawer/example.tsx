import { ButtonGroup } from '../button-group'
import { DialogCommandBridge } from '../dialog/client'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  type DrawerSide,
} from './index'

function PageSettingsDrawer({ id, side }: { id: string; side: DrawerSide }) {
  return (
    <Drawer id={id} side={side} aria-labelledby={`${id}-title`}>
      <DrawerHeader>
        <strong id={`${id}-title`}>Page settings</strong>
      </DrawerHeader>
      <DrawerBody>Nearby controls stay in the current page.</DrawerBody>
      <DrawerFooter>
        <ButtonGroup variant="actions" aria-label="Page settings actions">
          <DrawerClose target={id}>Cancel</DrawerClose>
          <DrawerClose target={id} variant="primary">
            Done
          </DrawerClose>
        </ButtonGroup>
      </DrawerFooter>
    </Drawer>
  )
}

export default function Example() {
  return (
    <DemoStack>
      <DemoFrame title="Bottom drawer" description="A compact task surface near the trigger edge.">
        <DrawerTrigger target="bottom-page-drawer">Open bottom drawer</DrawerTrigger>
        <DialogCommandBridge target="bottom-page-drawer" />
        <PageSettingsDrawer id="bottom-page-drawer" side="bottom" />
      </DemoFrame>
      <DemoFrame
        title="Top drawer"
        description="Top placement works for global controls and filters."
      >
        <DrawerTrigger target="top-page-drawer">Open top drawer</DrawerTrigger>
        <DialogCommandBridge target="top-page-drawer" />
        <PageSettingsDrawer id="top-page-drawer" side="top" />
      </DemoFrame>
    </DemoStack>
  )
}
