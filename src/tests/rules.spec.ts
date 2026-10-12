import { describe, expect, it } from 'vitest';

import { RULES_LIST } from '@prismalyst/core';

import { createRulesList } from '../rules/create-rules-list.ts';
import { RULES_MAP } from '../rules/rules.map.ts';

describe('Rules', () => {
  const rules = createRulesList();

  it('should have all rules from @prismalyst/core', () => {
    const actualNames = Object.keys(rules).sort();
    const expectedNames = RULES_LIST.map((rule) => rule.name).sort();

    expect(actualNames).toEqual(expectedNames);
  });

  it('should have no rules without a "create" function', () => {
    expect(Object.values(rules).some((rule) => typeof rule.create !== 'function')).toBe(false);
  });

  it('should have expected messageId', () => {
    const names = Object.keys(RULES_MAP) as (keyof typeof RULES_MAP)[];

    for (const name of names) {
      const messageId = RULES_MAP[name].messageId;

      expect(rules[name].meta.messages[messageId]).toBeDefined();
    }
  });
});
