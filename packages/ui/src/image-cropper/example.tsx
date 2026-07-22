import { DemoFrame, DemoGrid } from '../example-theme/demo'
import { ImageCropPreview } from './index'

const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%232563eb'/%3E%3Cstop offset='1' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g)'/%3E%3Ccircle cx='250' cy='240' r='120' fill='rgba(255,255,255,0.28)'/%3E%3Ccircle cx='520' cy='320' r='160' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E"

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Ratios"
        description="Image Cropper should show ratio and position changes directly."
      >
        <DemoGrid>
          <ImageCropPreview
            src={image}
            alt="Blue-to-pink gradient with translucent circles"
            ratio="square"
            position="center"
          />
          <ImageCropPreview
            src={image}
            alt="Blue-to-pink gradient with translucent circles"
            ratio="landscape"
            position="top"
          />
          <ImageCropPreview
            src={image}
            alt="Blue-to-pink gradient with translucent circles"
            ratio="portrait"
            position="end"
          />
        </DemoGrid>
      </DemoFrame>
    </>
  )
}
