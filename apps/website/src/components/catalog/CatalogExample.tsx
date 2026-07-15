import { catalogExamples } from '../../generated/catalog-examples'

export function CatalogExample({ exportPath }: { exportPath: string }) {
  const Example = catalogExamples[exportPath as keyof typeof catalogExamples]
  if (!Example) throw new Error(`Missing eager documentation example for ${exportPath}`)
  return <Example />
}
