/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */


import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';
import {CustomLogger} from './logger/logger';
import {HandlerError} from './handler/handlerError';

enableProdMode();

export class Server {

  private readonly DIR: string = path.resolve(__dirname, 'browser');
  private _port: number | string;
  public app: express.Application;


  constructor() {
    this.app = express();
    this.initConfig();
  }

  private static globalHeaders(req: any, res: any, next: any): void {
    res.header('X-Powered-By', 'MapLander');
    next();
  }

  public static bootstrap(): Server {
    return new Server();
  }

  private initConfig(): void {
    this._port = process.env.PORT || 8090;
    this.app.use(Server.globalHeaders);
    this.createLogger();
    this.app.use(compression({level: 9}));
    this.app.use('/.well-known', express.static(__dirname + '/.well-known'));
    this.app.use(express.static(this.DIR));
    this.router();
  }

  private createLogger(): void {
    const morgan = require('morgan');
    const logger = CustomLogger.bootstrap();
    this.app.use(morgan('combined', logger.getOptions()));
  }

  private initHandlers(): void {
    HandlerError.exceptionAndRejection();
    this.app.use(HandlerError.errors);
  }

  private router(): void {
    this.app.get('*', (req, res) => {
      res.redirect('/#' + req.url);
    });
    this.initHandlers();
    this.initServer();
  }

  private initServer(): void {
    this.app.listen(this._port, () => {
      console.log(`Current environment ${process.env.NODE_ENV}`);
      console.log(`Listening server lite on http://localhost:${this._port}`);
    });
  }

}

Server.bootstrap();
