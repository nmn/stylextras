import * as t from '@babel/types'
import * as path from 'path'

/**
 * Resolves the key of an object property for the purposes of comparison and merging overlapping
 * properties. Anything more complex than simple identifiers or literals is not supported and will
 * throw an error.
 */
export function resolveKey(key: t.PrivateName | t.Expression) {
  if (t.isIdentifier(key)) {
    return key.name
  }
  if (t.isLiteral(key) && 'value' in key) {
    return key.value
  }

  throw new Error('Unsupported key type')
}

/**
 * Adds a new property to an existing array of properties, replacing any existing property with the same key.
 */
export function pushOrReplaceProperty(
  existingProperties: t.ObjectExpression['properties'],
  newProperty: t.ObjectExpression['properties'][number],
) {
  if (!t.isSpreadElement(newProperty)) {
    const newPropertyKey = resolveKey(newProperty.key)

    const overlappingPropertyIndex = existingProperties.findIndex((prop) => {
      if (t.isSpreadElement(prop)) {
        return false
      }

      try {
        const existingKey = resolveKey(prop.key)
        return existingKey === newPropertyKey
      } catch {
        return false
      }
    })

    if (overlappingPropertyIndex !== -1) {
      existingProperties.splice(overlappingPropertyIndex, 1, newProperty)
    } else {
      existingProperties.push(newProperty)
    }
  }
}

/**
 * Remaps a relative import path from one file to another.
 * @param importSource The original import source (e.g., './base.js')
 * @param fromFilePath The file path where the import originally exists
 * @param toFilePath The file path where we want to inject the import
 * @returns The remapped import source
 */
export function remapImportPath(
  importSource: string,
  fromFilePath: string,
  toFilePath: string,
): string {
  // If it's not a relative import, return as-is
  if (!importSource.startsWith('.')) {
    return importSource
  }

  // Resolve the absolute path of the imported module
  const fromDir = path.dirname(fromFilePath)
  const absoluteImportPath = path.resolve(fromDir, importSource)

  // Calculate the relative path from the target file
  const toDir = path.dirname(toFilePath)
  let relativePath = path.relative(toDir, absoluteImportPath)

  // Ensure the path starts with './' or '../'
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath
  }

  // Normalize path separators for consistency
  return relativePath.replace(/\\/g, '/')
}

/**
 * Checks if an identifier name conflicts with any identifier in the AST.
 * @param ast The AST to check
 * @param identifierName The identifier name to check for conflicts
 * @returns true if there's a conflict, false otherwise
 */
export function hasIdentifierConflict(ast: t.File, identifierName: string): boolean {
  let hasConflict = false
  
  t.traverseFast(ast, (node) => {
    if (t.isIdentifier(node) && node.name === identifierName) {
      hasConflict = true
    }
  })
  
  return hasConflict
}

/**
 * Generates a non-conflicting identifier name by prepending underscores.
 * @param ast The AST to check against
 * @param originalName The original identifier name
 * @returns A non-conflicting identifier name
 */
export function generateNonConflictingName(ast: t.File, originalName: string): string {
  let candidateName = originalName
  
  while (hasIdentifierConflict(ast, candidateName)) {
    candidateName = '_' + candidateName
  }
  
  return candidateName
}

/**
 * Renames all occurrences of an identifier in an object expression.
 * @param objectExpression The object expression to modify
 * @param oldName The old identifier name
 * @param newName The new identifier name
 */
export function renameIdentifierInObject(
  objectExpression: t.ObjectExpression,
  oldName: string,
  newName: string,
) {
  t.traverseFast(objectExpression, (node) => {
    if (t.isIdentifier(node) && node.name === oldName) {
      node.name = newName
    }
  })
}

/**
 * Injects an import into the AST, merging with existing imports if possible.
 * @param ast The AST to modify
 * @param id The identifier to import
 * @param importDeclaration The import declaration containing the identifier
 * @param currentFilePath The path of the file being modified
 * @param sourceFilePath The path of the file where the import originally exists
 * @param aliasName Optional alias name to use instead of the original identifier name
 */
