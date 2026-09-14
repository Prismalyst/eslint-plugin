import { ESLintUtils } from '@typescript-eslint/utils';

export interface PrismalystRuleDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

export const createRule = ESLintUtils.RuleCreator<PrismalystRuleDocs>(
  (name) => `https://prismalyst.dev/rules/${name}`,
);

export type ESLintRule = ReturnType<typeof createRule>;