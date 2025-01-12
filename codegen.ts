import type { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: './apps/api/src/schema.gql',
  generates: {
    './generate/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
};
export default config;
