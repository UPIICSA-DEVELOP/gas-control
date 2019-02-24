/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */


'use-strict';

import 'zone.js/dist/zone-node'
import {enableProdMode} from '@angular/core';
import * as path from 'path';
import * as nconfg from 'nconf';
import * as express from 'express';
import * as compression from 'compression';
import * as ngUniversal from '@nguniversal/express-engine';

enableProdMode();

export class App {

  public app: express.Application;
  private _port: number | string;
  private static DIR: string = path.resolve(__dirname, 'browser');


  constructor(){
    this.app = express();
    this._port = 8080;
    this.index();
    this.config();
  }

  public static bootstrap(): App {
    return new App();
  }

  private config(): void{
    nconfg.argv().env().file({ file: 'config.json' });
    this.app.use(App.headers);
    this.app.use(App.handlerErrors);
    this.app.use(compression({level: 9}));
    //this.app.use('/.well-known', express.static(__dirname + '/.well-known'));
    this.configEndPoints()
    this.configRender();
    this.app.use(express.static(App.DIR));
    this.views();
  }

  private configRender(): void{
    this.app.get('/', App.angularRouter);
  }

  private configEndPoints(): void{
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('../dist/endpoints/swagger.json');
    const options = {
      customCss: '.swagger-ui .topbar { display: none }'
    };
    this.app.use('/endpoints/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    this.app.use('/endpoints/v1', require('../dist/endpoints/endpoints.js'));
  }

  private views(): void{
    const appServer = require('../dist/server/main');
    this.app.engine('html', ngUniversal.ngExpressEngine({
      bootstrap: appServer.AppServerModuleNgFactory
    }));
    this.app.set('view engine', 'html');
    this.app.set('views', App.DIR);
    this.router();
  }

  private index(): void{
    App.readIndex().then(index => {
      const domino = require('domino');
      const win = domino.createWindow(index);
      global['window'] = win;
      global['document'] = win.document;
    });
  }

  private router(): void{
    /* Direct all routes to index.html, where Angular will take care of routing */
    this.app.get('*', App.angularRouter);
    this.start();
  }

  private start(): void{
    this.app.listen(this._port, () => {
      console.log(`Current environment ${nconfg.get('ENV') || 'dev'}`);
      console.log(`Listening on http://localhost:${this._port}`);
    });
  }

  private static angularRouter(req, res): void{
    /* Server-side rendering */
    res.status(200).render('index', { req, res });
  }

  private static headers(req: any, res: any, next: any): void{
    res.header('X-Powered-By', 'MapLander');
    next();
  }

  private static handlerErrors(err: any, req: any, res: any, next: any): void{
    console.error(err.stack);
    next(err);
  }

  private static async readIndex(): Promise<Buffer>{
    const fs = require('fs');
    return await fs.readFileSync(path.join(__dirname, 'browser/index.html'), 'utf8');
  }
}

App.bootstrap();
