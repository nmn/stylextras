/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { createFromSource } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const { staticGET: GET } = createFromSource(source, {
  language: 'english',
})

export async function getConfig() {
  return { render: 'static' as const }
}
