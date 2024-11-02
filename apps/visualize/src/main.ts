import { NestFactory } from '@nestjs/core';
import { SpelunkerModule } from 'nestjs-spelunker';
import { getAppModule, isValidProjectName, isValidType } from './commands';
import { writeMermaidFile } from './files';

// nest start visualize -- {type} {projectName}
// Hexa AppModule과 Layered AppModule을 import 하는 과정에서
// 각 모듈의 GraphQL의 타입이 글로벌하게 적용되어, schema.gql에 반영됨
// ex: hexa에선 layered의 graphql type이 들어감

async function bootstrap() {
  const [, , type, target] = process.argv;

  if (!isValidType(type)) {
    throw Error('Invalid type.');
  }

  if (!isValidProjectName(target)) {
    throw Error('Invalid proejct name.');
  }

  const AppModule = getAppModule(type, target);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  // console.log(
  //   util.inspect(SpelunkerModule.explore(app), {
  //     depth: Infinity,
  //     colors: true,
  //   }),
  // );

  const tree = SpelunkerModule.explore(app, {
    ignoreImports: [
      /^MongooseModule/i,
      /^ConfigModule/i,
      /^MongooseCoreModule/i,
      /^ConfigHostModule/i,
    ],
  });
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);

  writeMermaidFile(`${target}.mmd`, edges);

  app.close();
}
bootstrap();
