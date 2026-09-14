import type { TSESLint } from '@typescript-eslint/utils';

import { createRulesList } from './rules/create-rules-list.js';

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: 'eslint-plugin-prismalyst',
    version: '0.1.0',
  },
  rules: {
    ...createRulesList(),
  },
  configs: {},
};

export default plugin;
