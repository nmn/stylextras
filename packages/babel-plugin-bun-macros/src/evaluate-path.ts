/**
 * This is a extended version of the path evaluation code from Babel.
 *
 * The original can be found at:
 * https://github.com/babel/babel/blob/main/packages/babel-traverse/src/path/evaluation.ts
 *
 * The following extensions were made:
 * - It can accept a mapping from variable names to functions
 *   which when encountered will be evaluated instead of deopting.
 *   - The functions can be configured to accept the raw path instead of
 *     static values to handle dynamic values.
 * - It can handle object spreads when the spread value itself is statically evaluated.
 */

import { parseSync } from '@babel/core'
import traverse from '@babel/traverse'
import type { Binding, NodePath } from '@babel/traverse'
import * as t from '@babel/types'

// This file contains Babels metainterpreter that can evaluate static code.

const VALID_CALLEES = ['String', 'Number', 'Math', 'Object', 'Array']
const INVALID_METHODS = [
  'random',
  'assign',
  'defineProperties',
  'defineProperty',
  'freeze',
  'seal',
  'splice',
]

function isValidCallee(val: string): boolean {
  return (VALID_CALLEES as ReadonlyArray<string>).includes(val)
}

function isInvalidMethod(val: string): boolean {
  return INVALID_METHODS.includes(val)
}

export type FunctionConfig = {
  identifiers: {
    [fnName: string]: {
      fn: (...args: any[]) => any
      takesPath?: boolean
    }
  }
  memberExpressions: {
    [key: string]: {
      [memberName: string]: {
        fn: (...args: any[]) => any
        takesPath?: boolean
      }
    }
  }
}

type State = {
  confident: boolean
  deoptPath: NodePath | null
  seen: Map<t.Node, Result>
  functions: FunctionConfig
}

type Result = {
  resolved: boolean
  value?: any
}
/**
 * Deopts the evaluation
 */
function deopt(path: NodePath, state: State) {
  if (!state.confident) return
  state.deoptPath = path
  state.confident = false
}

function evaluateImportedFile(filePath: string, namedExport: string, state: State): any {
  const fs = require('fs')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  // It's safe to use `.babelrc` here because we're only
  // interested in the JS runtime, and not the CSS.
  // TODO: in environments where `.babelrc` is not available,
  // we need to find a way to decide whether to use Flow or TS syntax extensions.
  const ast: null | t.File | { readonly errors: unknown } = parseSync(fileContents, {
    babelrc: true,
  })
  if (!ast || (ast as any).errors || !t.isNode(ast)) {
    state.confident = false
    return
  }

  const astNode: t.Node = ast

  let result: any

  traverse(astNode, {
    ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
      const declaration = path.get('declaration')

      if (declaration.isVariableDeclaration()) {
        const decls = declaration.get('declarations')

        const finder = (decl: NodePath<t.Node>) => {
          if (decl.isVariableDeclarator()) {
            const id = decl.get('id')
            const init: NodePath<null | undefined | t.Expression> = decl.get('init')
            if (
              id.isIdentifier() &&
              id.node.name === namedExport &&
              init != null &&
              init.isExpression()
            ) {
              result = evaluateCached(init, state)
            }
          }
        }
        if (Array.isArray(decls)) {
          decls.forEach(finder)
        } else {
          finder(decls)
        }
      }
    },
  })

  if (state.confident) {
    return result
  } else {
    state.confident = false
    return
  }
}

/**
 * We wrap the _evaluate method so we can track `seen` nodes, we push an item
 * to the map before we actually evaluate it so we can deopt on self recursive
 * nodes such as:
 *
 *   var g = a ? 1 : 2,
 *       a = g * this.foo
 */
function evaluateCached(path: NodePath, state: State): any {
  const { node } = path
  const { seen } = state

  const existing: undefined | Result = seen.get(node)
  if (existing != null) {
    if (existing.resolved) {
      return existing.value
    } else {
      deopt(path, state)
      return
    }
  } else {
    const item: Result = { resolved: false }
    seen.set(node, item)

    const val = _evaluate(path, state)
    if (state.confident) {
      item.resolved = true
      item.value = val
    }
    return val
  }
}

