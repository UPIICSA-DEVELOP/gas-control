/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import * as path from "path";
import * as compression from 'compression';
import * as nconfg from 'nconf';
import * as express from 'express';
import {App} from '../server';
import {Logger} from '../logger';

export class ServerLite{

  public app: express.Application;
  private _port: number | string;
  private _postponeRouter: boolean;
  private static DIR: string = path.resolve(__dirname, 'browser');


  constructor(postponeRouter?: boolean){
    this._postponeRouter = postponeRouter || false;
    nconfg.argv().env().file({ file: 'config.json' });
    this.app = express();
    this.initConfig();
  }

  public getAppInstance(): express.Application{
    return this.app;
  }

  public initRouter(): void{
    if(this._postponeRouter){
      this.router();
    }else{
      throw 'Postpone Router option does not exist on constructor';
    }
  }

  private initConfig(): void{
    this._port = process.env.PORT || nconfg.get('PORT') || 8090;
    this.app.use(ServerLite.globalHeaders);
    this.app.use(ServerLite.handlerErrors);
    this.createLogger();
    this.app.use(compression({level: 9}));
    this.app.use('/.well-known', express.static(__dirname + '/.well-known'));
    this.app.use(express.static(ServerLite.DIR));
    if(!this._postponeRouter){
      this.router();
    }
  }

  private createLogger(): void{
    const morgan = require('morgan');
    const logger = new Logger();
    this.app.use(morgan('combined', { stream: logger.init().stream, skip: ServerLite.skipLog }));
  }

  private static skipLog(req, res): boolean{
    let url = req.url;
    if(url.indexOf('?')>0)
      url = url.substr(0,url.indexOf('?'));
    return url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/ig);
  }

  private static globalHeaders(req: any, res: any, next: any): void{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('X-Powered-By', 'MapLander');
    next();
  }

  private static handlerErrors(err: any, req: any, res: any, next: any): void{
    console.error(err.stack);
    next(err);
  }

  private router(): void{
    this.app.get('*', function (req, res) {
      res.redirect('/#' + req.url);
    });
    this.initServer();
  }

  private initServer(): void{
    this.app.listen(this._port, () => {
      console.log(`Current environment ${nconfg.get('ENV') || 'dev'}`);
      console.log(`Listening server lite on http://localhost:${this._port}`);
    });
  }
}