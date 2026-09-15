import { ESLintUtils } from '@typescript-eslint/utils';

export interface PrismalystRuleDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

export const createRule = ESLintUtils.RuleCreator<PrismalystRuleDocs>(
  (name) => `https://github.com/Prismalyst/core/blob/main/src/rules/list/${name}.md`,
);

export type ESLintRule = ReturnType<typeof createRule>;
