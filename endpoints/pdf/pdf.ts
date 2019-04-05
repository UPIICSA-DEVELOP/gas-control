import {Commons} from './commons'
import {PdfData, PdfGeneratorData} from './utils';
import * as nconfg from 'nconf';



export class Pdf{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private _commons: Commons;
  private _response: any;
  private _taskTemplate: any[];
  private _uTaskTemplate: any[];
  private _uTasks: any;
  private _tasks: any[];
  private _stationId: string;

  constructor(data: PdfData){
    if(!data){
      this._response.code = 422;
      this._response.description = 'Incomplete Params';
      Pdf.finish(this._response);
    }
    require('nconf').argv().env().file({ file: 'config.json' });
    if(require('nconf').get('BACKEND_URL')){
      Pdf.BACKEND_URL = require('nconf').get('BACKEND_URL');
    }
    this._stationId = data.stationId;
    this._commons = new Commons();
    this._tasks = [];
    this._uTasks = {
      incidences: [],
      hwc: [],
      fr: []
    };
    this._taskTemplate = [];
    this._uTaskTemplate = [];
    this._response = {
      code: 200,
      description: 'OK'
    };
    this.init();
  }

  private init(): void {

    let stationTaskId, date;

    const infoPdfGenerator: PdfGeneratorData = {
      stationRFC: '',
      stationId: this._stationId,
      date: 0,
      sasisopaTemplates: [],
      businessName: '',
      listProcedures: [],
      listTasks: [],
      listCollaborators: [],
      listBrigade: [],
      listTanks: [],
      sasisopaDocuments: []
    };

    const finalTaskList: any[] = [];

    const body = {id: this._stationId};

    this._commons.request(Pdf.BACKEND_URL + 'saveFullSasisopa', 'POST', body).then(response => {
      switch (response.code) {
        case 200:
          this._response.item = {
            date: response.item.date
          };
          infoPdfGenerator.date = response.item.date;
          return this._commons.request(Pdf.BACKEND_URL + 'getUtils');
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request |' + response.description;
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code) {
        case 200:
          this._taskTemplate = response.item.taskTemplates;
          this._uTaskTemplate = response.item.uTaskTemplates;
          infoPdfGenerator.sasisopaTemplates = response.item.sasisopaTemplates;
          infoPdfGenerator.listProcedures = response.item.procedures;
          return this._commons.request(Pdf.BACKEND_URL + 'getStation?id=' + this._stationId);
        default:
          this._response.item = null;
          this._response.code = 400;
          this._response.description = 'Bad Request |' + response.description;
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code) {
        case 200:
          infoPdfGenerator.businessName = response.item.businessName || '';
          infoPdfGenerator.stationRFC = response.item.rfc || '';
          infoPdfGenerator.listTanks = response.item.fuelTanks || [];
          stationTaskId = response.item.stationTaskId;
          if(!stationTaskId){
            this._response.item = null;
            this._response.code = 400;
            this._response.description = 'Bad Request | stationTaskId does not exist';
            Pdf.finish(this._response);
          }else{
            return this._commons.request(Pdf.BACKEND_URL + 'listCollaborators?isConsultancy=false&refId=' + this._stationId);
          }
          break;
        default:
          this._response.item = null;
          this._response.code = 400;
          this._response.description = 'Bad Request ' + response.description;
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code) {
        case 200:
          infoPdfGenerator.listCollaborators = response.items || [];
          return this._commons.request(Pdf.BACKEND_URL + 'getSasisopa?stationId=' + this._stationId);
        default:
          this._response.item = null;
          this._response.code = 400;
          this._response.description = 'Bad Request |' + response.description;
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {

      switch (response.code) {
        case 200:
          if(response.item.sasisopaDocuments.length === 0 || response.item.brigade.brigadeElems.length === 0){
            this._response.item = null;
            this._response.code = 400;
            this._response.description = 'Bad Request | sasisopaDocuments or brigadeElems is empty';
            Pdf.finish(this._response);
          }else{
            infoPdfGenerator.sasisopaDocuments = response.item.sasisopaDocuments || [];
            infoPdfGenerator.listBrigade = response.item.brigade.brigadeElems || [];
            date = response.item.evidencesDate.date;
            const params = '?stationTaskId=' + stationTaskId + '&fromDate=' + date + '&status=4&untilDate=' + date;
            return this._commons.request(Pdf.BACKEND_URL + 'listTask' + params);
          }
          break;
        default:
          this._response.item = null;
          this._response.code = 400;
          this._response.description = 'Bad Request |' + response.description;
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      this._tasks = response.items || [];
      const params = '?stationTaskId='+ stationTaskId +'&type=1&fromDate='+ date + '&untilDate=' + date;
      return this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);
    }).then(response => {
      this._uTasks.fr = response.items || [];
      const params = '?stationTaskId='+ stationTaskId +'&type=2&fromDate='+ date + '&untilDate=' + date;
      return this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);
    }).then(response => {
      this._uTasks.hwc = response.items || [];
      const params = '?stationTaskId='+ stationTaskId +'&type=3&fromDate='+ date + '&untilDate=' + date;
      return this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);
    }).then(reponse => {
      this._uTasks.incidences = reponse.items || [];
      return this.getTasksByTemplateId(this._tasks, this._taskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      return this.getTasksByTemplateId(this._uTasks.fr, this._uTaskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      return this.getTasksByTemplateId(this._uTasks.hwc, this._uTaskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      return this.getTasksByTemplateId(this._uTasks.incidences, this._uTaskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      infoPdfGenerator.listTasks = finalTaskList;
      this.initPdfGenerator(infoPdfGenerator);
      Pdf.finish(this._response);
    });

  }

  private static clearTaskByFolio(task: any[]): any{
    Commons.bubbleSort(task, 'folio');
    return task[task.length - 1];
  }

  private async getTasksByTemplateId(tasks: any[], templates: any[]): Promise<any[]>{
    const finalTasks: any[] = [];
    await Commons.asyncForEach(tasks, async (task) => Commons.asyncForEach(templates, async (template) => {
      if(task.type === Number(template.id)){
        const response = await this.getTask(template.typeReport, task.id);
        switch (response.code){
          case 200:
            if(Array.isArray(response.items)){
              response.items.forEach((item) => {
                item.typeReport = template.typeReport;
                item.evidence = template.evidence;
              });
              finalTasks.push(response.items);
            }
            break;
        }
      }
    }));
    return finalTasks;
  }

  private initPdfGenerator(data: any): void{
    const { fork } = require('child_process');
    const path = require('path');
    const process = fork(path.resolve(__dirname, 'pdf-generator.js'));
    process.on('message', (data) => {
      console.log(data);
    });
    process.send(data);
  }


  private getTask(type: number, id: string): Promise<any>{
    switch (type){
      case 1:
        return this._commons.request(Pdf.BACKEND_URL + 'listOMReport?taskId=' + id);
      case 2:
        return this._commons.request(Pdf.BACKEND_URL + 'listCompressorReport?taskId=' + id);
      case 4:
        return this._commons.request(Pdf.BACKEND_URL + 'listVRSReport?taskId=' + id);
      case 5:
        return this._commons.request(Pdf.BACKEND_URL + 'listScannedReport?taskId=' + id);
      case 6:
        return this._commons.request(Pdf.BACKEND_URL + 'listHWCReport?taskId=' + id);
      case 7:
        return this._commons.request(Pdf.BACKEND_URL + 'listFRReport?taskId=' + id);
      case 8:
        return this._commons.request(Pdf.BACKEND_URL + 'listFEReport?taskId=' + id);
      case 9:
        return this._commons.request(Pdf.BACKEND_URL + 'listIncidenceReport?taskId=' + id);
    }
  }

  private static finish(response: any): void{
    process.send(response);
  }

}

process.on('message', (data: PdfData) => {
  new Pdf(data);
});
