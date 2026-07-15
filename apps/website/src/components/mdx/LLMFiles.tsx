/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import stylexAuthoring from '../../../static/llm/stylex-authoring.md?raw'
import stylexInstallation from '../../../static/llm/stylex-installation.md?raw'
import { ScrollableCodeBlock } from './ScrollableCodeBlock'

export function LLMInstallationFile() {
  return (
    <ScrollableCodeBlock
      content={stylexInstallation}
      maxHeight={400}
      title="stylex-installation.md"
    />
  )
}

export function LLMStylingFile() {
  return (
    <ScrollableCodeBlock content={stylexAuthoring} maxHeight={400} title="stylex-authoring.md" />
  )
}
