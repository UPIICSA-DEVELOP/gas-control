/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

export class Logger {

  constructor(){

  }

  public init(): any{
    const winston = require('winston');

    const options = {
      file: {
        level: 'info',
        filename: __dirname + '/logs/app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
      },
    };

    const logger = winston.createLogger({
      transports: [
        new (winston.transports.Console)(options.console),
        new (winston.transports.File)(options.file)
      ],
      exitOnError: false, // do not exit on handled exceptions
    });


    logger.stream = {
      write: function(message, encoding) {
        logger.info(message);
      },
    };


    return logger;
  }

}




