import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'fs';
import { Model } from 'mongoose';
import { Command, CommandRunner, Option } from 'nest-commander';
import { SpelunkerModule } from 'nestjs-spelunker';
import * as path from 'path';
import { ErdService } from '../services/erd.service';
import { ModelParserService } from '../services/model-parser.service';
import { ProjectService } from '../services/project.service';

@Command({
  name: 'model:inspect',
  description: 'visualize model schema',
})
export class ModelInspectCommand extends CommandRunner {
  constructor(
    private readonly modelParserService: ModelParserService,
    private readonly erdService: ErdService,
    private readonly projectService: ProjectService,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const AppModule = this.projectService.getAppModule(options.project);

    const message = `Draw a mongo erd
      project: ${options.project}
      name: ${options.name}
    `;

    console.log(message);

    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });

    const tree = SpelunkerModule.explore(app);
    const allModels = this.modelParserService.getAllModels(tree);

    const mappingInfos = allModels.map((modelName) => {
      const model = app.get<Model<any>>(modelName);
      return this.modelParserService.getMappingInfo(model);
    });
    writeFileSync(
      path.join(process.cwd(), 'models.json'),
      JSON.stringify(mappingInfos),
    );

    const contents = this.erdService.generateMermaidERD(mappingInfos);
    writeFileSync(path.join(process.cwd(), 'models.mmd'), contents);

    console.log('Completed drawing schema erd');

    app.close();
    return;
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
    defaultValue: 'models.json',
  })
  parseName(val: string) {
    return val;
  }
}
