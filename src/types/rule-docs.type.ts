import { JSONSchema4 } from '@typescript-eslint/utils/json-schema';

import { OptionsByRuleName } from '@prismalyst/core';

type RuleSeverity = 'problem' | 'suggestion' | 'layout';

type RuleOptions<TRuleName extends keyof OptionsByRuleName> = OptionsByRuleName[TRuleName];

export type PrismalystRuleDocs<TRuleName extends keyof OptionsByRuleName> = {
  messageId: string;
  meta: {
    type: RuleSeverity;
    docs: {
      description: string;
      recommended: boolean;
      requiresTypeChecking: boolean;
    };
    messages: Record<string, string>;
    schema: readonly JSONSchema4[];
    defaultOptions?: readonly [RuleOptions<TRuleName>];
  };
};
