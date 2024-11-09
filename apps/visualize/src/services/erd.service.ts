import { Injectable } from '@nestjs/common';
import { MappingInfo } from './model-parser.service';

@Injectable()
export class ErdService {
  generateMermaidERD(mappingInfos: MappingInfo[]): string {
    let lines: string[] = ['erDiagram'];

    mappingInfos.forEach((model) => {
      const tableName = model.collection;

      // 테이블 생성
      lines.push(`  ${tableName} {`);
      model.fields.forEach((field, index, filteredArr) => {
        const isLast = filteredArr.length === index ? true : false;

        if (field.name === '_id' && !isLast) {
          lines.push(`    ${field.type} ${field.name} PK`);
          return;
        }

        if (field.ref && !isLast) {
          lines.push(`    ${field.type} ${field.name} FK`);
          return;
        }

        if (field.isRequired && !isLast) {
          lines.push(`    ${field.type} ${field.name} "required"`);
          return;
        }

        lines.push(`    ${field.type} ${field.name}`);
      });
      lines.push('  }');
      lines.push('');

      // array
      lines = lines.concat(this.generateArrayLines(model, tableName));

      // embedded
      lines = lines.concat(this.generateEmbeddedLines(model, tableName));

      // 관계 설정
      lines = lines.concat(this.generateRelationshipLines(model, tableName));
    });

    return lines.join('\n');
  }

  private generateArrayLines(model: MappingInfo, tableName: string): string[] {
    const lines: string[] = [];
    model.fields
      .filter((field) => field.array)
      .filter((field) => typeof field.array[0] !== 'string')
      .forEach((field) => {
        lines.push(`  ${field.name} {`);

        field.array.forEach((f) => {
          if (field.isRequired) {
            console.log(field);
            lines.push(`    ${f.type} ${f.name} "required"`);
            return;
          }
          lines.push(`    ${f.type} ${f.name}`);
        });

        lines.push('  }');
        lines.push('');

        const relation = field.isRequired ? '||--||' : '||--o|';
        lines.push(`  ${tableName} ${relation} ${field.name} : "field"`);
      });
    return lines;
  }

  private generateEmbeddedLines(
    model: MappingInfo,
    tableName: string,
  ): string[] {
    const lines: string[] = [];
    model.fields
      .filter((field) => field.embedded)
      .forEach((field) => {
        lines.push(`  ${field.name} {`);

        field.embedded.forEach((f) => {
          if (field.isRequired) {
            lines.push(`    ${f.type} ${f.name} "required"`);
            return;
          }
          lines.push(`    ${f.type} ${f.name}`);
        });

        lines.push('  }');
        lines.push('');

        const relation = field.isRequired ? '||--||' : '||--o|';
        lines.push(`  ${tableName} ${relation} ${field.name} : "field"`);
      });
    return lines;
  }

  private generateRelationshipLines(
    model: MappingInfo,
    tableName: string,
  ): string[] {
    return model.fields
      .filter((field) => field.ref)
      .map((field) => {
        const relation = field.isRequired ? '||--||' : '||--o|';
        return `  ${tableName} ${relation} ${field.ref} : "${field.name}"`;
      });
  }
}
