import { Module } from '@nestjs/common';
import { DependencyGraphCommand } from './commands/dependency-graph.command';
import { ModelInspectCommand } from './commands/model-inspect.command';
import { ErdService } from './services/erd.service';
import { MermaidService } from './services/mermaid.service';
import { ModelParserService } from './services/model-parser.service';
import { ProjectService } from './services/project.service';

@Module({
  imports: [],
  providers: [
    DependencyGraphCommand,
    ModelInspectCommand,
    MermaidService,
    ProjectService,
    ErdService,
    ModelParserService,
  ],
  exports: [],
})
export class AppModule {}
