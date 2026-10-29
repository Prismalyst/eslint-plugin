# Prismalyst ESLint plugin

Find risky Prisma queries and common query-performance mistakes while linting TypeScript. Prismalyst uses type information to recognize Prisma calls, and schema metadata for rules about indexes, relations, cascading deletes, and pagination.

Analysis does not execute queries or require a database connection. Reports need review: static analysis cannot prove query safety or predict database performance.

**0.1.0 is an early beta for Prisma 7.** See [known limitations](#known-limitations) before enabling every rule in CI.

## Requirements

- Node.js 24 is the development and CI baseline.
- ESLint 10 with flat configuration.
- TypeScript 6.0 is the current development baseline. The declared peer range is `>=5.0.0 <7`; compatibility with every version in that range has not been established.
- A generated Prisma 7 client and a TypeScript project that includes the files being linted.
- A discoverable `schema.prisma` when enabling any of the four schema-dependent rules.

Prisma 8 and TypeScript 7 are outside the 0.1.0 support scope.

## Installation

In an existing Prisma 7 project, install the plugin and its linting tools as development dependencies:

```sh
npm install --save-dev @prismalyst/eslint-plugin eslint@^10 typescript@~6.0.3 typescript-eslint@^8
```

The plugin installs `@prismalyst/core` automatically. Generate your application's Prisma client using its existing Prisma configuration:

```sh
npx prisma generate
```

## Quick start

Create or update `eslint.config.mjs` at your project root:

```js
import prismalyst from '@prismalyst/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', 'coverage/**', '**/generated/**'],
  },
  {
    ...prismalyst.configs.all,
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

Ensure your `tsconfig.json` includes the application files you want to lint, then run:

```sh
npx eslint src
```

All Prismalyst rules require type information. The `all` preset registers the plugin and enables all 16 rules; it does not configure the TypeScript parser or project service. The example supplies both. When merging it into an existing configuration, preserve any parser options your project already needs.

The preset currently enables `no-floating-prisma-promise` as an error despite its known false positives. For the beta, consider disabling it as shown below until its behavior fits your codebase.

## Configure rules

Rule names use the `@prismalyst/` prefix. ESLint accepts `"off"`, `"warn"`, and `"error"` severities. Warnings normally allow the command to succeed; errors produce a failing exit status. `--max-warnings 0` also makes warnings fail CI.

### Change options, severity, or disable a rule

Add a `rules` property to the TypeScript configuration object in the quick start. Spread the preset's rules first to retain its other defaults:

```js
rules: {
  ...prismalyst.configs.all.rules,
  '@prismalyst/max-take': ['error', { max: 50 }],
  '@prismalyst/no-deep-offset-pagination': ['warn', { max: 500, min: -500 }],
  '@prismalyst/no-floating-prisma-promise': 'off',
  '@prismalyst/no-prisma-client-in-function': [
    'warn',
    {
      ignoredFiles: ['scripts/setup.ts'],
      allowedFunctionsNames: ['main', 'seed', 'createPrismaClient'],
      allowInTests: true,
    },
  ],
  '@prismalyst/no-disconnect-in-request-flow': [
    'warn',
    {
      ignoredFiles: ['src/shutdown.ts'],
      allowInTests: true,
    },
  ],
},
```

`ignoredFiles` in these two rules matches **case-sensitive path substrings**, not glob patterns. `allowedFunctionsNames` matches function declarations, not arrow-function variable names or class method names. Test exemptions match paths containing `.test.` or `.spec.`; a directory named `tests` alone is insufficient.

### Override rules for specific files

Append another object after the main TypeScript configuration. Later matching objects override earlier rule settings:

```js
{
  files: ['prisma/seed.ts', 'scripts/**/*.ts'],
  rules: {
    '@prismalyst/require-where-delete-many': 'off',
    '@prismalyst/no-disconnect-in-request-flow': 'off',
  },
},
```

These files must also match a configuration that supplies the TypeScript parser and type information. Include them in a suitable `tsconfig.json` when linting them. This example permits intentional bulk cleanup in seed and maintenance scripts; keep that exception scoped to the files that need it.

### Ignore files entirely

Add glob patterns to the standalone `ignores` object in the quick start, for example:

```js
{
  ignores: ['dist/**', 'coverage/**', '**/generated/**', 'legacy/**'],
},
```

This excludes matching files from ESLint entirely. Use a rule override when you want the other rules to continue checking those files.

### Suppress one intentional operation

Unless your ESLint configuration disables inline configuration comments, suppress a single report with a reason:

```ts
// eslint-disable-next-line @prismalyst/require-where-delete-many -- Reset disposable seed data.
await prisma.user.deleteMany();
```

### Enable only selected rules

To opt into individual rules, remove `...prismalyst.configs.all` from the main configuration object and add these properties instead. Keep its `files` and `languageOptions`:

```js
plugins: { '@prismalyst': prismalyst },
rules: {
  '@prismalyst/require-where-delete-many': 'error',
  '@prismalyst/require-where-update-many': 'error',
  '@prismalyst/max-take': ['warn', { max: 100 }],
},
```

## Rules and defaults

The following severities are the defaults in `configs.all`. All rules require TypeScript type information; only the four marked **Yes** also load the Prisma schema. Follow each link for examples and detailed limitations.

| Rule | Default | Requires schema | Checks |
| --- | --- | --- | --- |
| [no-unsafe-raw-sql](https://github.com/Prismalyst/core/blob/main/documentation/no-unsafe-raw-sql.md) | warn | No | Calls to unsafe raw SQL APIs. |
| [no-dynamic-raw-query](https://github.com/Prismalyst/core/blob/main/documentation/no-dynamic-raw-query.md) | warn | No | Interpolated templates passed to unsafe raw SQL APIs. |
| [no-unsafe-prisma-raw](https://github.com/Prismalyst/core/blob/main/documentation/no-unsafe-prisma-raw.md) | warn | No | Dynamic values passed to `Prisma.raw()`. |
| [no-floating-prisma-promise](https://github.com/Prismalyst/core/blob/main/documentation/no-floating-prisma-promise.md) | error | No | Query promises without a recognized await or return. |
| [require-where-delete-many](https://github.com/Prismalyst/core/blob/main/documentation/require-where-delete-many.md) | error | No | Missing, undefined, or empty `where` on `deleteMany`. |
| [require-where-update-many](https://github.com/Prismalyst/core/blob/main/documentation/require-where-update-many.md) | error | No | Missing, undefined, or empty `where` on `updateMany`. |
| [no-query-in-loop](https://github.com/Prismalyst/core/blob/main/documentation/no-query-in-loop.md) | warn | No | Queries in loops and selected array callbacks. |
| [max-take](https://github.com/Prismalyst/core/blob/main/documentation/max-take.md) | warn | No | Missing `take` or resolved values above the configured maximum. |
| [no-deep-offset-pagination](https://github.com/Prismalyst/core/blob/main/documentation/no-deep-offset-pagination.md) | warn | No | Resolved `skip` values outside the configured range. |
| [no-prisma-client-in-function](https://github.com/Prismalyst/core/blob/main/documentation/no-prisma-client-in-function.md) | warn | No | Client construction inside functions and methods, with exceptions. |
| [no-disconnect-in-request-flow](https://github.com/Prismalyst/core/blob/main/documentation/no-disconnect-in-request-flow.md) | warn | No | Disconnection outside explicitly allowed files. |
| [no-root-client-in-transaction](https://github.com/Prismalyst/core/blob/main/documentation/no-root-client-in-transaction.md) | error | No | Root-client calls inside interactive transactions. |
| [no-unindexed-filter](https://github.com/Prismalyst/core/blob/main/documentation/no-unindexed-filter.md) | warn | Yes | Top-level filter keys absent from model indexes. |
| [unstable-pagination](https://github.com/Prismalyst/core/blob/main/documentation/unstable-pagination.md) | warn | Yes | Non-unique ordering when `take` and `orderBy` are present. |
| [warn-cascade-delete](https://github.com/Prismalyst/core/blob/main/documentation/warn-cascade-delete.md) | warn | Yes | Deletes of models with incoming cascade relations. |
| [limit-relation-loading](https://github.com/Prismalyst/core/blob/main/documentation/limit-relation-loading.md) | warn | Yes | Loaded list relations without their own `take`. |

Four rules accept options. Their defaults are:

| Rule | Default options |
| --- | --- |
| `max-take` | `{ max: 100 }` |
| `no-deep-offset-pagination` | `{ max: 1000, min: -1000 }` |
| `no-prisma-client-in-function` | `{ ignoredFiles: [], allowedFunctionsNames: ['main', 'seed'], allowInTests: true }` |
| `no-disconnect-in-request-flow` | `{ ignoredFiles: [], allowInTests: true }` |

## Schema discovery

Schema-dependent rules load metadata lazily when they encounter a recognized Prisma expression. Importing the plugin or using only schema-free rules does not require a schema.

The plugin searches for the first file named `schema.prisma` under the current working directory, excluding `node_modules`, `.git`, `dist`, and `build`. Run ESLint from the application directory that contains your intended schema. Schema changes are detected using the file's modification time.

There is currently no schema-path option or multi-file schema support. Projects with several schemas can select the wrong one through automatic discovery. Schema-dependent rules throw when discovery, reading, or parsing fails.

To use the other rules without schema discovery, add these overrides to the main configuration's `rules` property:

```js
'@prismalyst/no-unindexed-filter': 'off',
'@prismalyst/unstable-pagination': 'off',
'@prismalyst/warn-cascade-delete': 'off',
'@prismalyst/limit-relation-loading': 'off',
```

## Known limitations

- **Client recognition depends on generated paths.** The engine currently looks for `.prisma/client` or `generated/prisma` in declaration paths. Model resolution also expects generated model files under `prisma/models`. Custom client output layouts can cause missed queries or incomplete schema analysis.
- **Promise handling is approximate.** `.catch()` chains, implicit arrow returns, and queries awaited later can produce false positives. An enclosing `await` can also hide an unhandled query inside a callback.
- **Index checks are heuristics.** Logical keys such as `AND`, `OR`, and `NOT` can produce warnings even when their filters use indexes. Compound-index prefixes and actual query plans are not analyzed.
- **Pagination limits are partial.** `max-take` compares signed values, so a large negative `take` bypasses the upper limit. Unknown runtime values are not checked against numeric limits.
- **A nonempty filter is not proof of safety.** For example, the bulk-operation checks accept `{ where: { id: undefined } }` because the filter is not empty.
- **SQL analysis is limited.** The engine recognizes call and construction expressions, not tagged template expressions directly. Dynamic values that cannot be resolved may be skipped or reported conservatively.
- **No automatic fixes are provided.** Review the query and choose a change appropriate for your application.

## Troubleshooting

**ESLint asks for type information or says a file is outside the project:** check that the configuration includes `projectService: true`, uses the TypeScript parser, and that an appropriate `tsconfig.json` includes the file. Avoid linting generated clients and build output.

**The plugin cannot find a Prisma schema:** check the directory from which ESLint runs and the schema-discovery rules above. Disable the four schema rules if the project cannot use automatic discovery.

**Queries are not recognized:** generate the Prisma client, ensure your imports resolve correctly, and check the supported generated-path conventions. Prisma-looking method names on unrelated objects are insufficient for recognition.

## Development

Use Node.js 24 and npm. The current source build also references types from a sibling `prismalyst-core/dist` directory, so check out and build core alongside the plugin, as [CI](.github/workflows/ci.yml) does. The published core is also declared as an npm dependency.

From the plugin directory, install dependencies and run the existing checks:

```sh
npm ci
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

`npm run test:watch` runs tests in watch mode. `npm run pack:check` previews package contents. The build emits ESM, CommonJS, and TypeScript declarations to `dist`.

## License

[MIT](LICENSE).
