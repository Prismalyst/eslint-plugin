import type { TSESLint } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';

import { RULES_LIST } from '@prismalyst/core';

import { createConfigs } from '../config/create-configs.ts';
import { RULES_MAP } from '../rules/rules.map.ts';

describe('Configs', () => {
  const plugin: TSESLint.FlatConfig.Plugin = {
    meta: { name: 'test-plugin' },
  };

  const { all } = createConfigs(plugin);

  it('should register the supplied plugin under @prismalyst', () => {
    expect(all.plugins['@prismalyst']).toBe(plugin);
  });

  it('should enable exactly all rules from @prismalyst/core', () => {
    const actualNames = Object.keys(all.rules).sort();
    const expectedNames = RULES_LIST.map((rule) => `@prismalyst/${rule.name}`).sort();

    expect(actualNames).toEqual(expectedNames);
  });

  it.each(RULES_LIST)('$name should have the expected severity', ({ name }) => {
    const config = all.rules[`@prismalyst/${name}`];
    const severity = Array.isArray(config) ? config[0] : config;
    const expectedSeverity = RULES_MAP[name].meta.type === 'problem' ? 'error' : 'warn';

    expect(severity).toBe(expectedSeverity);
  });

  it.each([
    {
      name: 'max-take',
      options: { max: 100 },
    },
    {
      name: 'no-deep-offset-pagination',
      options: { max: 1_000, min: -1_000 },
    },
    {
      name: 'no-prisma-client-in-function',
      options: {
        ignoredFiles: [],
        allowedFunctionsNames: ['main', 'seed'],
        allowInTests: true,
      },
    },
    {
      name: 'no-disconnect-in-request-flow',
      options: { ignoredFiles: [], allowInTests: true },
    },
  ] as const)('$name should have the expected default options', ({ name, options }) => {
    expect(all.rules[`@prismalyst/${name}`]).toEqual(['warn', options]);
  });
});
