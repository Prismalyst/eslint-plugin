import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const ignoredDirectories = new Set(['node_modules', '.git', 'dist', 'build']);

export function findSchemaPath(): string {
  const directory = process.cwd();
  const schemaPath = searchDirectory(directory);

  if (!schemaPath) {
    throw new Error(`Could not find a Prisma schema in "${directory}" or its child directories.`);
  }

  return schemaPath;
}

function searchDirectory(directory: string): string | undefined {
  const entries = readdirSync(directory, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && entry.name === 'schema.prisma')) {
    // TODO: Make path to schema configurable or return all schemas
    return join(directory, 'schema.prisma');
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      const schemaPath = searchDirectory(join(directory, entry.name));

      if (schemaPath) {
        return schemaPath;
      }
    }
  }

  return undefined;
}
