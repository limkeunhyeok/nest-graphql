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
      type: ${options.type}
      project: ${options.project}
    `;

    console.log(message);

    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });

    const tree = SpelunkerModule.explore(app);
    const allModelList = tree
      .filter((moduleInfo) => moduleInfo.name === 'MongooseModule')
      .map((moduleInfo) => moduleInfo.exports)
      .flat(2);

    const answer = [];
    for (const modelName of allModelList) {
      const model = app.get<Model<any>>(modelName);

      const collection = model.collection.name;
      const fields = this.erdService.convertToJson(model.schema.paths);
      answer.push({
        collection,
        fields,
      });
    }

    this.erdService.writeJsonFile(JSON.stringify(answer));

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
    defaultValue: 'hexagonal.mmd',
  })
  parseName(val: string) {
    return val;
  }
}
