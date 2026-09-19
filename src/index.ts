import type { TSESLint } from '@typescript-eslint/utils';

import { createConfigs } from './config/create-configs.js';
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

const { all, recommended } = createConfigs(plugin);

Object.assign(plugin.configs!, {
  all,
  recommended,
});

export default plugin;