function _evaluate(path: NodePath, state: State): any {
  if (!state.confident) return

  if (path.isArrowFunctionExpression()) {
    const body = path.get('body')
    const params: ReadonlyArray<NodePath<t.Identifier | t.Pattern | t.RestElement>> =
      path.get('params')
    const identParams = params
      .filter((param): param is NodePath<t.Identifier> => param.isIdentifier())
      .map((paramPath) => paramPath.node.name)
    if (body.isExpression() && identParams.length === params.length) {
      const expr: NodePath<t.Expression> = body
      return (...args: any[]) => {
        const identifierEntries = identParams.map((ident, index): [string, any] => [
          ident,
          args[index],
        ])
        const identifiersObj = Object.fromEntries(identifierEntries)
        const result = evaluate(expr, {
          ...state.functions,
          identifiers: { ...state.functions.identifiers, ...identifiersObj },
        })
        return result.value
      }
    }
  }

  if (path.isIdentifier()) {
    const name: string = path.node.name
    if (Object.keys(state.functions?.identifiers ?? {}).includes(name)) {
      return state.functions.identifiers[name]
    }
  }

  if (path.isTSAsExpression()) {
    const expr: NodePath<t.Expression> = path.get('expression')
    return evaluateCached(expr, state)
  }

  if (path.isTSSatisfiesExpression()) {
    const expr: NodePath<t.Expression> = path.get('expression')
    return evaluateCached(expr, state)
  }

  if (path.isSequenceExpression()) {
    const exprs = path.get('expressions')
    return evaluateCached(exprs[exprs.length - 1], state)
  }

  if (path.isStringLiteral() || path.isNumericLiteral() || path.isBooleanLiteral()) {
    return path.node.value
  }

  if (path.isNullLiteral()) {
    return null
  }

  if (path.isTemplateLiteral()) {
    return evaluateQuasis(path, path.node.quasis, state)
  }

  const maybeTag = path.isTaggedTemplateExpression() && path.get('tag')
  if (path.isTaggedTemplateExpression() && maybeTag && maybeTag.isMemberExpression()) {
    const tag: NodePath<t.MemberExpression> = maybeTag
    const object: NodePath<t.Expression | t.Super> = tag.get('object')

    if (object.isIdentifier()) {
      const name = object.node.name
      const property: NodePath = tag.get('property')

      if (
        name === 'String' &&
        !path.scope.hasBinding(name) &&
        property.isIdentifier() &&
        property.node.name === 'raw'
      ) {
        return evaluateQuasis(path, path.node.quasi.quasis, state, true)
      }
    }
  }

  if (path.isConditionalExpression()) {
    const testResult = evaluateCached(path.get('test'), state)
    if (!state.confident) return
    if (testResult) {
      return evaluateCached(path.get('consequent'), state)
    } else {
      return evaluateCached(path.get('alternate'), state)
    }
  }

  if (path.isExpressionWrapper()) {
    // TypeCastExpression, ExpressionStatement etc
    return evaluateCached(path.get('expression'), state)
  }

  // "foo".length
  if (path.isMemberExpression() && !path.parentPath.isCallExpression({ callee: path.node })) {
    const object = evaluateCached(path.get('object'), state)
    if (!state.confident) {
      return
    }

    const propPath = path.get('property')

    let property
    if (path.node.computed) {
      property = evaluateCached(propPath, state)
      if (!state.confident) {
        return
      }
    } else if (propPath.isIdentifier()) {
      property = propPath.node.name
    } else if (propPath.isStringLiteral()) {
      property = propPath.node.value
    } else {
      return deopt(propPath, state)
    }

    return object[property]
  }

  if (path.isReferencedIdentifier()) {
    const binding: undefined | Binding = path.scope?.getBinding(path.node.name)

    const bindingPath = binding?.path

    if (binding && binding.constantViolations.length > 0) {
      return deopt(binding.path, state)
    }

    if (
      binding &&
      path.node.start != null &&
      binding.path.node.end != null &&
      path.node.start < binding.path.node.end
    ) {
      return deopt(binding.path, state)
    }

    if (binding && binding.hasValue) {
      return binding.value
    } else {
      if (path.node.name === 'undefined') {
        return binding ? deopt(binding.path, state) : undefined
      } else if (path.node.name === 'Infinity') {
        return binding ? deopt(binding.path, state) : Number.POSITIVE_INFINITY
      } else if (path.node.name === 'NaN') {
        return binding ? deopt(binding.path, state) : Number.NaN
      }

      const resolved = path.resolve()
      if (resolved === path) {
        return deopt(path, state)
      } else {
        return evaluateCached(resolved, state)
      }
    }
  }

  if (path.isUnaryExpression({ prefix: true })) {
    if (path.node.operator === 'void') {
      // we don't need to evaluate the argument to know what this will return
      return undefined
    }

    const argument = path.get('argument')
    if (path.node.operator === 'typeof' && (argument.isFunction() || argument.isClass())) {
      return 'function'
    }

    const arg = evaluateCached(argument, state)
    if (!state.confident) return
    switch (path.node.operator) {
      case '!':
        return !arg
      case '+':
        return +arg
      case '-':
        return -arg
      case '~':
        return ~arg
      case 'typeof':
        return typeof arg
      // @ts-ignore - This is a valid unary operator
      case 'void':
        return undefined
      default:
        return deopt(path, state)
    }
  }

  if (path.isArrayExpression()) {
    const arrPath: NodePath<t.ArrayExpression> = path
    const arr = []
    const elems = arrPath.get('elements')
    for (const elem of elems) {
      if (elem.isExpression()) {
        const elemValue = evaluate(elem, state.functions)

        if (elemValue.confident) {
          arr.push(elemValue.value)
        } else {
          elemValue.deopt && deopt(elemValue.deopt, state)
          return
        }
      } else if (elem.isSpreadElement()) {
        const spreadExpression = evaluateCached(elem.get('argument'), state)
        if (!state.confident) {
          return deopt(elem, state)
        }
        arr.push(...spreadExpression)
      }
    }
    return arr
  }

  if (path.isObjectExpression()) {
    const obj: { [key: string | number | symbol]: unknown } = {}
    const props: ReadonlyArray<NodePath<t.ObjectMethod | t.ObjectProperty | t.SpreadElement>> =
      path.get('properties')
    for (const prop of props) {
      if (prop.isObjectMethod()) {
        return deopt(prop, state)
      }
      if (prop.isSpreadElement()) {
        const spreadExpression = evaluateCached(prop.get('argument'), state)
        if (!state.confident) {
          return deopt(prop, state)
        }
        Object.assign(obj, spreadExpression)
        continue
      }
      if (prop.isObjectProperty()) {
        const keyPath = prop.get('key')
        let key: string | number | symbol
        if (keyPath.isPrivateName()) {
          return deopt(keyPath, state)
        }
        if (prop.node.computed) {
          const { confident, deopt: resultDeopt, value } = evaluate(keyPath, state.functions)
          if (!confident) {
            resultDeopt && deopt(resultDeopt, state)
            return
          }
          key = value
        } else if (keyPath.isIdentifier()) {
          key = keyPath.node.name
        } else if (keyPath.isStringLiteral()) {
          key = keyPath.node.value
        } else {
          // TODO: This is'nt handling all possible types that `keyPath` could be
          const maybeKey = (keyPath.node as any).value
          if (
            (maybeKey != null && typeof maybeKey === 'string') ||
            typeof maybeKey === 'number' ||
            typeof maybeKey === 'symbol'
          ) {
            key = maybeKey
          }
        }
        // todo(flow->ts): remove typecast
        const valuePath: NodePath = prop.get('value')
        let value = evaluate(valuePath, state.functions)
        if (!value.confident) {
          value.deopt && deopt(value.deopt, state)
          return
        }
        value = value.value
        // @ts-ignore
        obj[key] = value
      }
    }
    return obj
  }

  if (path.isLogicalExpression()) {
    // If we are confident that the left side of an && is false, or the left
    // side of an || is true, we can be confident about the entire expression
    const wasConfident = state.confident
    const left = evaluateCached(path.get('left'), state)
    const leftConfident = state.confident
    state.confident = wasConfident
    const right = evaluateCached(path.get('right'), state)
    const rightConfident = state.confident

    switch (path.node.operator) {
      case '||':
        // TODO consider having a "truthy type" that doesn't bail on
        // left uncertainty but can still evaluate to truthy.
        state.confident = leftConfident && (!!left || rightConfident)
        if (!state.confident) return

        return left || right
      case '&&':
        state.confident = leftConfident && (!left || rightConfident)
        if (!state.confident) return

        return left && right
      case '??':
        state.confident = leftConfident && !!(left ?? rightConfident)
        if (!state.confident) return

        return left ?? right
      default:
        path.node.operator satisfies never
    }
  }

  if (path.isBinaryExpression()) {
    const left = evaluateCached(path.get('left'), state)
    if (!state.confident) return
    const right = evaluateCached(path.get('right'), state)
    if (!state.confident) return

    switch (path.node.operator) {
      case '-':
        return left - right
      case '+':
        return left + right
      case '/':
        return left / right
      case '*':
        return left * right
      case '%':
        return left % right
      case '**':
        return left ** right
      case '<':
        return left < right
      case '>':
        return left > right
      case '<=':
        return left <= right
      case '>=':
        return left >= right
      case '==':
        return left == right // eslint-disable-line eqeqeq
      case '!=':
        return left !== right
      case '===':
        return left === right
      case '!==':
        return left !== right
      case '|':
        return left | right
      case '&':
        return left & right
      case '^':
        return left ^ right
      case '<<':
        return left << right
      case '>>':
        return left >> right
      case '>>>':
        return left >>> right
      case 'in':
        return left in right
      case 'instanceof':
        return left instanceof right
      default:
        return
    }
  }

  if (path.isCallExpression()) {
    const callee = path.get('callee')
    let context
    let func

    // Number(1);
    if (
      callee.isIdentifier() &&
      !path.scope.getBinding(callee.node.name) &&
      isValidCallee(callee.node.name)
    ) {
      func = (global as any)[callee.node.name]
    } else if (callee.isIdentifier() && state.functions.identifiers[callee.node.name]) {
      func = state.functions.identifiers[callee.node.name]
    }

    if (callee.isMemberExpression()) {
      const object = callee.get('object')
      const property = callee.get('property')

      // Math.min(1, 2)
      if (object.isIdentifier() && property.isIdentifier()) {
        if (isValidCallee(object.node.name) && !isInvalidMethod(property.node.name)) {
          context = (global as any)[object.node.name]
          func = context[property.node.name]
        } else if (
          state.functions.memberExpressions[object.node.name] &&
          state.functions.memberExpressions[object.node.name][property.node.name]
        ) {
          context = state.functions.memberExpressions[object.node.name]
          func = context[property.node.name]
        }
      }

      if (
        object.isIdentifier() &&
        property.isStringLiteral() &&
        state.functions.memberExpressions[object.node.name] &&
        state.functions.memberExpressions[object.node.name][property.node.value]
      ) {
        context = state.functions.memberExpressions[object.node.name]
        func = context[property.node.value]
      }

      // "abc".charCodeAt(4)
      if ((object.isStringLiteral() || object.isNumericLiteral()) && property.isIdentifier()) {
        const val: number | string = object.node.value
        const name: string = property.node.name

        func = (val as any)[property.node.name]
      }

      const parsedObj = evaluate(object, state.functions)
      if (parsedObj.confident && property.isIdentifier()) {
        func = parsedObj.value[property.node.name]
        context = parsedObj.value
      }
      if (parsedObj.confident && property.isStringLiteral()) {
        func = parsedObj.value[property.node.value]
        context = parsedObj.value
      }
    }

    if (func) {
      if (func.takesPath) {
        const args = path.get('arguments')
        return func.fn(...args)
      } else {
        const args = path
          .get('arguments')
          .map((arg: NodePath<t.CallExpression['arguments'][number]>) => evaluateCached(arg, state))
        if (!state.confident) return

        if (func.fn) {
          return func.fn.apply(context, args)
        } else {
          return func.apply(context, args)
        }
      }
    }
  }

  deopt(path, state)
}

