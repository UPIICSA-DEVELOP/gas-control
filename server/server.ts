/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */


import 'zone.js/dist/zone-node'
import {enableProdMode} from '@angular/core';
import {ServerStandard} from './types/server_standard';
import {ServerLite} from './types/server_lite';

import * as nconfg from 'nconf';
import {EndPoints} from '../api/endpoints';

enableProdMode();

export class App {

  private _type_server: number;

  constructor(){
    nconfg.argv().env().file({ file: 'config.json' });
    this._type_server = 1;
    this.initOptions();
  }

  public static bootstrap(): App {
    return new App();
  }

  private initOptions(): void{
    const [,, ...args] = process.argv;
    if(args.length > 0){
      try{
        args.forEach((arg, index) => {
          if(arg === '--type'){
            const type = args[index + 1];
            if(type === 'lite'){
              this._type_server = 2;
            }
          }
        });
      }catch (e){
        throw e;
      }
    }else{
      console.log('Not args');
      this._type_server = parseInt(process.env.SERVER || nconfg.get('SERVER') || 1);
    }
    this.initServer();
  }

  private initServer(): void{
    let server;
    switch (this._type_server){
      case 1: // With SSR
        server = new ServerStandard(true);
        break;
      case 2: // Without SSR (Use hash)
        server = new ServerLite(true);
        break;
    }
    App.configEndPoints(server.getAppInstance());
    server.initRouter();
  }

  /**
   *
   * @deprecated
   *
   * Migrate to new repository {@link https://api-inspector.maplander.com/}
   * Available until: July 2019
   *
   * */
  private static configEndPoints(app: any): void{
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('../dist/api/swagger.json');
    const options = {
      customCss: '.swagger-ui .topbar { display: none }'
    };
    app.use('/endpoints/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    app.use('/endpoints/v1', new EndPoints().bootstrap());
  }

}

App.bootstrap();
