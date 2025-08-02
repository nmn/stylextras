import * as t from '@babel/types'
import traverse from '@babel/traverse'
import type { NodePath } from '@babel/traverse'
import { generate } from '@babel/generator'

import type { StyleXIncludeOptions } from './types'
import { pushOrReplaceProperty } from './utils'

export class StyleXIncludeTransformer {
  constructor(
    private options: Required<Omit<StyleXIncludeOptions, 'allowedStyleImports'>>,
    private resolveImportedStyleObject: (
      importPath: string,
      exportName: string,
    ) => t.ObjectExpression | null = () => null,
  ) {}

  private isStyleXImport(
    declaration: t.ImportDeclaration,
    specifier: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier,
    expectedImportedName?: string,
  ) {
    const source = declaration.source.value

    const isAllowedSource = this.options.importSources.some((importSource) => {
      if (typeof importSource === 'string') {
        return source === importSource
      } else {
        return source === importSource.from
      }
    })

    if (!isAllowedSource) {
      return false
    }

    if (t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)) {
      return true
    }

    const importedName = t.isIdentifier(specifier.imported)
      ? specifier.imported.name
      : specifier.imported.value

    return expectedImportedName
      ? importedName === expectedImportedName
      : this.options.importSources.some(
          (importSource) =>
            typeof importSource !== 'string' &&
            source === importSource.from &&
            importedName === importSource.as,
        )
  }

  private isStyleXMethodCall(
    type: 'include' | 'create',
    node: t.Expression,
    scope: NodePath['scope'],
  ): node is t.CallExpression {
    if (!t.isCallExpression(node)) {
      return false
    }

    let imported: t.Identifier | undefined
    let expectedImportedName: string | undefined

    if (t.isMemberExpression(node.callee)) {
      const { object, property } = node.callee

      if (!t.isIdentifier(property, { name: type }) || !t.isIdentifier(object)) {
        return false
      }

      imported = object
    } else if (t.isIdentifier(node.callee)) {
      imported = node.callee
      expectedImportedName = type
    }

    if (!imported) {
      return false
    }

    const binding = scope.getBinding(imported.name)

    if (
      !binding ||
      !(
        binding.path.isImportSpecifier() ||
        binding.path.isImportDefaultSpecifier() ||
        binding.path.isImportNamespaceSpecifier()
      ) ||
      !binding.path.parentPath.isImportDeclaration()
    ) {
      return false
    }

    const importSpecifier = binding.path.node
    const importDeclaration = binding.path.parentPath.node
    return this.isStyleXImport(importDeclaration, importSpecifier, expectedImportedName)
  }

  private isStyleXInclude(node: t.Expression, scope: NodePath['scope']): node is t.CallExpression {
    return this.isStyleXMethodCall('include', node, scope)
  }

  private isStyleXCreate(node: t.Expression, scope: NodePath['scope']): node is t.CallExpression {
    return this.isStyleXMethodCall('create', node, scope)
  }

  private maybeProcessStyles(
    node: t.ObjectExpression,
    scope: NodePath['scope'],
  ): t.ObjectExpression | null {
    const hasStyleXInclude = node.properties.some((prop) => {
      if (!t.isSpreadElement(prop)) {
        return false
      }

      const spreadArg = prop.argument
      return this.isStyleXInclude(spreadArg, scope)
    })

    if (!hasStyleXInclude) {
      return null
    }

    if (this.options.onlyAtBeginning) {
      const lastSpreadElementIndex = node.properties.findLastIndex((prop) =>
        t.isSpreadElement(prop),
      )
      const firstNonSpreadElementIndex = node.properties.findIndex(
        (prop) => !t.isSpreadElement(prop),
      )

      if (
        firstNonSpreadElementIndex !== -1 &&
        firstNonSpreadElementIndex < lastSpreadElementIndex
      ) {
        throw new Error(
          'All `stylex.include` usages must be at the beginning of styles when `onlyAtBeginning` is set to `true`',
        )
      }
    }

    const processedProperties: t.ObjectExpression['properties'] = []

    for (const prop of node.properties) {
      if (!t.isSpreadElement(prop)) {
        processedProperties.push(prop)
        continue
      }

      const spreadArg = prop.argument
      if (this.isStyleXInclude(spreadArg, scope)) {
        if (spreadArg.arguments.length !== 1 || !t.isExpression(spreadArg.arguments[0])) {
          throw new Error('Unexpected argument for `stylex.include`')
        }

        const included = spreadArg.arguments[0]
        const includedStyles = this.resolveIncludedStyles(included, scope)
        if (!includedStyles) {
          throw new Error(`Could not resolve included styles from \`${generate(included).code}\``)
        } else {
          for (const includedProp of includedStyles.properties) {
            pushOrReplaceProperty(processedProperties, includedProp)
          }
        }
      }
    }

    return t.objectExpression(processedProperties)
  }

  private maybeProcessStyleObject(
    node: t.ObjectExpression,
    scope: NodePath['scope'],
  ): t.ObjectExpression | null {
    return t.objectExpression(
      node.properties.map((prop) => {
        if (t.isObjectProperty(prop) && t.isObjectExpression(prop.value)) {
          const processedValue = this.maybeProcessStyles(prop.value, scope)
          if (processedValue) {
            return t.objectProperty(prop.key, processedValue)
          }
        }
        return prop
      }),
    )
  }

  private maybeProcessStyleObjectDeclarator(
    path: NodePath<t.VariableDeclarator>,
    expectedExportName?: string,
  ): [object: t.ObjectExpression, exportName: string] | null {
    let result: [object: t.ObjectExpression, exportName: string] | null = null

    const id = path.get('id')
    const init = path.get('init')
    if (
      id.isIdentifier() &&
      (!expectedExportName || id.node.name === expectedExportName) &&
      init.isExpression() &&
      t.isCallExpression(init.node) &&
      this.isStyleXCreate(init.node, path.scope)
    ) {
      const arg = init.node.arguments[0]
      if (t.isObjectExpression(arg)) {
        const processedObject = this.maybeProcessStyleObject(arg, path.scope)
        if (processedObject) {
          result = [processedObject, id.node.name]
        }
      }
    }

    return result
  }

  private maybeProcessStyleObjectDeclaration(
    path: NodePath<t.VariableDeclaration>,
    expectedExportName?: string,
  ): [object: t.ObjectExpression, exportName: string] | null {
    const declarators = path.get('declarations')

    // Style objects must be declared with a single variable declaration
    if (declarators.length !== 1) {
      return null
    }

    return this.maybeProcessStyleObjectDeclarator(declarators[0]!, expectedExportName)
  }

  private resolveIncludedStyles(
    node: t.Expression,
    scope: NodePath['scope'],
  ): t.ObjectExpression | null {
    if (!t.isMemberExpression(node)) {
      return null
    }

    const { object, property } = node

    if (!t.isIdentifier(object) || !t.isIdentifier(property)) {
      return null
    }

    const binding = scope.getBinding(object.name)

    if (!binding) {
      return null
    }

    // Handle local style objects
    if (binding.path.isVariableDeclarator()) {
      return this.maybeProcessStyleObjectDeclarator(binding.path)?.[0] ?? null
    }

    // Handle imported style objects
    if (binding.path.isImportSpecifier() && binding.path.parentPath.isImportDeclaration()) {
      const importDeclaration = binding.path.parentPath.node
      const importPath = importDeclaration.source.value
      const importedStyleObject = this.resolveImportedStyleObject(importPath, object.name)
      if (importedStyleObject) {
        const matchingProp = importedStyleObject.properties.find(
          (prop): prop is t.ObjectProperty => {
            if (t.isObjectProperty(prop)) {
              return (
                t.isIdentifier(prop.key) &&
                prop.key.name === property.name &&
                t.isObjectExpression(prop.value)
              )
            }
            return false
          },
        )
        return t.isObjectExpression(matchingProp?.value) ? matchingProp.value : null
      }
    }

    return null
  }

  transformObjectExpression = (path: NodePath<t.ObjectExpression>) => {
    const processed = this.maybeProcessStyles(path.node, path.scope)
    if (processed) {
      path.replaceWith(processed)
    }
  }

  /**
   * Transforms a file by inlining and merging styles from `stylex.include` usages.
   */
  transformFile = (ast: t.File) => {
    traverse(ast, {
      ObjectExpression: this.transformObjectExpression,
    })
  }

  /**
   * Extracts exported style objects from a file. Does not transform the file.
   */
  extractExportedStyles = (ast: t.File) => {
    const exportedStyles: { [exportName: string]: t.ObjectExpression } = {}

    traverse(ast, {
      ExportNamedDeclaration: (path: NodePath<t.ExportNamedDeclaration>) => {
        const declaration = path.get('declaration')
        if (declaration.isVariableDeclaration()) {
          const result = this.maybeProcessStyleObjectDeclaration(declaration)
          if (result) {
            const [object, exportName] = result
            exportedStyles[exportName] = object
          }
        }
      },
    })

    return exportedStyles
  }
}
