import {Commons} from './pdf/commons';
import {APIError, DefaultResponse} from './commons/class';
import {PdfData, PDFSASISOPAData, PDFSGMData} from './commons/interfaces';


export class ThreadPool{

  /**
   *
   * @deprecated
   *
   * */

  private static _instance: ThreadPool;
  private _queueProcessSASISOPA: PDFSASISOPAData[];
  private _listProcessSASISOPA: number[];
  private _queueProcessSGM: PDFSGMData[];
  private _listProcessSGM: number[];


  constructor(){
    this._listProcessSASISOPA = [];
    this._queueProcessSASISOPA = [];
    this._listProcessSGM = [];
    this._queueProcessSGM = [];
  }

  public static bootstrap(): ThreadPool{
    if(this._instance){
      return this._instance;
    }else{
      this._instance = new ThreadPool();
      return this._instance;
    }
  }


  /**
   *
   * @deprecated
   *
   * */
  public async newProcess(data: PdfData): Promise<any>{
    return await this.openProcessPDF(data);
  }

  private openProcessPDF(data: PdfData): Promise<DefaultResponse | APIError>{
    let resp = null;
    return new Promise<DefaultResponse|APIError>((resolve, reject) => {
      const { fork } = require('child_process'), path = require('path');
      const child = fork(path.resolve(__dirname, 'api', 'pdf.js'));
      child.on('message', (response: DefaultResponse | APIError) => {
        resp = response;
      });
      child.on('close', (code) => {
        console.info(`Close child process ${child.pid} PDF | RAM ${Commons.getFreeMemory()} MB | Code ${code}`);
        if(code === 0){

          if(data.isSGM){
            this.managerProcessSGM(false, resp.item.pdf);
          }else{
            this.managerProcessSASISOPA(false, resp.item.pdf);
          }
          resolve(new DefaultResponse({date: resp.item.item.date}));
        }else{
          reject(resp);
        }
      });
      console.info(`Open child process ${child.pid} PDF | RAM ${Commons.getFreeMemory()} MB`);
      child.send(data);
    });
  }

  private managerProcessSASISOPA(next: boolean, data?: PDFSASISOPAData): void{
    console.info('--------- SASISOPA -------------');
    if(next){
      this._listProcessSASISOPA.splice(0, 1);
      if(this._queueProcessSASISOPA.length > 0){
        this._listProcessSASISOPA.push(1);
        this.openProcessSASISOPA(this._queueProcessSASISOPA.shift());
        console.info(`NEXT | List process count ${this._listProcessSASISOPA.length}`);
        console.info(`NEXT | Length queue ${this._queueProcessSASISOPA.length}`);
      }else{
        console.info(`NEXT | List process count ${this._listProcessSASISOPA.length}`);
      }
    }else{
      if(this._listProcessSASISOPA.length < 2){
        this._listProcessSASISOPA.push(1);
        console.info(`List process count ${this._listProcessSASISOPA.length}`);
        this.openProcessSASISOPA(data);
      }else{
        this._queueProcessSASISOPA.push(data);
        console.info(`Length queue ${this._queueProcessSASISOPA.length}`);
      }
    }
  }

  private openProcessSASISOPA(data: PDFSASISOPAData): void{
    const { fork } = require('child_process'), path = require('path');
    const child = fork(path.resolve(__dirname, 'api', 'pdf-sasisopa.js'));
    child.on('message', (data) => {
      console.info(data);
    });
    child.on('close', (code) => {
      console.info(`Close child process ${child.pid} SASISOPA | RAM ${Commons.getFreeMemory()} MB | Code ${code}`);
      this.managerProcessSASISOPA(true);
    });
    console.info(`Open child process ${child.pid} SASISOPA | RAM ${Commons.getFreeMemory()} MB`);
    child.send(data);
  }

  private managerProcessSGM(next: boolean, data?: PDFSGMData): void{
    console.info('--------- SGM -------------');
    if(next){
      this._listProcessSGM.splice(0, 1);
      if(this._queueProcessSGM.length > 0){
        this._listProcessSGM.push(1);
        this.openProcessSGM(this._queueProcessSGM.shift());
        console.info(`NEXT | List process count ${this._listProcessSGM.length}`);
        console.info(`NEXT | Length queue ${this._queueProcessSGM.length}`);
      }else{
        console.info(`NEXT | List process count ${this._listProcessSGM.length}`);
      }
    }else{
      if(this._listProcessSGM.length < 2){
        this._listProcessSGM.push(1);
        console.info(`List process count ${this._listProcessSGM.length}`);
        this.openProcessSGM(data);
      }else{
        this._queueProcessSGM.push(data);
        console.info(`Length queue ${this._queueProcessSGM.length}`);
      }
    }
  }

  private openProcessSGM(data: PDFSGMData): void{
    const { fork } = require('child_process'), path = require('path');
    const child = fork(path.resolve(__dirname, 'api', 'pdf-sgm.js'));
    child.on('message', (data) => {
      console.info(data);
    });
    child.on('close', (code) => {
      console.info(`Close child process ${child.pid} SGM | RAM ${Commons.getFreeMemory()} MB | Code ${code}`);
      this.managerProcessSASISOPA(true);
    });
    console.info(`Open child process ${child.pid} SGM | RAM ${Commons.getFreeMemory()} MB`);
    child.send(data);
  }


}
