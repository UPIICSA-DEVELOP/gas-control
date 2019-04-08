import {Commons} from './commons'
import {PdfData, PDFSASISOPAData, PDFSGMData} from './utils';
import * as nconfg from 'nconf';



export class Pdf{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private _commons: Commons;
  private _response: any;
  private _taskTemplate: any[];
  private _uTaskTemplate: any[];
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
    this._response = {
      code: 200,
      description: 'OK'
    };
    this._taskTemplate = [];
    if(data.isSGM){
      this.initSGM();
    }else{
      this._uTaskTemplate = [];
      this.initSASISOPA();
    }
  }

  private initSASISOPA(): void {

    let stationTaskId, date, tasks;
    const uTasks = {
      incidences: [],
      hwc: [],
      fr: []
    };

    const infoPdfGenerator: PDFSASISOPAData = {
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
          this._response.description = 'Bad Request - saveFullSasisopa|' + JSON.stringify(response);
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
          this._response.description = 'Bad Request - getStation |' + JSON.stringify(response);
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
          this._response.description = 'Bad Request - listCollaborators | ' + JSON.stringify(response);
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
          this._response.description = 'Bad Request - getSasisopa |' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {

      switch (response.code) {
        case 200:
          if(response.item.sasisopaDocuments.length === 0 || response.item.brigade.brigadeElems.length === 0){
            this._response.item = null;
            this._response.code = 400;
            this._response.description = 'Bad Request - sasisopaDocuments | sasisopaDocuments or brigadeElems is empty';
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
          this._response.description = 'Bad Request |' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      tasks = response.items || [];
      const params = '?stationTaskId='+ stationTaskId +'&type=1&fromDate='+ date + '&untilDate=' + date;
      return this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);
    }).then(response => {
      uTasks.fr = response.items || [];
      const params = '?stationTaskId='+ stationTaskId +'&type=2&fromDate='+ date + '&untilDate=' + date;
      return this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);
    }).then(response => {
      uTasks.hwc = response.items || [];
      const params = '?stationTaskId='+ stationTaskId +'&type=3&fromDate='+ date + '&untilDate=' + date;
      return this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);
    }).then(reponse => {
      uTasks.incidences = reponse.items || [];
      return this.getTasksByTemplateId(tasks, this._taskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      return this.getTasksByTemplateId(uTasks.fr, this._uTaskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      return this.getTasksByTemplateId(uTasks.hwc, this._uTaskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      return this.getTasksByTemplateId(uTasks.incidences, this._uTaskTemplate);
    }).then(items => {
      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      infoPdfGenerator.listTasks = finalTaskList;
      this.initPDFSASISOPA(infoPdfGenerator);
      Pdf.finish(this._response);
    }).catch(error => {
      this._response.item = null;
      this._response.code = 400;
      this._response.description = 'Bad Request |' + error;
      Pdf.finish(this._response);
    });

  }

  private initSGM(): void{

    let date = null, stationTaskId = null, tasks;

    const data: PDFSGMData = {
      stationId: this._stationId,
      businessName: '',
      crePermission: '',
      address: '',
      rfc: '',
      date: 0,
      sgmSelection: null,
      proceduresList: [],
      taskListAnnexed1: [],
      taskListAnnexed2: [],
      sgmDocuments: []
    };

    const body = {id: this._stationId};

    this._commons.request(Pdf.BACKEND_URL + 'getUtils').then(response => {
      switch (response.code){
        case 200:
          data.sgmDocuments = response.item.sgmDocuments;
          this._taskTemplate = response.item.taskTemplates;
          return this._commons.request(Pdf.BACKEND_URL + 'saveFullSgm', 'POST', body);
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request | ' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code){
        case 200:
          date = response.item.date;
          data.date = date;
          return this._commons.request(Pdf.BACKEND_URL + 'getStation?id=' + this._stationId);
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request | ' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code){
        case 200:
          data.businessName = response.item.businessName;
          data.crePermission = response.item.crePermission;
          data.address = response.item.address;
          data.rfc = response.item.rfc;
          stationTaskId = response.item.stationTaskId;
          return this._commons.request(Pdf.BACKEND_URL + 'getSgm?stationId=' + this._stationId);
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request | ' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code){
        case 200:
          data.sgmSelection = response.item.sgmSelection;
          const params = '?stationTaskId=' + stationTaskId + '&type=31&status=4';
          return this._commons.request(Pdf.BACKEND_URL + 'listTask' + params);
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request | ' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(response => {
      switch (response.code){
        case 200:
          tasks = response.items || [];
          return this.getTasksByTemplateId(tasks, this._taskTemplate);
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request | ' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(items => {
      items.forEach(item => {
        data.taskListAnnexed1.push(Pdf.clearTaskByFolio(item));
      });
      const params = '?stationTaskId=' + stationTaskId + '&type=41&status=4';
      return this._commons.request(Pdf.BACKEND_URL + 'listTask' + params);
    }).then(response => {
      switch (response.code){
        case 200:
          tasks = response.items || [];
          return this.getTasksByTemplateId(tasks, this._taskTemplate);
        default:
          this._response.code = 400;
          this._response.description = 'Bad Request | ' + JSON.stringify(response);
          Pdf.finish(this._response);
          break;
      }
    }).then(items => {
      items.forEach(item => {
        data.taskListAnnexed2.push(Pdf.clearTaskByFolio(item));
      });
      this.initPDFSGM(data);
      this._response.item = {
        date: date
      };
      Pdf.finish(this._response);
    }).catch(error => {
      this._response.code = 500;
      this._response.description = 'Internal Server Error | ' + error;
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

  private initPDFSASISOPA(data: any): void{
    const { fork } = require('child_process');
    const path = require('path');
    const process = fork(path.resolve(__dirname, 'pdf-sasisopa.js'));
    process.on('message', (data) => {
      console.log(data);
    });
    process.send(data);
  }

  private initPDFSGM(data: any): void{
    const { fork } = require('child_process');
    const path = require('path');
    const process = fork(path.resolve(__dirname, 'pdf-sgm.js'));
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
