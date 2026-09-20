import * as ts from 'typescript';

import { ESLintUtils } from '@typescript-eslint/utils';

import {
  RULES_LIST,
  convertToPrismaExpression,
  createAstUtils,
  isPrismaExpression,
} from '@prismalyst/core';

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

    const ruleName = rule.name;
    const ruleAstType = rule.astType;
    const ruleFunction = rule.function;

    rules[ruleName] = createRule({
      name: ruleName,
      meta: eslintRule.meta,
      create: function (context, [options = {}]) {
        const services = ESLintUtils.getParserServices(context);
        const program = services.program;

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
                    data: options,
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

                const isTriggered = rule.function(prismaExpression, rule, options);

                if (isTriggered) {
                  context.report({
                    node,
                    messageId: eslintRule.messageId,
                    data: options,
                  });
                }
              },
            };
        }
      },
    });
  });

  return rules;
}