export function injectImport(
  ast: t.File,
  id: t.Identifier,
  importDeclaration: t.ImportDeclaration,
  currentFilePath: string,
  sourceFilePath: string,
  aliasName?: string,
) {
  const originalSource = importDeclaration.source.value
  const remappedSource = remapImportPath(originalSource, sourceFilePath, currentFilePath)
  const localName = aliasName || id.name

  // Find the specifier for this identifier in the original import
  const specifier = importDeclaration.specifiers.find((spec) => {
    if (t.isImportSpecifier(spec)) {
      return t.isIdentifier(spec.local) && spec.local.name === id.name
    }
    if (t.isImportDefaultSpecifier(spec)) {
      return spec.local.name === id.name
    }
    if (t.isImportNamespaceSpecifier(spec)) {
      return spec.local.name === id.name
    }
    return false
  })

  if (!specifier) {
    // This shouldn't happen if dependencies were extracted correctly
    return
  }

  // Find existing import declaration with the same source
  const existingImportIndex = ast.program.body.findIndex(
    (node) => t.isImportDeclaration(node) && node.source.value === remappedSource,
  )

  if (existingImportIndex !== -1) {
    const existingImport = ast.program.body[existingImportIndex] as t.ImportDeclaration

    // Check if the identifier is already imported
    const alreadyImported = existingImport.specifiers.some((spec) => {
      if (t.isImportSpecifier(spec) && t.isImportSpecifier(specifier)) {
        // For named imports, check both local and imported names
        const existingImported = t.isIdentifier(spec.imported)
          ? spec.imported.name
          : spec.imported.value
        const newImported = t.isIdentifier(specifier.imported)
          ? specifier.imported.name
          : specifier.imported.value
        return spec.local.name === localName || existingImported === newImported
      }
      if (t.isImportDefaultSpecifier(spec) && t.isImportDefaultSpecifier(specifier)) {
        return spec.local.name === localName
      }
      if (t.isImportNamespaceSpecifier(spec) && t.isImportNamespaceSpecifier(specifier)) {
        return spec.local.name === localName
      }
      return false
    })

    if (!alreadyImported) {
      // Add the specifier to the existing import
      if (t.isImportSpecifier(specifier)) {
        existingImport.specifiers.push(
          t.importSpecifier(t.identifier(localName), specifier.imported),
        )
      } else if (t.isImportDefaultSpecifier(specifier)) {
        // Only add if there's no default import already
        const hasDefault = existingImport.specifiers.some((s) =>
          t.isImportDefaultSpecifier(s),
        )
        if (!hasDefault) {
          existingImport.specifiers.unshift(t.importDefaultSpecifier(t.identifier(localName)))
        }
      } else if (t.isImportNamespaceSpecifier(specifier)) {
        // Only add if there's no namespace import already
        const hasNamespace = existingImport.specifiers.some((s) =>
          t.isImportNamespaceSpecifier(s),
        )
        if (!hasNamespace) {
          existingImport.specifiers.push(t.importNamespaceSpecifier(t.identifier(localName)))
        }
      }
    }
  } else {
    // Create a new import declaration
    let newSpecifiers: t.ImportDeclaration['specifiers'] = []

    if (t.isImportSpecifier(specifier)) {
      newSpecifiers = [t.importSpecifier(t.identifier(localName), specifier.imported)]
    } else if (t.isImportDefaultSpecifier(specifier)) {
      newSpecifiers = [t.importDefaultSpecifier(t.identifier(localName))]
    } else if (t.isImportNamespaceSpecifier(specifier)) {
      newSpecifiers = [t.importNamespaceSpecifier(t.identifier(localName))]
    }

    const newImport = t.importDeclaration(newSpecifiers, t.stringLiteral(remappedSource))

    // Insert at the beginning of the program, after any existing imports
    const lastImportIndex = ast.program.body.findLastIndex((node) =>
      t.isImportDeclaration(node),
    )
    if (lastImportIndex !== -1) {
      ast.program.body.splice(lastImportIndex + 1, 0, newImport)
    } else {
      ast.program.body.unshift(newImport)
    }
  }
}
