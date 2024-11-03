import { NestFactory } from '@nestjs/core';
import { Command, CommandRunner, Option } from 'nest-commander';
import { SpelunkerModule } from 'nestjs-spelunker';
import { MermaidService } from '../services/mermaid.service';
import { ProjectService } from '../services/project.service';

@Command({
  name: 'dependency:graph',
  description: 'visualize module depenency',
})
export class DependencyGraphCommand extends CommandRunner {
  constructor(
    private readonly mermaidService: MermaidService,
    private readonly projectService: ProjectService,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const AppModule = this.projectService.getAppModule(
      options.type,
      options.project,
    );

    const message = `Draw a dependency graph
      type: ${options.type}
      project: ${options.proejct}
    `;

    console.log(message);

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

    this.mermaidService.writeMermaidFile(options.name, edges);

    console.log('Completed drawing dependency graph');

    return;
  }

  @Option({
    flags: '-t, --type [type]',
    description: 'A basic types parser',
    defaultValue: 'app',
  })
  parseTypes(val: string) {
    return val;
  }

  @Option({
    flags: '-p, --project [project]',
    description: 'A basic project parser',
    defaultValue: 'hexagonal',
  })
  parseProject(val: string) {
    return val;
  }

  @Option({
    flags: '-n, --name [name]',
    description: 'A basic name parser',
    defaultValue: 'hexagonal.mmd',
  })
  parseName(val: string) {
    return val;
  }
}
