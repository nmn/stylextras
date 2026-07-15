import { componentCatalog } from '../src/catalog.ts'

const componentEntries = Object.fromEntries(
  componentCatalog.map((entry) => [`./${entry.export}`, `${entry.export}/index`]),
)

const exampleEntries = Object.fromEntries(
  componentCatalog.map((entry) => [
    `./${entry.export}/example`,
    `${entry.export.replace('experimental/', '')}/example`,
  ]),
)

export const publicEntries = {
  ...componentEntries,
  ...exampleEntries,
  './catalog': 'catalog',
  './blur-themes': 'blur-themes/index',
  './dialog/client': 'dialog/client',
  './popover/client': 'popover/client',
  './tokens/blur': 'tokens/blur.stylex',
  './tokens/color': 'tokens/color.stylex',
  './tokens/elevation': 'tokens/elevation.stylex',
  './tokens/motion': 'tokens/motion.stylex',
  './tokens/radius': 'tokens/radius.stylex',
  './tokens/spacing': 'tokens/spacing.stylex',
  './tokens/stroke': 'tokens/stroke.stylex',
  './tokens/typography': 'tokens/typography.stylex',
  './tokens/blur.stylex': 'tokens/blur.stylex',
  './tokens/color.stylex': 'tokens/color.stylex',
  './tokens/elevation.stylex': 'tokens/elevation.stylex',
  './tokens/motion.stylex': 'tokens/motion.stylex',
  './tokens/radius.stylex': 'tokens/radius.stylex',
  './tokens/spacing.stylex': 'tokens/spacing.stylex',
  './tokens/stroke.stylex': 'tokens/stroke.stylex',
  './tokens/typography.stylex': 'tokens/typography.stylex',
  './color-themes': 'color-themes/index',
  './elevation-themes': 'elevation-themes/index',
  './motion-themes': 'motion-themes/index',
  './radius-themes': 'radius-themes/index',
  './spacing-themes': 'spacing-themes/index',
  './stroke-themes': 'stroke-themes/index',
  './typography-themes': 'typography-themes/index',
}
