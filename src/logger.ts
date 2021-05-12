import path from 'path';
import winston from 'winston';
import { ILoggerConfig } from './configurations';
import { isUndefinedOrNull, isStringAndNotEmpty } from './helpers';

export interface ILogger {
  info(message?: string, details?: any): void;
  error(message?: string, details?: any): void;
  warn(message?: string, details?: any): void;
  debug(message?: string, details?: any): void;
}

export class Winston implements ILogger {
  service: string;
  level: string;
  transportsToConsole: boolean;
  transportsToFile: boolean;
  showLevel: boolean;
  showTime: boolean;
  Logger: winston.Logger;

  constructor(config: ILoggerConfig) {
    this.service = config.service;
    this.level = config.level;
    this.transportsToConsole = config.transportsToConsole;
    this.transportsToFile = config.transportsToFile;
    this.showLevel = true;
    this.showTime = true;

    const loggerOptions = {
      level: this.level,
      defaultMeta: { service: this.service }
    };

    this.Logger = winston.createLogger(loggerOptions);
    this.create();
  }

  private create() {
    if (this.transportsToConsole) {
      this.Logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(this.createFormat())
          )
        })
      );
    }

    if (this.transportsToFile) {
      this.Logger.add(
        new winston.transports.File({
          filename: path.resolve('logs/error.log'),
          level: 'error',
          maxsize: 5242880, //5MB
          maxFiles: 5,
          format: winston.format.combine(winston.format.printf(this.createFormat()))
        })
      );
      this.Logger.add(
        new winston.transports.File({
          filename: path.resolve('logs/combined.log'),
          maxsize: 5242880, //5MB
          maxFiles: 5,
          format: winston.format.combine(winston.format.printf(this.createFormat()))
        })
      );
    }
  }

  private createFormat() {
    return (logObject: any) => {
      if (!this.showLevel) {
        logObject = this.deleteLogLevel(logObject);
      }

      if (this.showTime) {
        logObject = this.addLogTime(logObject);
      }

      let message = logObject.message;

      if (isStringAndNotEmpty(logObject.level)) {
        message = `${logObject.level} ${message}`;
      }

      if (isStringAndNotEmpty(logObject.createdDate)) {
        message = `${logObject.createdDate} ${message}`;
      }

      if (isStringAndNotEmpty(logObject.errorCode)) {
        message = `${message}\nerrorCode: ${logObject.errorCode}`;
      }

      if (isStringAndNotEmpty(logObject.errorDetails)) {
        message = `${message}\nerrorDetails: ${logObject.errorDetails}`;
      } else {
        if (typeof logObject.errorDetails === 'object') {
          message = `${message}\nerrorDetails: ${JSON.stringify(logObject.errorDetails)}`;
        }
      }

      if (!isUndefinedOrNull(logObject.details)) {
        if (!isUndefinedOrNull(logObject.details.message)) {
          message = `${message}\nDetail: ${logObject.details.message}`;
        }
        if (!isUndefinedOrNull(logObject.details.platform)) {
          message = `${message}\nPlatform: ${logObject.details.platform}`;
        }
      }

      if (!isUndefinedOrNull(logObject.stack)) {
        message = `${message}\n${logObject.stack}`;
      }

      return message;
    };
  }

  private deleteLogLevel(logObject: any): any {
    delete logObject.level;
    return logObject;
  }

  private addLogTime(logObject: any) {
    logObject.createdDate = new Date().toISOString();
    return logObject;
  }

  info(message: string, details?: any): void {
    this.Logger.info(message, details);
  }

  error(message: string, details?: any): void {
    this.Logger.error(message, details);
  }
  warn(message: string, details?: any): void {
    this.Logger.warn(message, details);
  }
  debug(message: string, details?: any): void {
    this.Logger.debug(message, details);
  }
}
