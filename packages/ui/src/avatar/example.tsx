import { DemoFrame, DemoRow } from '../example-theme/demo'
import { Avatar, AvatarFallback, AvatarImage } from './index'

export default function Example() {
  return (
    <DemoFrame title="Avatars" description="Image and fallback are styled parts of the same native surface.">
      <DemoRow>
        <Avatar size="sm"><AvatarFallback>AK</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>TR</AvatarFallback></Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </DemoRow>
    </DemoFrame>
  )
}
'use client'
