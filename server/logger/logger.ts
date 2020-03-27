/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import * as winston from 'winston';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {Options} from 'morgan';

const customFormat = winston.format.printf(({level, message, label, timestamp}) => {
  return `[${level}] [${timestamp}-${label}] ${message}`;
});

export class CustomLogger {

  private static _instance: CustomLogger;
  private _logger: winston.Logger;

  static bootstrap(): CustomLogger {
    if (this._instance) {
      return this._instance;
    } else {
      this._instance = new CustomLogger();
      this._instance.init();
      return this._instance;
    }
  }

  private static skipLog(req: express.Request): boolean {
    let url = req.url;
    if (url.indexOf('?') > 0) {
      url = url.substr(0, url.indexOf('?'));
    }
    return !!url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/ig);
  }

  info(message: string): void {
    this._logger.info(message);
  }

  error(message: string): void {
    this._logger.error(message);
  }

  getOptions(): Options {
    return {
      skip: CustomLogger.skipLog,
      stream: {
        write: (message) => {
          this._logger.info(message);
        }
      }
    };
  }

  private init(): void {
    const logDir = path.resolve(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    const options = {
      file: {
        level: 'info',
        filename: __dirname + '/logs/app.log',
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        prettyPrint: true,
        colorize: false
      },
      console: {
        level: 'info',
        handleExceptions: true,
        json: false,
        prettyPrint: true,
        colorize: true
      },
    };
    this._logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.label({label: `Inspector ${process.env.NODE_ENV.toLocaleUpperCase()} Server`}),
        winston.format.timestamp(),
        customFormat
      ),
      transports: [
        new (winston.transports.Console)(options.console),
        new (winston.transports.File)(options.file)
      ],
      exitOnError: false, // do not exit on handled exceptions
    });
  }
}




