import { DemoFrame, DemoRow } from '../example-theme/demo'
import { Avatar, AvatarFallback, AvatarImage } from './index'

export default function Example() {
  return (
    <DemoFrame title="Avatars" description="Image and fallback are styled parts of the same native surface.">
      <DemoRow>
        <Avatar size="sm" aria-label="Avery Kim"><AvatarFallback>AK</AvatarFallback></Avatar>
        <Avatar aria-label="Taylor Reed"><AvatarFallback>TR</AvatarFallback></Avatar>
        <Avatar size="lg" aria-label="Shadcn profile">
          <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn profile" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </DemoRow>
    </DemoFrame>
  )
}
