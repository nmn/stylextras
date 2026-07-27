import * as stylex from '@stylexjs/stylex'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { ScrollArea } from './index'

const releases = Array.from({ length: 12 }, (_, index) => `0.2.0-beta.${12 - index}`)

export default function Example() {
  return (
    <DemoFrame
      title="Release history"
      description="The focused region uses native overflow with tokenized scrollbars."
    >
      <DemoStack>
        <ScrollArea aria-label="Stable release history" tabIndex={0} sx={styles.area}>
          <ReleaseRows />
        </ScrollArea>
        <ScrollArea
          aria-label="Overlay release history"
          scrollbar="overlay"
          tabIndex={0}
          sx={styles.area}
        >
          <ReleaseRows />
        </ScrollArea>
      </DemoStack>
    </DemoFrame>
  )
}

function ReleaseRows() {
  return releases.map((release) => (
    <div key={release} {...stylex.props(styles.row)}>
      <strong>{release}</strong>
      <span>Native-first component updates</span>
    </div>
  ))
}

const styles = stylex.create({
  area: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: 1,
    height: '12rem',
  },
  row: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'grid',
    gap: spacing.xxxs,
    padding: spacing.md,
  },
})
