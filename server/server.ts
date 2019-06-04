/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */


import 'zone.js/dist/zone-node'
import {enableProdMode} from '@angular/core';
import {EndPoints} from '../api/endpoints';
import * as express from 'express';
import * as path from "path";
import {Logger} from './logger';
import * as compression from 'compression';
import {APIError} from '../api/commons/class';

enableProdMode();

export class Server {

  public app: express.Application;
  private _port: number | string;
  private static DIR: string = path.resolve(__dirname, 'browser');


  constructor(){
    this.app = express();
    this.initConfig();
  }

  public static bootstrap(): Server {
    return new Server();
  }

  private initConfig(): void{
    this._port = process.env.PORT || 8090;
    this.app.use(Server.globalHeaders);
    this.createLogger();
    this.app.use(compression({level: 9}));
    this.app.use('/.well-known', express.static(__dirname + '/.well-known'));
    this.app.use(express.static(Server.DIR));
    this.configEndPoints();
    this.initHandlers();
    this.router();
  }

  private createLogger(): void{
    const morgan = require('morgan');
    const logger = new Logger();
    this.app.use(morgan('combined', { stream: logger.init().stream, skip: Server.skipLog }));
  }

  private static skipLog(req, res): boolean{
    let url = req.url;
    if(url.indexOf('?')>0)
      url = url.substr(0,url.indexOf('?'));
    return url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/ig);
  }

  private static globalHeaders(req: any, res: any, next: any): void{
    res.header('X-Powered-By', 'MapLander');
    next();
  }

  private initHandlers(): void{
    Server.handlerExceptionAndRejection();
    this.app.use(Server.handlerErrors);
  }

  private static handlerErrors(err: any, req: any, res: any, next: any): void{
    if(err instanceof APIError){
      return res.status(err.code).send(err);
    }
    res.status(500).send(err);
  }

  private static handlerExceptionAndRejection(): void{
    process.on('uncaughtException', Server.handleFatalErrors);
    process.on('unhandledRejection', Server.handleFatalErrors);
  }

  private static handleFatalErrors(err: any, req: any, res: any, next:any): void{
    console.error('handleFatalErrors', err.message);
    console.error('handleFatalErrors', err.stack);
    process.exit(1);
  }

  private router(): void{
    this.app.get('*',  (req, res) => {
      res.redirect('/#' + req.url);
    });
    this.initServer();
  }

  private initServer(): void{
    this.app.listen(this._port, () => {
      console.log(`Current environment ${process.env.NODE_ENV}`);
      console.log(`Listening server lite on http://localhost:${this._port}`);
    });
  }


  /**
   *
   * @deprecated
   *
   * Migrate to new repository {@link https://api-inspector.maplander.com/}
   * Available until: July 2019
   *
   * */
  private configEndPoints(): void{
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('../dist/api/swagger.json');
    const options = {
      customCss: '.swagger-ui .topbar { display: none }'
    };
    this.app.use('/endpoints/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    this.app.use('/endpoints/v1', new EndPoints().bootstrap());
  }

}

Server.bootstrap();
