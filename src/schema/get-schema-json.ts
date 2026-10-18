import type { Document } from '@prisma/dmmf';
import { getDMMF } from '@prisma/get-dmmf';
import { readFileSync, statSync } from 'node:fs';

import { findSchemaPath } from './utils/find-schema-path.js';

let DMMF: Document | null = null;
let schemaPath: string | null = null;
let mTime: number;

export function updateSchemaJson() {
  if (!schemaPath) {
    schemaPath = findSchemaPath();
  }

  const schemaContent = readFileSync(schemaPath, 'utf-8');

  const schema = getDMMF({ datamodel: schemaContent });

  if ('error' in schema) {
    schemaPath = null;
    DMMF = null;

    throw new Error(`Failed to parse Prisma schema at "${schemaPath}": ${schema.error.message}`, {
      cause: schema.error,
    });
  }

  const { mtimeMs } = statSync(schemaPath);

  mTime = mtimeMs;
  DMMF = schema;
}

export function getSchemaJson() {
  if (!DMMF) updateSchemaJson();
  if (!isCacheValid(schemaPath)) updateSchemaJson();

  return DMMF;
}

function isCacheValid(pathToSchema: string | null) {
  if (!pathToSchema) return false;

  const { mtimeMs } = statSync(pathToSchema);

  return mTime === mtimeMs;
}
