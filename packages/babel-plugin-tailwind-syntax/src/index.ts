/**
 * @flow strict
 */

import { transformAsync } from '@babel/core'
import type { PluginObj } from '@babel/core'
// import * as prettier from 'prettier';
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { makeCompiler } from './classes-to-css'
import { type Jss, type JssValue, convertFromCssToJss } from './helpers'

const rebaseJss = (jss: Jss): Jss => {
  const result: Jss = {}
  const baseKeys = Object.keys(jss).filter((key) => !key.startsWith(':') && !key.startsWith('@'))
  const otherKeys = Object.keys(jss).filter((key) => key.startsWith(':') || key.startsWith('@'))

  for (const key of baseKeys) {
    result[key] = jss[key]
  }
  for (const key of otherKeys) {
    const value = jss[key]
    if (typeof value !== 'object' || value == null) {
      throw new Error(`Expected object for ${key}`)
    }
    for (const subKey of Object.keys(value)) {
      const subValue =
        typeof value[subKey] === 'object' && value[subKey] != null
          ? rebaseJss(value[subKey])
          : value[subKey]

      result[subKey] = {
        default: result[subKey] ?? null,
        [key]: subValue,
      } as JssValue
    }
  }
  return result
}

const canBeIdentifier = (value: string): boolean => {
  if (value.length === 0) {
    return false
  }
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
    return false
  }
  if (value === 'undefined') {
    return false
  }
  return true
}

const convertToAst = (value: unknown): t.Expression => {
  if (typeof value === 'string') {
    return t.stringLiteral(value)
  }
  if (typeof value === 'number') {
    return t.numericLiteral(value)
  }
  if (typeof value === 'boolean') {
    return t.booleanLiteral(value)
  }
  if (value === null) {
    return t.nullLiteral()
  }
  if (value === undefined) {
    return t.identifier('undefined')
  }
  if (Array.isArray(value)) {
    return t.arrayExpression(value.map(convertToAst))
  }
  if (
    typeof value === 'object' &&
    value != null &&
    'type' in value &&
    typeof value.type === 'string'
  ) {
    // @ts-expect-error
    return value
  }
  if (typeof value === 'object' && value != null) {
    return t.objectExpression(
      Object.keys(value).map((key) =>
        t.objectProperty(
          canBeIdentifier(key) ? t.identifier(key) : t.stringLiteral(key),
          convertToAst((value as Record<string, unknown>)[key]),
        ),
      ),
    )
  }
  throw new Error(`Cannot convert value to AST: ${String(value)}`)
}

