import { isEmptyObject } from '@common/utils';
import { Injectable } from '@nestjs/common';
import { Model, SchemaType } from 'mongoose';
import { SpelunkedTree } from 'nestjs-spelunker';

export interface FieldInfo {
  name: string;
  type: string;
  isRequired: boolean;
  ref?: string;
  array?: FieldInfo[] | string[];
  embedded?: FieldInfo[];
}

export interface MappingInfo {
  collection: string;
  fields: FieldInfo[];
}

@Injectable()
export class ModelParserService {
  getAllModels(tree: SpelunkedTree[]) {
    return Array.from(
      new Set(
        tree
          .filter(({ name }) => name === 'MongooseModule')
          .flatMap(({ exports }) => exports),
      ),
    );
  }

  getMappingInfo(model: Model<any>): MappingInfo {
    const collection = model.collection.name;
    const fields = this.getFields(model.schema.paths);
    return {
      collection,
      fields,
    };
  }

  private getFields(fields: {
    [key: string]: SchemaType<any, any>;
  }): FieldInfo[] {
    return Object.keys(fields)
      .filter((key) => fields[key].path !== '__v')
      .map((key) => this.getField(fields[key]));
  }

  private getField(field: SchemaType<any, any>) {
    const propertyInfo = this.getPropertyInfo(field);

    if (propertyInfo.type === 'Array') {
      propertyInfo['array'] = this.getPropertyInfoForArray(field);
    }

    if (propertyInfo.type === 'Embedded') {
      propertyInfo['embedded'] = this.getPropertyInfoForEmbedded(field);
    }
    return propertyInfo;
  }

  private getPropertyInfoForEmbedded(field: SchemaType<any, any>) {
    return Object.keys(field.schema.paths).map((key) =>
      this.getPropertyInfo(field.schema.paths[key]),
    );
  }

  private getPropertyInfoForArray(field: SchemaType<any, any>) {
    if (!field.schema) {
      return [field['$embeddedSchemaType'].instance];
    }

    return Object.keys(field.schema.paths).map((key) =>
      this.getPropertyInfo(field.schema.paths[key]),
    );
  }

  private getPropertyInfo(field: SchemaType<any, any>) {
    const name = field.path;
    const type = field.instance;
    const isRequired = this.isRequired(field);
    const options = field.options;

    const propertyInfo = {
      name,
      type,
      isRequired,
    };

    if (!isEmptyObject(options) && options.ref) {
      propertyInfo['ref'] = options.ref;
    }

    return propertyInfo;
  }

  private isRequired(field: SchemaType<any, any>) {
    if ('isRequired' in field) {
      return field.isRequired;
    }

    if ('isRequired' in field.options) {
      return field.options.isRequired;
    }

    return false;
  }
}
