import { JSONSchema4 } from '@typescript-eslint/utils/json-schema';

type RuleSeverity = 'problem' | 'suggestion' | 'layout';

type RuleOptions = Readonly<Record<string, unknown>>;

export type PrismalystRuleDocs = {
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
    defaultOptions?: readonly [RuleOptions];
  };
};
