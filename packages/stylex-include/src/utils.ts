import * as t from '@babel/types';

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
