import * as stylex from '@stylexjs/stylex'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card'
import { DemoFrame } from '../example-theme/demo'
import { colors } from '../tokens/color.stylex'
import { typography } from '../tokens/typography.stylex'
import { Carousel, CarouselItem } from './index'

const slides = [
  ['Native controls', 'Scroll snapping supplies the core interaction.'],
  ['Progressive markers', 'Supporting browsers add scroll markers and buttons.'],
  ['Reduced motion', 'Smooth scrolling yields to the user motion preference.'],
  ['Anchor positioning', 'Layered controls stay attached without measurement code.'],
  ['Popover API', 'Light dismiss and top-layer rendering come from the platform.'],
  ['Dialog commands', 'Explicit invoker targets keep modal triggers declarative.'],
  ['Focus groups', 'Arrow-key navigation progressively enhances grouped controls.'],
  ['View transitions', 'Optional transitions add continuity without owning navigation.'],
  ['Container queries', 'Components respond to available space instead of the viewport.'],
  ['StyleX themes', 'Independent variable sets compose directly on any ancestor.'],
]

export default function Example() {
  return (
    <DemoFrame
      title="Browser API highlights"
      description="Scroll horizontally with a trackpad, touch gesture, keyboard, or enhanced controls."
    >
      <Carousel aria-label="Browser API highlights">
        {slides.map(([title, description], index) => (
          <CarouselItem key={title} sx={styles.slide}>
            <Card sx={styles.card}>
              <CardHeader>
                <span {...stylex.props(styles.number)}>{String(index + 1).padStart(2, '0')}</span>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span {...stylex.props(styles.meta)}>Scroll snap card</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </DemoFrame>
  )
}

const styles = stylex.create({
  slide: {
    borderWidth: 0,
  },
  card: {
    height: '100%',
    minHeight: '12rem',
  },
  number: {
    color: colors.fgMuted,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus1,
  },
  meta: {
    color: colors.fgMuted,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    textTransform: 'uppercase',
  },
})
;('use client')
