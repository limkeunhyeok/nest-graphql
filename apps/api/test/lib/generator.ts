import * as fs from 'fs';
import { parse } from 'graphql';

// NOTE: 테스트를 위한 schema 자동으로 매핑하는 방법
// 1. parse 함수를 통해 데이터를 파싱 후 문자열로 리턴 -> 머리좀 굴리면 될 듯? 다만, 이름을 통일해서 output을 구분해야함
// 2. codegen을 통한 데이터 파싱 -> type만 리턴하나, 이것도 좀 찾아보면 비슷하게 될 듯? 다만, schema.gql을 생성해야함.
export function generateQueries(schemaPath: string): Record<string, string> {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const documentNode = parse(schema);

  const queries: Record<string, string> = {};

  console.log(JSON.stringify(documentNode.definitions[0]));

  documentNode.definitions.forEach((def) => {
    if (def.kind === 'ObjectTypeDefinition' && def.name.value === 'Query') {
      def.fields?.forEach((field) => {
        const args =
          field.arguments
            ?.map((arg) => `${arg.name.value}: $${arg.name.value}!`)
            .join(', ') || '';

        // @ts-ignore
        const argsDef =
          field.arguments
            ?.map(
              (arg) =>
                `$${arg.name.value}: ${(arg.type as any).type.name.value}`,
            )
            .join(', ') || '';

        const query = `
          query ${field.name.value}(${argsDef}) {
            ${field.name.value}(${args}) {
              # Add fields here
            }
          }
        `;
        queries[field.name.value] = query;
      });
    }
  });

  return queries;
}
