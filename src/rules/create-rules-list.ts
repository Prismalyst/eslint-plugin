import * as ts from 'typescript';

import { ESLintUtils } from '@typescript-eslint/utils';

import { RULES_LIST, convertToPrismaCall, createAstUtils, isPrismaCall } from '@prismalyst/core';

import { ESLintRule, createRule } from '../utils/create-rule.js';

const astUtils = createAstUtils(ts);

export function createRulesList() {
  const rules: Record<string, ESLintRule> = {};

  RULES_LIST.forEach((rule) => {
    rules[rule.name] = createRule({
      name: rule.name,
      meta: rule.meta,
      create: function (context) {
        const services = ESLintUtils.getParserServices(context);
        const program = services.program;

        return {
          CallExpression(node) {
            const tsNode = services.esTreeNodeToTSNodeMap.get(node);

            const isValidPrismaCall = isPrismaCall(tsNode, program, astUtils);

            if (!isValidPrismaCall) {
              return;
            }

            const prismaCall = convertToPrismaCall(tsNode, astUtils);

            const isTriggered = rule.function(prismaCall, rule);

            if (isTriggered) {
              context.report({
                node,
                messageId: rule.messageId,
              });
            }
          },
        };
      },
    });
  });

  return rules;
}
