import { PrismalystRuleDocs } from '../types/rule-docs.type.js';

export const RULES_MAP = {
  'no-unsafe-raw-sql': {
    messageId: 'noUnsafeRawSQL',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow unsafe raw SQL',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        noUnsafeRawSQL:
          'Unsafe raw-query API requires explicit review, prefer TypedSQL or tagged templates',
      },
      schema: [],
    },
  },
  'no-dynamic-raw-query': {
    messageId: 'noDynamicRawQuery',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow dynamic raw query',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        noDynamicRawQuery: 'Dynamic value is interpolated into unsafe raw SQL',
      },
      schema: [],
    },
  },
  'no-unsafe-prisma-raw': {
    messageId: 'noUnsafePrismaRaw',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow unsafe Prisma.raw()',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        noUnsafePrismaRaw: 'Dynamic value passed to Prisma.raw() can enable SQL injection',
      },
      schema: [],
    },
  },
  'no-floating-prisma-promise': {
    messageId: 'noFloatingPrismaPromise',
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow floating Prisma promises',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        noFloatingPrismaPromise:
          'Prisma query promise must be awaited, returned, or otherwise handled',
      },
      schema: [],
    },
  },
  'require-where-delete-many': {
    messageId: 'requireWhereDeleteMany',
    meta: {
      type: 'problem',
      docs: {
        description: 'Require "where" for deleteMany',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        requireWhereDeleteMany: 'deleteMany() without "where" deletes every record',
      },
      schema: [],
    },
  },
  'require-where-update-many': {
    messageId: 'requireWhereUpdateMany',
    meta: {
      type: 'problem',
      docs: {
        description: 'Require "where" for updateMany',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        requireWhereUpdateMany: 'updateMany() without "where" updates every record',
      },
      schema: [],
    },
  },
  'no-query-in-loop': {
    messageId: 'noQueryInLoop',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow Prisma queries inside a loop',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        noQueryInLoop: 'Prisma query inside a loop may cause an N+1 query pattern',
      },
      schema: [],
    },
  },
  'max-take': {
    messageId: 'maxTake',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce maximum "take" value',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        maxTake: '"take" exceeds the configured maximum of {{max}} or is missing',
      },
      schema: [
        {
          type: 'object',
          properties: {
            max: { type: 'integer', minimum: 1 },
          },
          additionalProperties: false,
        },
      ],
      defaultOptions: [{ max: 100 }],
    },
  },
  'no-deep-offset-pagination': {
    messageId: 'noDeepOffsetPagination',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow deep offset pagination',
        recommended: true,
        requiresTypeChecking: true,
      },
      messages: {
        noDeepOffsetPagination:
          '"skip" value exceeds the configured maximum of {{max}} or exceeds the minimum of {{min}}, consider using cursor pagination',
      },
      schema: [
        {
          type: 'object',
          properties: {
            max: { type: 'integer' },
            min: { type: 'integer' },
          },
          additionalProperties: false,
        },
      ],
      defaultOptions: [{ max: 1_000, min: -1_000 }],
    },
  },
} as const satisfies Readonly<Record<string, PrismalystRuleDocs>>;
