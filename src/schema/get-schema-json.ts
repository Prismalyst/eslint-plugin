import type { Document } from '@prisma/dmmf';
import { getDMMF } from '@prisma/get-dmmf';
import { readFileSync } from 'node:fs';

import { findSchemaPath } from './utils/find-schema-path.js';

let DMMF: Document | null = null;

export function updateSchemaJson() {
  const pathToSchema = findSchemaPath();

  const schemaContent = readFileSync(pathToSchema, 'utf-8');

  const schema = getDMMF({ datamodel: schemaContent });

  if ('error' in schema) {
    throw new Error(`Failed to parse Prisma schema at "${pathToSchema}": ${schema.error.message}`, {
      cause: schema.error,
    });
  }

  DMMF = schema;
}

export function getSchemaJson() {
  if (!DMMF) updateSchemaJson();

  return DMMF;
}
