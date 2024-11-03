import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { SpelunkedEdge } from 'nestjs-spelunker';
import * as path from 'path';

@Injectable()
export class MermaidService {
  writeMermaidFile(
    filename: string,
    edges: SpelunkedEdge[],
    direction: string = 'TB',
  ) {
    const mmdFilename = this.getMmdFilename(filename);
    const contents = this.convertToMermaid(edges, direction);
    fs.writeFileSync(path.join(process.cwd(), mmdFilename), contents);
    return;
  }

  private convertToMermaid(
    edges: SpelunkedEdge[],
    direction: string = 'TB',
  ): string {
    if (!this.isValidDirection(direction)) {
      throw Error('Invalid direction.');
    }

    const mermaidEdges: string[] = edges.map(
      ({ from, to }) => `  ${from.module.name}-->${to.module.name}`,
    );

    const contents: string = [`graph ${direction}`, ...mermaidEdges].join('\n');
    return contents;
  }

  private getMmdFilename(filename: string): string {
    if (!filename) {
      throw new Error('The filename is empty.');
    }

    const extension = filename.split('.').pop()?.toLowerCase();

    if (!extension) {
      return `${filename}.mmd`;
    }

    if (extension === 'mmd') {
      return filename;
    }

    throw new Error('Invalid extension.');
  }

  private isValidDirection(direction: string) {
    const validDirections = ['TB', 'BT', 'LR', 'RL'];
    return validDirections.includes(direction);
  }
}
