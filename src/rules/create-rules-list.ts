import * as ts from 'typescript';

import { ESLintUtils } from '@typescript-eslint/utils';

import { RULES_LIST, convertToPrismaCall, createAstUtils, isPrismaCall } from '@prismalyst/core';

import { PrismalystRuleDocs } from '../types/rule-docs.type.js';
import { ESLintRule, createRule } from '../utils/create-rule.js';
import { RULES_MAP } from './rules.map.js';
import { isRuleName } from './utils/is-rule-name.js';

const astUtils = createAstUtils(ts);

export function createRulesList() {
  const rules: Record<string, ESLintRule> = {};

  RULES_LIST.forEach((rule) => {
    if (!isRuleName(rule.name)) return;

    const eslintRule = RULES_MAP[rule.name] as PrismalystRuleDocs;

    rules[rule.name] = createRule({
      name: rule.name,
      meta: eslintRule.meta,
      create: function (context, [options = {}]) {
        const services = ESLintUtils.getParserServices(context);
        const program = services.program;

        return {
          CallExpression(node) {
            const tsNode = services.esTreeNodeToTSNodeMap.get(node);

            const isValidPrismaCall = isPrismaCall(tsNode, program, astUtils);

            if (!isValidPrismaCall) return;

            const prismaCall = convertToPrismaCall(tsNode, program, astUtils);

            const isTriggered = rule.function(prismaCall, rule, options);

            if (isTriggered) {
              context.report({
                node,
                messageId: eslintRule.messageId,
                data: options,
              });
            }
          },
        };
      },
    });
  });

  return rules;
}
