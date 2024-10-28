import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const LogLevel = {
  SILLY: 'silly',
  DEBUG: 'debug',
  VERBOSE: 'verbose',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const getWinstonLogger = () => {
  return WinstonModule.createLogger({
    level: process.env.NODE_ENV === 'prod' ? LogLevel.INFO : LogLevel.SILLY,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.json({ space: 2 }),
    ),
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'prod' ? LogLevel.INFO : LogLevel.SILLY,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.json({ space: 2 }),
        ),
      }),
    ],
  });
};
