import { NestFactory } from '@nestjs/core';
import { Model } from 'mongoose';
import { Command, CommandRunner, Option } from 'nest-commander';
import { SpelunkerModule } from 'nestjs-spelunker';
import { ErdService } from '../services/erd.service';
import { ProjectService } from '../services/project.service';

@Command({
  name: 'model:inspect',
  description: 'visualize model schema',
})
export class ModelInspectCommand extends CommandRunner {
  constructor(
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
    const allModels = this.erdService.getAllModels(tree);

    const mappingInfos = allModels.map((modelName) => {
      const model = app.get<Model<any>>(modelName);
      return this.erdService.getMappingInfos(model);
    });

    this.erdService.writeJsonFile(JSON.stringify(mappingInfos), options.name);

    this.erdService.writeMermaidFile(mappingInfos, 'models.mmd');

    console.log('Completed drawing schema erd');
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
