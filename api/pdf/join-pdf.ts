
import {Commons} from './commons';
import {JoinPdfData} from '../commons/interfaces';
import {APIError} from '../commons/class';

export class JoinPdf{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private  _commons: Commons;

  constructor(){
    this._commons = new Commons();
    require('nconf').argv().env().file({ file: 'config.json' });
    if(require('nconf').get('BACKEND_URL')){
      JoinPdf.BACKEND_URL = require('nconf').get('BACKEND_URL');
    }
  }

  public async init(data: JoinPdfData): Promise<Buffer | APIError>{
    if(data.isSGM){
      return await this.initSGM(data.stationId);
    }else{
      return await this.initSASISOPA(data.stationId);
    }
  }

  private async initSASISOPA(id: string): Promise<Buffer | APIError>{

    const urls:  string[]  = [];
    let response;

    try{
      response = await this._commons.request(JoinPdf.BACKEND_URL + 'getSasisopa?stationId=' + id);

      switch (response.code){
        case 200:
          if( response.item.fullSasisopa.files){
            const files = response.item.fullSasisopa.files || [];
            files.forEach(file => {
              urls.push(file.thumbnail);
            });
          }else{
            return new APIError('Bad Request files object does not exist on fullSasisopa', 400);
          }
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      response = await this.downloadFiles(urls);

      response = await this._commons.joinPDF(response);

      return new Buffer(response, 'binary')
    }catch (e){
      return new APIError(e.message, 500);
    }
  }

  private async initSGM(id: string): Promise<Buffer | APIError>{

    const urls: string[] = [];
    let response;

    try{
      response = await this._commons.request(JoinPdf.BACKEND_URL + 'getSgm?stationId=' + id);

      switch (response.code){
        case 200:
          if(response.item.fullSgm.files){
            const files = response.item.fullSgm.files || [];
            files.forEach(file => {
              urls.push(file.thumbnail);
            });
          }else{
            return new APIError('Bad Request files object does not exist on fullSgm', 400);
          }
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      response =  await this.downloadFiles(urls);

      response = await this._commons.joinPDF(response);

      return new Buffer(response, 'binary');

    }catch (e){
     return new APIError(e.message, 500);
    }
  }

  private async downloadFiles(urls: string[]): Promise<Buffer[]>{
    const buffers: Buffer[] = [];
    await Commons.asyncForEach(urls, async (url) => {
      const response = await this._commons.downloadFile(url);
      buffers.push(response.body);
    });
    return buffers;
  }

}

process.on('message', (data: JoinPdfData) => {
  const join = new JoinPdf();
  join.init(data).then(response => {
    process.send(response);
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  }).catch(error => {
    process.send(error);
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });
});
