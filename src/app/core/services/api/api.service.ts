/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable, OnDestroy} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NetworkService} from '@app/core/services/connection/network.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Consultancy} from '@app/core/interfaces/interfaces';
import {Subscription} from 'rxjs/Rx';
import {environment} from '@env/environment';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';


@Injectable()
export class ApiService implements OnDestroy{

  private static API_URL = environment.backendUrl;
  private static API_PATH = '/_ah/api/';
  private static API_CHANNEL = 'communication/';
  private static API_VERSION = 'v1/';
  private static API_URL_COMPLETE = ApiService.API_URL + ApiService.API_PATH + ApiService.API_CHANNEL + ApiService.API_VERSION;
  private _subscriptionNetwork: Subscription;
  private static PROXY_ENDPOINTS = environment.apiUrl;
  constructor(
    private _http: HttpClient,
    private _networkService: NetworkService,
    private _snackBarService: SnackBarService
  ) {
    this.initNetwork();
  }

  ngOnDestroy(): void{
    this._subscriptionNetwork.unsubscribe();
  }

  public signIn(options: any): Observable<any> {
    const user = {
      email: options.email,
      password: options.password,
      token: (options.token)?options.token:undefined,
      type: 3
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'signIn', user);
  }

  public signOut(token: string): Observable<any>{
    const options = {
      token: token
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'signOut', options);
  }

   public  resetPassword(email: string): Observable<any> {
     const options = {
       email: email
     };
    return this._http.post(ApiService.API_URL_COMPLETE + 'sendSignInLink', options);
   }

   public signInWithLink(id: string, token?: string): Observable<any> {
    const options = {
      id: id,
      token: token?token: undefined,
      type: 3
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'signInWithLink', options);
   }

   public buildTaskByStation(stationTaskId:string):Observable<any>{
    const options = {
      stationTaskId: stationTaskId
    };
    return this._http.post(ApiService.API_URL_COMPLETE+'buildTaskByStation', options);
   }

  public ipApi(): Observable<any> {
    return this._http.get('https://ipapi.co/json/');
  }


  public getPerson(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get(ApiService.API_URL_COMPLETE+ 'getPerson',{params: params});
  }

  public getConsultancy(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get(ApiService.API_URL_COMPLETE+ 'getConsultancy',{params: params});
  }

  public updatePerson(person: any): Observable<any> {
    return this._http.put( ApiService.API_URL_COMPLETE + 'updatePerson', person);
  }

  public updateConsultancy(consultancy: any): Observable<any> {
    return this._http.put(ApiService.API_URL_COMPLETE + 'updateConsultancy',consultancy);
  }

  public uploadFileToBlob(part: FormData): Observable<any> {
    return this._http.post(ApiService.API_URL + '/upload', part);
  }

  public deleteFileToBlob(blobName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('blobName', blobName);
    return this._http.delete(ApiService.API_URL + '/upload', {params: params});
  }

