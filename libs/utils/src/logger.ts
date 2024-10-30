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
          // 만약 로그에 컬러를 입히고 싶으면 아래 주석 해제
          // json 로그 전체에 색을 입힘
          // json의 일부 property만 색깔 변경하는 방법은 없는듯?
          // 대충 원리는 콘솔에 찍히는건 json이라고 한들 내부적으로 json을 stringfy 한듯
          // winston.format.colorize({ all: true }),
        ),
      }),
    ],
  });
};
