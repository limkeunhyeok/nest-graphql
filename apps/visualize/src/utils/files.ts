import * as fs from 'fs';
import { SpelunkedEdge } from 'nestjs-spelunker';
import * as path from 'path';

export function isValidDirection(direction: string) {
  const validDirections = ['TB', 'BT', 'LR', 'RL'];
  return validDirections.includes(direction);
}

export function convertToMermaid(
  edges: SpelunkedEdge[],
  direction: string = 'TB',
): string {
  if (!isValidDirection(direction)) {
    throw Error('Invalid direction.');
  }

  const mermaidEdges: string[] = edges.map(
    ({ from, to }) => `  ${from.module.name}-->${to.module.name}`,
  );

  const contents: string = [`graph ${direction}`, ...mermaidEdges].join('\n');
  return contents;
}

export function getMmdFilename(filename: string): string {
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

export function writeMermaidFile(
  filename: string,
  edges: SpelunkedEdge[],
  direction: string = 'TB',
) {
  const mmdFilename = getMmdFilename(filename);
  const contents = convertToMermaid(edges, direction);
  fs.writeFileSync(path.join(process.cwd(), mmdFilename), contents);
  return;
}