function evaluateQuasis(
  path: NodePath<t.TaggedTemplateExpression | t.TemplateLiteral>,
  quasis: Array<any>,
  state: State,
  raw = false,
) {
  let str = ''

  let i = 0
  const exprs: ReadonlyArray<NodePath> = path.isTemplateLiteral()
    ? path.get('expressions')
    : path.isTaggedTemplateExpression()
      ? path.get('quasi').get('expressions')
      : []

  // const exprs: Array<NodePath<t.Node>> = path.isTemplateLiteral()
  //   ? path.get('expressions')
  //   : (path as NodePath<t.TaggedTemplateExpression>)
  //       .get('quasi')
  //       .get('expressions');

  for (const elem of quasis) {
    // not confident, evaluated an expression we don't like
    if (!state.confident) break

    // add on element
    str += raw ? elem.value.raw : elem.value.cooked

    // add on interpolated expression if it's present
    const expr = exprs[i++]
    if (expr) str += String(evaluateCached(expr, state))
  }

  if (!state.confident) return
  return str
}

/**
 * Walk the input `node` and statically evaluate it.
 *
 * Returns an object in the form `{ confident, value, deopt }`. `confident`
 * indicates whether or not we had to drop out of evaluating the expression
 * because of hitting an unknown node that we couldn't confidently find the
 * value of, in which case `deopt` is the path of said node.
 *
 * Example:
 *
 *   evaluate(parse("5 + 5")) // { confident: true, value: 10 }
 *   evaluate(parse("!true")) // { confident: true, value: false }
 *   evaluate(parse("foo + foo")) // { confident: false, value: undefined, deopt: NodePath }
 *
 */

export function evaluate(
  path: NodePath,
  functions: FunctionConfig = { identifiers: {}, memberExpressions: {} },
): Readonly<{
  confident: boolean
  value: any
  deopt?: null | NodePath
}> {
  const state: State = {
    confident: true,
    deoptPath: null,
    seen: new Map(),
    functions,
  }
  let value = evaluateCached(path, state)
  if (!state.confident) value = undefined

  return {
    confident: state.confident,
    deopt: state.deoptPath,
    value: value,
  }
}
