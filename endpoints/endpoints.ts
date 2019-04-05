

import {check, validationResult} from 'express-validator/check';
import {Commons} from './pdf/commons';
import * as express from 'express';
import {Router} from 'express';


export class EndPoints{

  private _router: Router;

  constructor(){
    this._router = express.Router();
    this.configHeaders();
    this.bc();
    this.pdf();
    this.download();
    this.joinPdf();
  }

  public bootstrap(): Router{
    return this._router;
  }

  private configHeaders(): void {
    this._router.all('*', function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
      res.setHeader("Content-Type", "application/json");
      next();
    });
  }

  private bc(): void{
    this._router.get('/bc', [ check(['company', 'name', 'lastName', 'workPosition', 'phone', 'email', 'countryCode', 'industryCode']).exists() ],function (req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).end(JSON.stringify(
            {
              code: 422,
              description: 'Incomplete params, consult https://inspector-maplander-develop.appspot.com/endpoints/v1/api-docs/#/Business%20Card/get_bc',
              item: null
            }
          ))
        }else{
          const { company, name, lastName, workPosition, phone, email, website, countryCode, industryCode, profileImage, profileImageThumbnail } = req.query;
          const { fork } = require('child_process'), path = require('path');
          const process = fork(path.resolve(__dirname, 'endpoints', 'bc.js'));
          process.on('message', (data) => {
            res.status(data.code).end(JSON.stringify(data));
          });
          process.send({
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
            profileImageThumbnail: profileImageThumbnail || null
          });
        }
      }catch (e){
        console.error(e);
        res.status(500).end(JSON.stringify(
          {
            code: 500,
            description: 'Internal server error',
            item: null
          }
        ))
      }
    });
  }

  private pdf(): void{
    this._router.get('/pdf',[ check(['stationId']).exists() ], function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).end(JSON.stringify(
            {
              code: 422,
              description: 'Incomplete params, consult https://inspector-maplander-develop.appspot.com/endpoints/v1/api-docs'
            }
          ))
        }else {
          const { stationId, isSGM } = req.query;
          const { fork } = require('child_process'), path = require('path');
          const process = fork(path.resolve(__dirname, 'endpoints', 'pdf.js'));
          process.on('message', (data) => {
            res.status(data.code).end(JSON.stringify(data));
          });
          const data = {
            stationId: stationId,
            isSGM: isSGM || false
          };
          process.send(data);
        }
      }catch (e){
        console.error(e);
        res.status(500).end(JSON.stringify(
          {
            code: 500,
            description: 'Internal server error'
          }
        ))
      }
    });
  }

  private download(): void{
    this._router.get('/download',[ check(['url']).exists() ], function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).end(JSON.stringify(
            {
              code: 422,
              description: 'Incomplete params, consult https://inspector-maplander-develop.appspot.com/endpoints/v1/api-docs'
            }
          ))
        }else {
          const { url } = req.query;
          const commons = new Commons();
          const urlDecrypt: string = Commons.getDecrypt("123456$#@$^@1ERF", decodeURIComponent(url));
          commons.downloadFile(urlDecrypt).then((response: any) => {
            const headers = response.response.headers;
            res.set({
              'Content-Type': headers['content-type'],
              'Content-Length': headers['content-length']
            });
            res.status(200).end(response.body, 'binary');
          }).catch(error => {
            res.status(400).end(JSON.stringify(
              {
                code: 400,
                description: 'Bad request ' + error
              }
            ));
          })
        }
      }catch (e){
        console.error(e);
        res.status(500).end(JSON.stringify(
          {
            code: 500,
            description: 'Internal server error'
          }
        ))
      }
    });
  }

  private joinPdf(): void{
    this._router.get('/joinPDF',[ check(['stationId']).exists() ], function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).end(JSON.stringify(
            {
              code: 422,
              description: 'Incomplete params, consult https://inspector-maplander-develop.appspot.com/endpoints/v1/api-docs'
            }
          ))
        }else {
          const { stationId } = req.query;
          const { fork } = require('child_process'), path = require('path');
          const process = fork(path.resolve(__dirname, 'endpoints', 'join-pdf.js'));
          process.on('message', (data) => {
            if(data.code){
              res.status(data.code).end(JSON.stringify(data));
            }else{
              res.status(200).end(data, 'binary');
            }
          });
          const data = {
            stationId: stationId
          };
          process.send(data);
        }
      }catch (e){
        console.error(e);
        res.status(500).end(JSON.stringify(
          {
            code: 500,
            description: 'Internal server error'
          }
        ))
      }
    });
  }

}
