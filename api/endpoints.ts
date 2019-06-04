

import {check, validationResult} from 'express-validator/check';
import {Commons} from './pdf/commons';
import * as express from 'express';
import {APIError, DefaultResponse, ServerError} from './commons/class';
import {PdfData} from './commons/interfaces';
import {ThreadPool} from './thread-pool';

export class EndPoints{


  /**
   *
   * @deprecated
   *
   * Migrate to new repository {@link https://api-inspector.maplander.com/}
   * Available until: July 2019
   *
   * */

  private _router: express.Router;
  private static FRONT_URL: string;

  constructor(){
    EndPoints.FRONT_URL = process.env.FRONT_URL || 'https://inspector-develop.maplander.com/endpoints/v1/api-docs/';
    this._router = express.Router();
    this.configHeaders();
    this.configEndPoints();
  }

  /**
   * @deprecated
   * */
  public bootstrap(): express.Router{
    return this._router;
  }

  private configHeaders(): void {
    this._router.all('*',  (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
      res.setHeader("Content-Type", "application/json");
      next();
    });
  }

  private configEndPoints(): void{
    this._router.get('/bc', [ check(['company', 'name', 'lastName', 'workPosition', 'phone', 'email', 'countryCode', 'industryCode']).exists() ], EndPoints.bc);
    this._router.get('/pdf',[ check(['stationId']).exists() ], EndPoints.pdf);
    this._router.get('/download',[ check(['url']).exists() ], EndPoints.download);
    this._router.get('/joinPDF',[ check(['stationId']).exists() ], EndPoints.joinPdf);
  }

  private static bc(req: express.Request, res: express.Response, next: express.NextFunction): void{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(`Incomplete params, consult ${EndPoints.FRONT_URL}`, 422));
      }else{
        const { company, name, lastName, workPosition, phone, email, website, countryCode, industryCode, profileImage, profileImageThumbnail, bCardId} = req.query;
        const { fork } = require('child_process'), path = require('path');
        const child = fork(path.resolve(__dirname, 'api', 'bc.js'));
        child.on('message', (data) => {
          res.status(data.code).end(JSON.stringify(data));
        });
        child.on('close', (code) => {
          console.info(`Close child process ${child.pid} BC | RAM ${Commons.getFreeMemory()} MB | Code ${code}`);
        });
        console.info(`Open child process ${child.pid} BC | RAM ${Commons.getFreeMemory()} MB`);
        child.send({
          name: name,
          lastName: lastName,
          company: company,
          workPosition: workPosition,
          phone: phone,
          email: email,
          countryCode: countryCode,
          industryCode: industryCode,
          website: website || null,
          profileImage: profileImage || null,
          profileImageThumbnail: profileImageThumbnail || null,
          bCardId: bCardId || null
        });
      }
    }catch (e){
      return next(new ServerError(e.message));
    }
  }

  private static pdf(req: express.Request, res: express.Response, next: express.NextFunction): void{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(`Incomplete params, consult ${EndPoints.FRONT_URL}`, 422));
      }else {
        const { stationId, isSGM } = req.query;
        const data: PdfData = {
          stationId: stationId,
          isSGM: (isSGM && isSGM === 'true')
        };
        ThreadPool.bootstrap().newProcess(data).then((response: DefaultResponse | APIError) => {
          res.status(response.code).end(JSON.stringify(response));
        });
      }
    }catch (e){
      return next(new ServerError(e.message));
    }
  }

  private static download(req: express.Request, res: express.Response, next: express.NextFunction): void{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(`Incomplete params, consult ${EndPoints.FRONT_URL}`, 422));
      }else {
        const { url } = req.query;
        const commons = new Commons();
        const urlDecrypt: string = Commons.getDecrypt("123456$#@$^@1ERF", decodeURIComponent(url));
        commons.downloadFile(encodeURI(urlDecrypt)).then((response: any) => {
          const headers = response.response.headers;
          res.set({
            'Content-Type': headers['content-type'],
            'Content-Length': headers['content-length']
          });
          res.status(200).end(response.body, 'binary');
        }).catch(error => {
          return next(new ServerError(error));
        })
      }
    }catch (e){
      return next(new ServerError(e.message));
    }
  }

  private static joinPdf(req: express.Request, res: express.Response, next: express.NextFunction): void{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(`Incomplete params, consult ${EndPoints.FRONT_URL}`, 422));
      }else {
        const { stationId, isSGM } = req.query;
        const { fork } = require('child_process'), path = require('path');
        const child = fork(path.resolve(__dirname, 'api', 'join-pdf.js'));
        child.on('message', (data) => {
          if(!data.code){
            const document = new Buffer(data, 'binary');
            res.writeHead(200, {
              'Content-Disposition': 'attachment; filename=document.pdf',
              'Content-Length': document.length.toString(),
              'Content-Transfer-Encoding': 'binary',
              'Content-Type':'application/pdf'
            });
            res.end(document);
          }else{
            res.status(data.code).end(JSON.stringify(data));
          }
        });
        child.on('close', (code) => {
          console.info(`Close child process ${child.pid} JoinPDF | RAM ${Commons.getFreeMemory()} MB | Code ${code}`);
        });
        const data = {
          stationId: stationId,
          isSGM: (isSGM && isSGM === 'true')
        };
        console.info(`Open child process ${child.pid} JoinPDF | RAM ${Commons.getFreeMemory()} MB`);
        child.send(data);
      }
    }catch (e){
      return next(new ServerError(e.message));
    }
  }

}
