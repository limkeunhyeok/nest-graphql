import { isEmptyObject } from '@common/utils';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { SchemaType } from 'mongoose';
import * as path from 'path';

@Injectable()
export class ErdService {
  writeJsonFile(data: any) {
    fs.writeFileSync(path.join(process.cwd(), 'schema.json'), data);
    return;
  }

  convertToJson(fields: { [key: string]: SchemaType<any, any> }) {
    const answer = [];
    const keys = Object.keys(fields);

    for (const key of keys) {
      if (fields[key].path === '__v') {
        continue;
      }

      const name = fields[key].path;
      const type = fields[key].instance;
      const isRequired = fields[key].isRequired ? true : false;
      const options = fields[key].options;

      if (!isEmptyObject(options) && options.ref) {
        answer.push({
          name,
          type,
          isRequired,
          ref: options.ref,
        });
        continue;
      }

      answer.push({
        name,
        type,
        isRequired,
      });
    }
    return answer;
  }
}
