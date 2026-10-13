import * as ts from 'typescript';

import { ESLintUtils } from '@typescript-eslint/utils';

import { convertToPrismaExpression, createAstUtils, isPrismaExpression } from '@prismalyst/core';
import type { OptionsByRuleName, RegisteredRule } from '@prismalyst/core';

import { PrismalystRuleDocs } from '../../types/rule-docs.type.js';
import { ESLintRule, createRule } from '../../utils/create-rule.js';
import { RULES_MAP } from '../rules.map.js';

const ruleDocs: {
  [TRuleName in keyof OptionsByRuleName]: PrismalystRuleDocs<TRuleName>;
} = RULES_MAP;

export function createESLintRule<TRuleName extends keyof OptionsByRuleName>(
  rule: RegisteredRule<TRuleName>,
): ESLintRule {
  const ruleName = rule.name;

  const eslintRule = ruleDocs[ruleName];

  const ruleAstType = rule.astType;
  const ruleFunction = rule.function;

  return createRule<readonly [OptionsByRuleName[TRuleName]], string>({
    name: ruleName,
    meta: eslintRule.meta,
    create: function (context, [options]) {
      const services = ESLintUtils.getParserServices(context);
      const program = services.program;
      const checker = program.getTypeChecker();

      const astUtils = createAstUtils(ts, checker);

      switch (ruleAstType) {
        case 'callExpression':
          return {
            CallExpression(node) {
              const tsNode = services.esTreeNodeToTSNodeMap.get(node);

              const isValidPrismaExpression = isPrismaExpression(tsNode, program, astUtils);

              if (!isValidPrismaExpression) return;

              const prismaExpression = convertToPrismaExpression(tsNode, program, astUtils);

              const isTriggered = ruleFunction(prismaExpression, rule, options);

              if (isTriggered) {
                context.report({
                  node,
                  messageId: eslintRule.messageId,
                  data: { ...options },
                });
              }
            },
          };
        case 'newExpression':
          return {
            NewExpression(node) {
              const tsNode = services.esTreeNodeToTSNodeMap.get(node);

              const isValidPrismaExpression = isPrismaExpression(tsNode, program, astUtils);

              if (!isValidPrismaExpression) return;

              const prismaExpression = convertToPrismaExpression(tsNode, program, astUtils);

              const isTriggered = ruleFunction(prismaExpression, rule, options);

              if (isTriggered) {
                context.report({
                  node,
                  messageId: eslintRule.messageId,
                  data: { ...options },
                });
              }
            },
          };
      }
    },
  });
}
