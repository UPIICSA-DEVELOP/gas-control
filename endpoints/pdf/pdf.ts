import {Commons} from './commons'
import {PdfData, PDFSASISOPAData, PDFSGMData} from '../commons/interfaces';
import {APIError, DefaultResponse, ServerError} from '../commons/class';

export class Pdf{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private _commons: Commons;
  private _taskTemplate: any[];
  private _uTaskTemplate: any[];
  private _stationId: string;

  constructor(){
    require('nconf').argv().env().file({ file: 'config.json' });
    if(require('nconf').get('BACKEND_URL')){
      Pdf.BACKEND_URL = require('nconf').get('BACKEND_URL');
    }
    this._commons = new Commons();
    this._taskTemplate = [];
  }

  public async init(data: PdfData): Promise<DefaultResponse | APIError>{
    this._stationId = data.stationId;
    if(data.isSGM){
      return await this.initSGM();
    }else{
      return await this.initSASISOPA();
    }
  }

  private async initSASISOPA(): Promise<DefaultResponse | APIError> {

    let stationTaskId, dateForFilter, tasks;
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

    let response, params, items;

    try{

      response = await this._commons.request(Pdf.BACKEND_URL + 'saveFullSasisopa', 'POST', body);
      switch (response.code) {
        case 200:
          infoPdfGenerator.date = response.item.date;
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }
      response = await this._commons.request(Pdf.BACKEND_URL + 'getUtils');
      switch (response.code) {
        case 200:
          this._taskTemplate = response.item.taskTemplates || [];
          this._uTaskTemplate = response.item.uTaskTemplates || [];
          infoPdfGenerator.sasisopaTemplates = response.item.sasisopaTemplates || [];
          infoPdfGenerator.listProcedures = response.item.procedures || [];
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }
      response = await this._commons.request(Pdf.BACKEND_URL + 'getStation?id=' + this._stationId);
      switch (response.code) {
        case 200:
          infoPdfGenerator.businessName = response.item.businessName || '';
          infoPdfGenerator.stationRFC = response.item.rfc || '';
          infoPdfGenerator.listTanks = response.item.fuelTanks || [];
          stationTaskId = response.item.stationTaskId;
          if (!stationTaskId) {
            return new APIError('Bad RequestStation Task id does not exist ' + JSON.stringify(response), 400);
          }
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }
      response = await this._commons.request(Pdf.BACKEND_URL + 'listCollaborators?isConsultancy=false&refId=' + this._stationId);

      switch (response.code) {
        case 200:
          infoPdfGenerator.listCollaborators = response.items || [];
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }
      response = await this._commons.request(Pdf.BACKEND_URL + 'getSasisopa?stationId=' + this._stationId);

      switch (response.code) {
        case 200:
          if (response.item.sasisopaDocuments.length === 0 || response.item.brigade.brigadeElems.length === 0) {
            return new APIError('Bad Request sasisopaDocuments and brigadeElems length is equst to zero' + JSON.stringify(response), 400);
          } else {
            infoPdfGenerator.sasisopaDocuments = response.item.sasisopaDocuments || [];
            infoPdfGenerator.listBrigade = response.item.brigade.brigadeElems || [];
            dateForFilter = response.item.evidencesDate.date;
            params = `?stationTaskId=${stationTaskId}&fromDate=${dateForFilter}&status=4&untilDate=${dateForFilter}`;
          }
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }
      response = await this._commons.request(Pdf.BACKEND_URL + 'listTask' + params);
      tasks = response.items || [];
      params = `?stationTaskId=${stationTaskId}&type=1&fromDate=${dateForFilter}&untilDate=${dateForFilter}`;
      response = await this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);

      uTasks.fr = response.items || [];
      params = `?stationTaskId=${stationTaskId}&type=2&fromDate=${dateForFilter}&untilDate=${dateForFilter}`;
      response = await this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);

      uTasks.hwc = response.items || [];
      params = `?stationTaskId=${stationTaskId}&type=3&fromDate=${dateForFilter}&untilDate=${dateForFilter}`;
      response = await this._commons.request(Pdf.BACKEND_URL + 'listUTask' + params);

      uTasks.incidences = response.items || [];
      items = await this.getTasksByTemplateId(tasks, this._taskTemplate);

      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });

      items = await this.getTasksByTemplateId(uTasks.fr, this._uTaskTemplate);

      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });

      items = await this.getTasksByTemplateId(uTasks.hwc, this._uTaskTemplate);

      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      items = await this.getTasksByTemplateId(uTasks.incidences, this._uTaskTemplate);

      items.forEach(i => {
        finalTaskList.push(Pdf.clearTaskByFolio(i));
      });
      infoPdfGenerator.listTasks = finalTaskList;
      this.initPDFSASISOPA(infoPdfGenerator);

      return new DefaultResponse({date: infoPdfGenerator.date});

    }catch (e){
      return new APIError(e.message, 500);
    }


  }

  private async initSGM(): Promise<DefaultResponse | APIError> {

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

    let response, params, items;

    try{

      response = await this._commons.request(Pdf.BACKEND_URL + 'getUtils');

      switch (response.code){
        case 200:
          data.sgmDocuments = response.item.sgmDocuments;
          this._taskTemplate = response.item.taskTemplates;
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      response = await this._commons.request(Pdf.BACKEND_URL + 'saveFullSgm', 'POST', body);

      switch (response.code){
        case 200:
          date = response.item.date;
          data.date = date;
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      response = await this._commons.request(Pdf.BACKEND_URL + 'getStation?id=' + this._stationId);

      switch (response.code){
        case 200:
          data.businessName = response.item.businessName;
          data.crePermission = response.item.crePermission;
          data.address = response.item.address;
          data.rfc = response.item.rfc;
          stationTaskId = response.item.stationTaskId;
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      response = await this._commons.request(Pdf.BACKEND_URL + 'getSgm?stationId=' + this._stationId);

      switch (response.code){
        case 200:
          data.sgmSelection = response.item.sgmSelection;
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      params = `?stationTaskId=${stationTaskId}&type=31&status=4`;
      response = await this._commons.request(Pdf.BACKEND_URL + 'listTask' + params);

      switch (response.code){
        case 200:
          tasks = response.items || [];
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      items = await this.getTasksByTemplateId(tasks, this._taskTemplate);

      items.forEach(item => {
        data.taskListAnnexed1.push(Pdf.clearTaskByFolio(item));
      });

      params = `?stationTaskId=${stationTaskId}&type=41&status=4`;

      response = await this._commons.request(Pdf.BACKEND_URL + 'listTask' + params);

      switch (response.code){
        case 200:
          tasks = response.items || [];
          break;
        default:
          return new APIError('Bad Request ' + JSON.stringify(response), 400);
      }

      items = await this.getTasksByTemplateId(tasks, this._taskTemplate);

      items.forEach(item => {
        data.taskListAnnexed2.push(Pdf.clearTaskByFolio(item));
      });

      this.initPDFSGM(data);

      return new DefaultResponse({date: data.date});

    }catch (e){
      return new APIError(e.message, 500);
    }

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

}

process.on('message', (data: PdfData) => {
  const pdf = new Pdf();
  pdf.init(data).then((response: DefaultResponse | APIError) => {
    process.send(response);
  }).catch(error => {
    process.send(error);
  })
});
