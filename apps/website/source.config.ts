/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  defineConfig,
  defineDocs,
} from 'fumadocs-mdx/config';
import { codeHighlightThemes } from './src/lib/code-highlight-theme.js';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: codeHighlightThemes,
    },
  },
});