  public savePersonInformation(infoPerson: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'savePersonInformation', infoPerson);
  }

  public getPersonInformation(id: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getPersonInformation', {params:params});
  }

  public getConsultancyBasicData(personId: string, consultancyId: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('consultancyId', consultancyId);
    params = params.append('personId', personId);
    return this._http.get(ApiService.API_URL_COMPLETE+ 'getConsultancyBasicData', {params:params});
  }

  public getUtils():Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'getUtils');
  }

  public  turnOnNotificationStation(personId: string, stationId: string):Observable<any>{
    const options = {
      personId: personId,
      stationId: stationId
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'turnOnNotificationStation',options);
  }

  public  turnOffNotificationStation(personId: string, stationId: string):Observable<any>{
    const options = {
      personId: personId,
      stationId: stationId
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'turnOffNotificationStation',options);
  }

  public getStation(id: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getStation',{params: params});
  }

  public updateStation(station: any):Observable<any>{
    return this._http.put(ApiService.API_URL_COMPLETE + 'updateStation', station);
  }

  public getLegalRepresentativeBasicData(consultancyId:string, legalRepresentativeId: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('consultancyId', consultancyId);
    params = params.append('legalRepresentativeId', legalRepresentativeId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getLegalRepresentativeBasicData',{params: params});
  }

  public getStationBasicData(personId: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('personId', personId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getStationBasicData',{params: params});
  }

  public deletePerson(id: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('id',id);
    return this._http.delete(ApiService.API_URL_COMPLETE + 'deletePerson',{params:params})
  }

  public listCollaborators(refId: string, isConsultancyBoolean:string): Observable<any>{
    let params = new HttpParams();
    params = params.append('isConsultancy',isConsultancyBoolean);
    params = params.append('refId',refId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'listCollaborators',{params: params});
  }

  public createReferencedPerson(person: any):Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createReferencedPerson', person);
  }

  public updateRolePerson(personId: string, role: number):Observable<any>{
    const options = {
      personId: personId,
      role: role
    };
    return this._http.put(ApiService.API_URL_COMPLETE + 'updateRolePerson', options);
  }

  public listDocumentByStation(stationId: string, regulationType?: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('idStation', stationId);
    params = params.append('regulationType', (regulationType?regulationType:'1'));
    return this._http.get(ApiService.API_URL_COMPLETE + 'listDocumentByStation', {params: params});
  }

  public createDocument(document: any):Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createDocument', document);
  }

  public updateDocument(document: any):Observable<any>{
    return this._http.put(ApiService.API_URL_COMPLETE + 'updateDocument', document);
  }

  public createStation(station:any):Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createStation', station);
  }

  public listPersonStationByConsultancy(refId: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('consultancyCreationId', refId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'listPersonStationByConsultancy', {params: params});
  }

  public personExists(email: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'personExists', email);
  }

  public updatePersonWithDifferentEmail(person: any):Observable<any>{
    return this._http.put(ApiService.API_URL_COMPLETE + 'updatePersonWithDifferentEmail', person);
  }

  public createStationTask(task:any):Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createStationTask',task);
  }

  public getFile(url: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('url', encodeURIComponent(url));
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'download', { responseType: 'blob' as 'json', params: params});
  }

  public createConsultancy(data: Consultancy): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createConsultancy', data);
  }

  public createPerson(person: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createPerson', person);
  }

  public listConsultancy(): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listConsultancy',);
  }

  public listTask(filters: any): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    if(!filters.firstOpen){
      params = params.append('fromDate', filters.startDate);
      params = params.append('untilDate', filters.endDate);
    }
    if(filters.status !== '0'){
      params = params.append('status', filters.status);
    }
    if(filters.type!== '0'){
      params = params.append('type', filters.type);
    }
    if(filters.cursor){
      params = params.append('cursor', filters.cursor);
    }
    return this._http.get(ApiService.API_URL_COMPLETE + 'listTask', {params: params});
  }

  public listUTask(filters: any): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    params = params.append('type',filters.type);
    if(!filters.firstOpen){
      params = params.append('fromDate', filters.startDate);
      params = params.append('untilDate', filters.endDate);
    }
    return this._http.get(ApiService.API_URL_COMPLETE + 'listUTask',{params: params});
  }

  public getStationTask(stationTaskId: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', stationTaskId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getStationTask', {params: params});
  }

  public businessCardService(data: any): Observable<any>{
    let params = new HttpParams();
    params = params.append('name', data.name || '');
    params = params.append('lastName', data.lastName || '');
    params = params.append('company', data.company || '');
    params = params.append('phone', data.phone);
    params = params.append('workPosition', data.workPosition || '');
    params = params.append('email', data.email || '');
    params = params.append('countryCode', data.countryCode || '');
    params = params.append('industryCode', data.industryCode || '1');
    params = params.append('website', data.website || '');
    params = params.append('profileImage', data.profileImage || '');
    params = params.append('profileImageThumbnail', data.profileImageThumbnail || '');
    if(data.bCardId){
      params = params.append('bCardId', data.bCardId);
    }
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'bc', {
      headers: headers,
      params: params
    });
  }

  public getFullPDF(stationId: string, isSGM: boolean): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    params = params.append('isSGM', isSGM?'true':'false');
    const url = environment.local ? 'https://inspector-develop.maplander.com/':environment.url;
    return this._http.get(url + 'endpoints/v1/pdf', {params: params});
  }

  public fullSasisopaRequest(stationId: string): Observable<any>{
    const options = {
      stationId: stationId
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'fullSasisopaRequest', options);
  }

  public joinPDF(stationId: string, isSGM: boolean): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    params = params.append('isSGM', isSGM?'true':'false');
    const url = environment.local ? 'https://inspector-develop.maplander.com/':environment.url;
    return this._http.get(url + 'endpoints/v1/joinPDF', {responseType: 'blob' as 'json', params: params});
  }

  public exportReport (taskId: string, typeReport: number, templateId: number ,uTask: boolean):Observable<any>{
    let params = new HttpParams();
    params = params.append('taskId', taskId);
    params = params.append('typeReport', typeReport.toString());
    params = params.append('templateId', templateId.toString());
    params = params.append('uTask', (uTask?'true':'false'));
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'exportReport', {responseType: 'blob' as 'json', params: params});
  }

  public exportCalendarByTaskList(filters: any, uTask: boolean): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    params = params.append('uTask', (uTask ? 'true':'false'));
    if(!filters.firstOpen){
      params = params.append('fromDate', filters.startDate);
      params = params.append('untilDate', filters.endDate);
    }
    if(filters.status !== '0' && !uTask){
      params = params.append('status', filters.status);
    }
    if(filters.type!== '0'){
      params = params.append('type', filters.type);
    }
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'exportCalendarByTaskList', {responseType: 'blob' as 'json', params: params});
  }

  public getCompleteInfoDashboard(userId: string, refId: string, role: number, onlyOneStationId?: any): Observable<any>{
    let response1 = null;
    let response2 = this.getUtils();
    if(onlyOneStationId){
      response1 = this.getStation(onlyOneStationId);
    }else{
      if(role === 7){
        let stationId = undefined;
        const stationsView = SessionStorageService.getItem(Constants.StationAdmin) || [];
        if(stationsView){
          stationsView.forEach(item=>{
            if(item.lastView){
              stationId = item.stationId
            }
          });
          response1 = this.getStation(stationId);
        }
      }else{
        switch (role) {
          case 1:
          case 2:
          case 3:
            response1 = this.getConsultancyBasicData(userId, refId);
            break;
          case 4:
            response1 = this.getLegalRepresentativeBasicData(refId, userId);
            break;
          case 5:
          case 6:
            response1 = this.getStationBasicData(userId);
            break;
        }
      }
    }
    return forkJoin(response1, response2);
  }

  public uploadToBusinessCard(form: FormData): Observable<any>{
    return this._http.post('https://business-card-74ca5.appspot.com/upload', form);
  }

  public listNotifications(personId: string, stationId: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('personId',personId);
    params = params.append('stationId',stationId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'listNotifications',{params: params});
  }

  public deleteNotification(id: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('id',id);
    return this._http.delete(ApiService.API_URL_COMPLETE + 'deleteNotification', {params: params});
  }

  /**
   * Start: list reports by reportType
   */

  public getTaskInformation(taskId: string, typeReport: number): Observable<any>{
    let response = null;
    let params = new HttpParams();
    params = params.append('taskId', taskId);
    switch (typeReport){
      case 1:
        response = this.listOMReport(params);
        break;
      case 2:
        response = this.listCompressorReport(params);
        break;
      case 4:
        response = this.listVRSReport(params);
        break;
      case 5:
        response = this.listScannedReport(params);
        break;
      case 6:
        response = this.listHWCReport(params);
        break;
      case 7:
        response = this.listFRReport(params);
        break;
      case 8:
        response = this.listFEReport(params);
        break;
      case 9:
        response = this.listIncidenceReport(params);
        break;
    }
    return response;
  };

  /**
   * TypeReport = 1 | Operación y mantenimiento
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private  listOMReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listOMReport',{params: params});
  }

  /**
   * TypeReport = 2 | Compresor
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listCompressorReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listCompressorReport', {params: params});
  }

  /**
   * TypeReport = 4 | Sistema de recuperación de vapores
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listVRSReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listVRSReport', {params: params});
  }

  /**
   * TypeReport = 5 | Limpieza ecológica
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listScannedReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listScannedReport',{params: params});
  }

  /**
   * TypeReport = 6 | Recolección de residuos peligrosos
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listHWCReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listHWCReport', {params: params});
  }

  /**
   * TypeReport = 7 | Recepción y descarga de combustible
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listFRReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listFRReport', {params: params});
  }

  /**
   * TypeReport = 8 | Revisión de extintores
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private  listFEReport(params: HttpParams): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listFEReport', {params: params});
  }

  /**
   * TypeReport = 9 | Incidencia
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listIncidenceReport(params: HttpParams): Observable <any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listIncidenceReport', {params: params});
  }

  /**
   * End: list reports by reportType
   */

  public createTask(taskEntity: any, type: number): Observable<any>{
    let response = null;
    switch (type){
      case 1:
        response = this.createOMReport(taskEntity);
        break;
      case 2:
        response = this.createCompressorReport(taskEntity);
        break;
      case 4:
        response = this.createVRSReport(taskEntity);
        break;
      case 5:
        response = this.createScannedReport(taskEntity);
        break;
      case 6:
        response = this.createHWCReport(taskEntity);
        break;
      case 7:
        response = this.createFRReport(taskEntity);
        break;
      case 8:
        response = this.createFEReport(taskEntity);
        break;
      case 9:
        response = this.createIncidenceReport(taskEntity);
        break;
    }
    return response;
  }

  /**
   * Start: create reports by reportType
   */

  private createOMReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createOMReport', task);
  }

  private createCompressorReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createCompressorReport', task);
  }

  private createVRSReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createVRSReport', task);
  }

  private createScannedReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createScannedReport', task);
  }

  private createFEReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createFEReport', task);
  }

  private createHWCReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createHWCReport', task);
  }

  private createFRReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createFRReport', task);
  }

  private createIncidenceReport(task: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createIncidenceReport', task);
  }
  /**
   * End: create reports by reportType
   */

  private initNetwork(): void {
    this._subscriptionNetwork = this._networkService.getChangesNetwork().subscribe(status => {
      const text = (!status) ? 'La conexión a internet se ha perdido' : 'De nuevo en linea';
      this._snackBarService.openSnackBar(text, 'OK', (status) ? 2000 : 0);
    });
  }

  public createFRReportAndTask(task: any, stationId: string): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createFRReportAndTask?stationId='+stationId+'&type=1', task);
  }

  public createHWCReportAndTask(task: any, stationId: string): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createHWCReportAndTask?stationId='+stationId+'&type=2', task);
  }

  public createIncidenceReportAndTask(task: any, stationId: string): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createIncidenceReportAndTask?stationId='+stationId+'&type=3', task);
  }

  public listNotificationsAdmin(id: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('personId',id);
    return this._http.get(ApiService.API_URL_COMPLETE + 'listNotificationsAdmin',{params: params});
  }

  public getSasisopa(stationId: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getSasisopa', {params: params});
  }

  public saveSasisopaDocument(item: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveSasisopaDocument', item);
  }

  public saveBrigade(brigadeElems: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveBrigade', brigadeElems);
  }

  public saveEvidenceDate(stationId: string, date: number): Observable<any>{
    const options = {
      id: stationId,
      date: date
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveEvidencesDate', options);
  }

  public getSgm(stationId: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getSgm', {params: params});
  }

  public saveSgmSelection(item: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveSgmSelection', item);
  }

  public enableStation(enable: boolean, stationId: string): Observable<any>{
    const options = {
      enable: enable,
      id: stationId
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'enableStation', options);
  }
}
