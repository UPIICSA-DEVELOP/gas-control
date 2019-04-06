
import {Commons} from './commons';
import {JoinPdfData} from './utils';

export class JoinPdf{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private _response: any;

  private  _commons: Commons;

  constructor(data: JoinPdfData){
    this._commons = new Commons();
    require('nconf').argv().env().file({ file: 'config.json' });
    if(require('nconf').get('BACKEND_URL')){
      JoinPdf.BACKEND_URL = require('nconf').get('BACKEND_URL');
    }
    this.init(data.stationId);
  }

  private init(id: string): void{
    this._commons.request(JoinPdf.BACKEND_URL + 'getSasisopa?stationId=' + id).then(response => {
     switch (response.code){
       case 200:
         if( response.item.fullSasisopa.files){
           const files = response.item.fullSasisopa.files || [];
           const urls: string[] = [];
           files.forEach(file => {
             urls.push(file.thumbnail);
           });
           return this.downloadFiles(urls);
         }else{
           this._response = {
             code: 400,
             description: 'Bad Request | files object does not exist on fullSasisopa'
           };
           JoinPdf.finish(this._response);
         }
         break;
       default:
         this._response = {
           code: 400,
           description: 'Bad Request ' + response
         };
         JoinPdf.finish(this._response);
         break;
     }
    }).then(response => {
      return this._commons.joinPDF(response);
    }).then(buffer => {
      this._response = buffer;
      JoinPdf.finish(this._response);
    }).catch(error => {
      this._response = {
        code: 500,
        description: 'Internal Sever Error ' + error
      };
      JoinPdf.finish(this._response);
    })
  }

  private async downloadFiles(urls: string[]): Promise<Buffer[]>{
    const buffers: Buffer[] = [];
    await Commons.asyncForEach(urls, async (url) => {
      const response = await this._commons.downloadFile(url);
      buffers.push(response.body);
    });
    return buffers;
  }

  private static finish(response: any): void{
    process.send(response);
  }

}

process.on('message', (data: JoinPdfData) => {
  new JoinPdf(data)
});
