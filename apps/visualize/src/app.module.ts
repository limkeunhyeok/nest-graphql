import { Module } from '@nestjs/common';
import { DependencyGraphCommand } from './commands/dependency-graph.command';
import { MermaidService } from './services/mermaid.service';
import { ProjectService } from './services/project.service';

@Module({
  imports: [],
  providers: [DependencyGraphCommand, MermaidService, ProjectService],
  exports: [],
})
export class AppModule {}
