import { RULES_LIST } from '@prismalyst/core';

import { ESLintRule } from '../utils/create-rule.js';
import { createESLintRule } from './utils/create-eslint-rule.js';

export function createRulesList() {
  const rules: Record<string, ESLintRule> = {};

  RULES_LIST.forEach((rule) => {
    rules[rule.name] = createESLintRule(rule);
  });

  return rules;
}
