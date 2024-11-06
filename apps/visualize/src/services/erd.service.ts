import { isEmptyObject } from '@common/utils';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Model, SchemaType } from 'mongoose';
import { SpelunkedTree } from 'nestjs-spelunker';
import * as path from 'path';

export interface FieldInfo {
  name: string;
  type: string;
  isRequired: string;
  ref?: string;
}

export interface MappingInfo {
  collection: string;
  fields: FieldInfo[];
}

@Injectable()
export class ErdService {
  writeJsonFile(data: string, filename: string) {
    fs.writeFileSync(path.join(process.cwd(), filename), data);
    return;
  }

  writeMermaidFile(data: MappingInfo[], filename) {
    const contents = this.generateMermaidERD(data);
    fs.writeFileSync(path.join(process.cwd(), filename), contents);
    return;
  }

  getAllModels(tree: SpelunkedTree[]) {
    return tree
      .filter((moduleInfo) => moduleInfo.name === 'MongooseModule')
      .map((moduleInfo) => moduleInfo.exports)
      .flat(2);
  }

  getMappingInfos(model: Model<any>): MappingInfo {
    const collection = model.collection.name;
    const fields = this.convertToJson(model.schema.paths, collection);
    return {
      collection,
      fields,
    };
  }

  private generateMermaidERD(mappingInfos: MappingInfo[]): string {
    const lines: string[] = ['erDiagram'];

    mappingInfos.forEach((model) => {
      const tableName = model.collection;

      // 테이블 생성
      lines.push(`  ${tableName} {`);
      model.fields.forEach((field) => {
        if (field.name === '_id') {
          lines.push(`    ${field.type} ${field.name} PK`);
          return;
        }

        if (field.ref) {
          lines.push(`    ${field.type} ${field.name} FK`);
          return;
        }

        if (field.isRequired) {
          lines.push(`    ${field.type} ${field.name} "required"`);
          return;
        }

        lines.push(`    ${field.type} ${field.name}`);
      });
      lines.push('  }');
      lines.push('');

      // 관계 설정
      model.fields
        .filter((field) => field.ref)
        .forEach((field) => {
          const relation = field.isRequired ? '||--||' : '||--o|';
          lines.push(
            `  ${tableName} ${relation} ${field.ref} : "${field.name}"`,
          );
        });
    });

    return lines.join('\n');
  }

  private convertToJson(
    fields: {
      [key: string]: SchemaType<any, any>;
    },
    collection: string,
  ): FieldInfo[] {
    const answer = [];
    if (collection === 'posts') {
      console.log(fields['objectField'].schema.paths);
      // console.log(fields.arrayOfObject.instance);
      // console.log('---------------------------------------------');
      // console.log(fields.arrayOfObject['schema']['paths']);
      // console.log('---------------------------------------------');
      // console.log(fields.arrayOfString['$embeddedSchemaType'].instance);
    }
    const keys = Object.keys(fields);

    for (const key of keys) {
      if (fields[key].path === '__v') {
        continue;
      }

      const propertyInfo = this.getPropertyInfo(fields[key]);
      answer.push(propertyInfo);
      // const name = fields[key].path;
      // const type = fields[key].instance;
      // const isRequired = fields[key].isRequired ? true : false;
      // const options = fields[key].options;

      // if (!isEmptyObject(options) && options.ref) {
      //   answer.push({
      //     name,
      //     type,
      //     isRequired,
      //     ref: options.ref,
      //   });
      //   continue;
      // }

      // answer.push({
      //   name,
      //   type,
      //   isRequired,
      // });
    }
    return answer;
  }

  private getPropertyInfo(field: SchemaType<any, any>) {
    const name = field.path;
    const type = field.instance;
    const isRequired = field.isRequired ? true : false;
    const options = field.options;

    const propertyInfo = {
      name,
      type,
      isRequired,
    };

    if (!isEmptyObject(options) && options.ref) {
      propertyInfo['ref'] = options.ref;
    }

    if (type === 'Array') {
      propertyInfo['array'] = this.getPropertyInfoForArray(field);
    }

    if (type === 'Embedded') {
      propertyInfo['embedded'] = this.getPropertyInfoForEmbedded(field);
    }

    return propertyInfo;
  }

  private getPropertyInfoForArray(field: SchemaType<any, any>) {
    if (!field.schema) {
      return [field['$embeddedSchemaType'].instance];
    }

    return Object.keys(field.schema.paths).map((key) => {
      const name = key;
      const type = field.schema.paths[key].instance;
      const isRequired = field.schema.paths[key].options.isRequired
        ? true
        : false;

      return {
        name,
        type,
        isRequired,
      };
    });
  }

  private getPropertyInfoForEmbedded(field: SchemaType<any, any>) {
    return Object.keys(field.schema.paths).map((key) => {
      const name = key;
      const type = field.schema.paths[key].instance;
      const isRequired = field.schema.paths[key].options.isRequired
        ? true
        : false;

      return {
        name,
        type,
        isRequired,
      };
    });
  }
}
