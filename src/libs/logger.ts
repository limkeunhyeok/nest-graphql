import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const getWinstonLogger = () => {
  return WinstonModule.createLogger({
    level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.json({ space: 2 }),
    ),
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.json({ space: 2 }),
        ),
      }),
    ],
  });
};
