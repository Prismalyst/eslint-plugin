import type { TSESLint } from '@typescript-eslint/utils';

import { RULES_MAP } from '../rules/rules.map.js';

const RULES_SEVERITY_MAP = {
  problem: 'error',
  suggestion: 'warn',
};

export function createConfigs(plugin: TSESLint.FlatConfig.Plugin) {
  const pluginConfig = {
    plugins: {
      '@prismalyst': plugin,
    },
  };

  return {
    all: {
      ...pluginConfig,
      rules: {
        '@prismalyst/no-unsafe-raw-sql':
          RULES_SEVERITY_MAP[RULES_MAP['no-unsafe-raw-sql'].meta.type],
        '@prismalyst/no-dynamic-raw-query':
          RULES_SEVERITY_MAP[RULES_MAP['no-dynamic-raw-query'].meta.type],
        '@prismalyst/no-unsafe-prisma-raw':
          RULES_SEVERITY_MAP[RULES_MAP['no-unsafe-prisma-raw'].meta.type],
        '@prismalyst/no-floating-prisma-promise':
          RULES_SEVERITY_MAP[RULES_MAP['no-floating-prisma-promise'].meta.type],
        '@prismalyst/require-where-delete-many':
          RULES_SEVERITY_MAP[RULES_MAP['require-where-delete-many'].meta.type],
        '@prismalyst/require-where-update-many':
          RULES_SEVERITY_MAP[RULES_MAP['require-where-update-many'].meta.type],
        '@prismalyst/no-query-in-loop': RULES_SEVERITY_MAP[RULES_MAP['no-query-in-loop'].meta.type],
        '@prismalyst/max-take': [
          RULES_SEVERITY_MAP[RULES_MAP['max-take'].meta.type],
          RULES_MAP['max-take'].meta.defaultOptions[0],
        ],
        '@prismalyst/no-deep-offset-pagination': [
          RULES_SEVERITY_MAP[RULES_MAP['no-deep-offset-pagination'].meta.type],
          RULES_MAP['no-deep-offset-pagination'].meta.defaultOptions[0],
        ],
      },
    },
    recommended: {
      ...pluginConfig,
      rules: {
        '@prismalyst/no-unsafe-raw-sql':
          RULES_SEVERITY_MAP[RULES_MAP['no-unsafe-raw-sql'].meta.type],
        '@prismalyst/no-dynamic-raw-query':
          RULES_SEVERITY_MAP[RULES_MAP['no-dynamic-raw-query'].meta.type],
        '@prismalyst/no-unsafe-prisma-raw':
          RULES_SEVERITY_MAP[RULES_MAP['no-unsafe-prisma-raw'].meta.type],
        '@prismalyst/no-floating-prisma-promise':
          RULES_SEVERITY_MAP[RULES_MAP['no-floating-prisma-promise'].meta.type],
        '@prismalyst/require-where-delete-many':
          RULES_SEVERITY_MAP[RULES_MAP['require-where-delete-many'].meta.type],
        '@prismalyst/require-where-update-many':
          RULES_SEVERITY_MAP[RULES_MAP['require-where-update-many'].meta.type],
        '@prismalyst/no-query-in-loop': RULES_SEVERITY_MAP[RULES_MAP['no-query-in-loop'].meta.type],
        '@prismalyst/max-take': [
          RULES_SEVERITY_MAP[RULES_MAP['max-take'].meta.type],
          RULES_MAP['max-take'].meta.defaultOptions[0],
        ],
        '@prismalyst/no-deep-offset-pagination': [
          RULES_SEVERITY_MAP[RULES_MAP['no-deep-offset-pagination'].meta.type],
          RULES_MAP['no-deep-offset-pagination'].meta.defaultOptions[0],
        ],
      },
    },
  };
}