const customBabelPlugin = async (): Promise<PluginObj<{}>> => {
  let count = 0

  let cnMap: { [key: string]: string } = {}
  let styleMap: { [key: string]: unknown } = {}

  let stylex: t.Identifier
  let styles: t.Identifier

  const compile = await makeCompiler()

  const convertTwToJs = (classNames: string) => {
    let resultCss, resultJSS
    try {
      resultCss = compile(classNames)
      resultJSS = convertFromCssToJss(classNames, resultCss)
      return resultJSS
    } catch {
      console.log('Error converting', classNames)
      console.log('CSS Result:', resultCss)
      console.log('JSS Result:', resultJSS, '\n\n\n\n')
      return null
    }
  }

  const pathToStyleX = (
    arg: NodePath<t.Expression | t.ArgumentPlaceholder | t.JSXNamespacedName | t.SpreadElement>,
  ): t.Expression | null => {
    if (!arg.isExpression()) {
      return null
    }
    const node: t.Expression = arg.node
    const expressionMap: { [key: string]: unknown } = {}
    let input: string
    if (arg.isStringLiteral()) {
      input = arg.node.value
    } else if (arg.isTemplateLiteral()) {
      let val = 0
      const replacedExpressions = arg.node.expressions.map((e) => {
        const key = `$${++val}`
        expressionMap[key] = e
        return key
      })
      // join the strings and expressions
      input = arg.node.quasis.map((q, i) => q.value.raw + (replacedExpressions[i] || '')).join('')
    } else {
      return node
    }

    let keyName
    if (input != null && cnMap[input]) {
      keyName = cnMap[input]
    } else {
      const styleObject = convertTwToJs(input)
      if (styleObject == null) {
        return null
      }
      // Put replace IDs with expressions using expressionMap.
      for (const key of Object.keys(styleObject)) {
        const value = styleObject[key]
        // @ts-expect-error
        if (expressionMap[value]) {
          // @ts-expect-error
          styleObject[key] = expressionMap[value]
        }
      }

      keyName = `$${++count}`
      styleMap[keyName] = styleObject
      cnMap[input] = keyName
    }
    return t.memberExpression(styles, t.identifier(keyName))
  }

  return {
    name: '@stylextras/babel-plugin-tailwind-syntax',
    visitor: {
      Program: {
        enter: (path: NodePath<t.Program>) => {
          count = 0
          cnMap = {}
          styleMap = {}

          stylex = path.scope.generateUidIdentifier('stylex')
          styles = path.scope.generateUidIdentifier('styles')
        },
        exit: (path: NodePath<t.Program>) => {
          if (Object.keys(styleMap).length === 0) {
            return
          }

          const statments: Array<NodePath<t.Statement>> = path.get('body')

          const firstStatement = statments[0]
          const lastStatement = statments[statments.length - 1]

          firstStatement.insertBefore(
            t.importDeclaration(
              [t.importNamespaceSpecifier(stylex)],
              t.stringLiteral('@stylexjs/stylex'),
            ),
          )

          lastStatement.insertAfter(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                styles,
                t.callExpression(t.memberExpression(stylex, t.identifier('create')), [
                  convertToAst(styleMap),
                ]),
              ),
            ]),
          )
        },
      },
      JSXAttribute: (path: NodePath<t.JSXAttribute>) => {
        const jsxOpeningElement = path.parentPath.node
        if (jsxOpeningElement.type !== 'JSXOpeningElement') {
          return
        }
        const name = jsxOpeningElement.name
        const isHTML =
          name.type === 'JSXIdentifier' &&
          name.name[0].toLocaleLowerCase() === name.name[0] &&
          name.name.match(/^[a-z][a-z0-9\-]*$/)

        const node = path.node
        if (node.name.name !== 'className' && node.name.name !== 'class') {
          return
        }
        const valuePath: NodePath<t.Expression> = path.get('value').isJSXExpressionContainer()
          ? (path.get('value').get('expression') as NodePath<t.Expression>)
          : (path.get('value') as NodePath<t.Expression>)

        if (isCallExpressionNamed(valuePath, ['cn', 'twMerge'])) {
          const callExpression: NodePath<t.CallExpression> = valuePath
          const transformedArgs = callExpression
            .get('arguments')
            .map(pathToStyleX)
            .filter((arg) => arg != null)

          if (isHTML) {
            path.replaceWith(
              t.jsxSpreadAttribute(
                t.callExpression(
                  t.memberExpression(stylex, t.identifier('props')),
                  transformedArgs,
                ),
              ),
            )
          } else {
            valuePath.replaceWith(t.arrayExpression(transformedArgs))
          }

          return
        }

        const result = valuePath.evaluate()
        const { confident, value: existingValue } = result
        if (!confident) {
          return
        }
        if (typeof existingValue !== 'string') {
          return
        }

        let keyName

        if (cnMap[existingValue]) {
          keyName = cnMap[existingValue]
        } else {
          const styleObject = convertTwToJs(existingValue)
          if (styleObject == null) {
            return
          }

          keyName = `$${++count}`
          styleMap[keyName] = styleObject
          cnMap[existingValue] = keyName
        }

        if (isHTML) {
          path.replaceWith(
            t.jsxSpreadAttribute(
              t.callExpression(t.memberExpression(stylex, t.identifier('props')), [
                t.memberExpression(styles, t.identifier(keyName)),
              ]),
            ),
          )
        } else {
          valuePath.replaceWith(
            t.jsxExpressionContainer(t.memberExpression(styles, t.identifier(keyName))),
          )
        }
      },
      CallExpression(path: NodePath<t.CallExpression>) {
        if (!isCallExpressionNamed(path, ['tw'])) {
          return
        }
        const transformedArgs = path.get('arguments').map(pathToStyleX)
        path.replaceWith(t.arrayExpression(transformedArgs))
      },
    },
  }
}

function isCallExpressionNamed(
  path: NodePath<t.Expression>,
  fnNames: ReadonlyArray<string>,
): path is NodePath<t.CallExpression> {
  if (!path.isCallExpression()) {
    return false
  }
  const callee = path.get('callee')
  if (!callee.isIdentifier()) {
    return false
  }
  const name = callee.node.name
  if (!fnNames.includes(name)) {
    return false
  }
  return true
}

export default customBabelPlugin

export async function tailwindToStylex(source: string): Promise<string> {
  const isFlow = source.includes('@flow')

  const result = await transformAsync(source, {
    plugins: [
      ...(isFlow
        ? ['babel-plugin-syntax-hermes-parser']
        : [['@babel/syntax-typescript', { isTSX: true }], '@babel/syntax-jsx']),
      customBabelPlugin,
    ],
  })
  if (result == null || result.code == null) {
    return source
  }

  return result.code
}
