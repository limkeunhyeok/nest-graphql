import {
  AUTH_SOURCE,
  MONGO_DB,
  MONGO_HOST,
  MONGO_NAME,
  MONGO_PASS,
  MONGO_PORT,
  MONGO_USER,
} from '@common/core/constants/database.const';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(this.constructor.name);
  }

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `${MONGO_DB}://${this.configService.get(
        MONGO_HOST,
      )}:${this.configService.get(MONGO_PORT)}/${this.configService.get(
        MONGO_NAME,
      )}`,
      authSource: AUTH_SOURCE,
      user: this.configService.get(MONGO_USER),
      pass: this.configService.get(MONGO_PASS),
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => {
          this.logger.log('MongoDB connected');
        });

        connection.on('disconnected', () => {
          this.logger.warn('MongoDB disconnected');
        });

        connection.on('reconnected', () => {
          this.logger.log('MongoDB reconnected');
        });

        connection.on('error', (error) => {
          this.logger.error(`MongoDB connection error: ${error}`);
        });

        connection.on('close', () => {
          this.logger.log('MongoDB connection closed');
        });

        return connection;
      },
    };
  }
}
