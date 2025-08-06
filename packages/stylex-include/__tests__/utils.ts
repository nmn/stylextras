import { expect } from 'vitest'

/**
 * Expects a string to contain a code snippet, ignoring whitespaces and newlines.
 */
export function expectToContainCodeSnippet(content: string, code: string) {
  const regex = new RegExp(code.replace(/[\s\n]+/g, '\\s*'))
  expect(content).toMatch(regex)
}
