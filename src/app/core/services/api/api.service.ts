/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable, OnDestroy} from '@angular/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Consultancy} from '@app/utils/interfaces/consultancy';
import {environment} from '@env/environment';
import {Constants} from '@app/utils/constants/constants.utils';
import {map} from 'rxjs/internal/operators';
import {Person} from '@app/utils/interfaces/person';
import {Document} from '@app/utils/interfaces/document';
import {EntityResponse} from '@app/utils/class/entity-response';
import {EntityCollectionResponse} from '@app/utils/class/entity-collection-response';
import {ConsultancyBasicData} from '@app/utils/interfaces/consultancy-basic-data';
import {Station} from '@app/utils/interfaces/station';
import {PersonInformation} from '@app/utils/interfaces/person-information';
import {PersonLite} from '@app/utils/interfaces/person-lite';
import {DefaultResponse} from '@app/utils/interfaces/default-response';
import {StationTask} from '@app/utils/interfaces/station-task';
import {Task} from '@app/utils/interfaces/task';
import {UTask} from '@app/utils/interfaces/u-task';
import {StationBasicData} from '@app/utils/interfaces/station-basic-data';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {ReportComplete} from '@app/utils/class/report-complete';
import {CompressorReport} from '@app/utils/interfaces/reports/compressor-report';
import {OMReport} from '@app/utils/interfaces/reports/omr-report';
import {VRSReport} from '@app/utils/interfaces/reports/vrs-report';
import {ScannedReport} from '@app/utils/interfaces/reports/scanned-report';
import {FEReport} from '@app/utils/interfaces/reports/fe-report';
import {HWCReport} from '@app/utils/interfaces/reports/hwc-report';
import {FRReport} from '@app/utils/interfaces/reports/frr-report';
import {IncidenceReport} from '@app/utils/interfaces/reports/incidence-report';
import {Notification} from '@app/utils/interfaces/notification';
import {NetworkService, SessionStorageService, SnackBarService} from '@maplander/core';
import {OtherDocStation} from '@app/utils/interfaces/other-doc-station';
import {CustomProcedure} from '@app/utils/interfaces/customProcedure';
import {StationLite} from '@app/utils/interfaces/station-lite';

@Injectable()
export class ApiService implements OnDestroy {

  private static API_URL = environment.backendUrl;
  private static API_PATH = '/_ah/api/';
  private static API_CHANNEL = 'communication/';
  private static API_VERSION = 'v1/';
  private static API_URL_COMPLETE = ApiService.API_URL.concat(ApiService.API_PATH).concat(ApiService.API_CHANNEL)
    .concat(ApiService.API_VERSION);
  private static PROXY_ENDPOINTS = environment.apiUrl;
  private _subscriptionNetwork: Subscription;

  constructor(
    private _http: HttpClient,
    private _networkService: NetworkService,
    private _snackBarService: SnackBarService
  ) {
    this.initNetwork();
  }

  ngOnDestroy(): void {
    this._subscriptionNetwork.unsubscribe();
  }

  public signIn(options: any): Observable<EntityResponse<Person>> {
    const user = {
      email: options.email,
      password: options.password,
      token: (options.token) ? options.token : undefined,
      type: 3
    };
    return this._http.post<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'signIn', user);
  }

  public signOut(token: string): Observable<DefaultResponse> {
    const options = {
      token: token
    };
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE.concat('signOut'), options);
  }

  public resetPassword(email: string): Observable<DefaultResponse> {
    const options = {
      email: email
    };
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE.concat('sendSignInLink'), options);
  }

  public signInWithLink(id: string, token?: string): Observable<EntityResponse<Person>> {
    const options = {
      id: id,
      token: token ? token : undefined,
      type: 3
    };
    return this._http.post<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'signInWithLink', options);
  }

  public buildTaskByStation(stationTaskId: string): Observable<EntityResponse<StationTask>> {
    const options = {
      stationTaskId: stationTaskId
    };
    return this._http.post<EntityResponse<StationTask>>(ApiService.API_URL_COMPLETE + 'buildTaskByStation', options);
  }

  public ipApi(): Observable<any> {
    return this._http.get('https://ipapi.co/json/');
  }


  public getPerson(id: string): Observable<EntityResponse<Person>> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'getPerson', {params: params});
  }

  public getConsultancy(id: string): Observable<EntityResponse<Consultancy>> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get<EntityResponse<Consultancy>>(ApiService.API_URL_COMPLETE + 'getConsultancy', {params: params});
  }

  public updatePerson(person: Person): Observable<EntityResponse<Person>> {
    return this._http.put<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'updatePerson', person);
  }

  public updateConsultancy(consultancy: Consultancy): Observable<EntityResponse<Consultancy>> {
    return this._http.put<EntityResponse<Consultancy>>(ApiService.API_URL_COMPLETE + 'updateConsultancy', consultancy);
  }

  public uploadFileToBlob(part: FormData): Observable<any> {
    return this._http.post(ApiService.API_URL + '/upload', part, {
      responseType: 'json'
    });
  }

  public deleteFileToBlob(blobName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('blobName', blobName);
    return this._http.delete(ApiService.API_URL + '/upload', {params: params});
  }

  public savePersonInformation(infoPerson: any): Observable<EntityResponse<PersonInformation>> {
    return this._http.post<EntityResponse<PersonInformation>>(ApiService.API_URL_COMPLETE + 'savePersonInformation', infoPerson);
  }

  public getPersonInformation(id: string): Observable<EntityResponse<PersonInformation>> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get<EntityResponse<PersonInformation>>(ApiService.API_URL_COMPLETE + 'getPersonInformation', {params: params});
  }

  public getConsultancyBasicData(personId: string, consultancyId: string): Observable<EntityResponse<ConsultancyBasicData>> {
    let params = new HttpParams();
    params = params.append('consultancyId', consultancyId);
    params = params.append('personId', personId);
    return this._http.get<EntityResponse<ConsultancyBasicData>>(ApiService.API_URL_COMPLETE + 'getConsultancyBasicData', {params: params});
  }

  public getUtils(): Observable<EntityResponse<AppUtil>> {
    return this._http.get<EntityResponse<AppUtil>>(ApiService.API_URL_COMPLETE + 'getUtils');
  }

  public turnOnNotificationStation(personId: string, stationId: string): Observable<DefaultResponse> {
    const options = {
      personId: personId,
      stationId: stationId
    };
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE + 'turnOnNotificationStation', options);
  }

  public turnOffNotificationStation(personId: string, stationId: string): Observable<DefaultResponse> {
    const options = {
      personId: personId,
      stationId: stationId
    };
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE + 'turnOffNotificationStation', options);
  }

  public getStation(id: string): Observable<EntityResponse<Station>> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get<EntityResponse<Station>>(ApiService.API_URL_COMPLETE + 'getStation', {params: params});
  }

  public updateStation(station: Station): Observable<EntityResponse<Station>> {
    return this._http.put<EntityResponse<Station>>(ApiService.API_URL_COMPLETE + 'updateStation', station);
  }

  public getLegalRepresentativeBasicData(consultancyId: string, legalRepresentativeId: string)
    : Observable<EntityResponse<ConsultancyBasicData>> {
    let params = new HttpParams();
    params = params.append('consultancyId', consultancyId);
    params = params.append('legalRepresentativeId', legalRepresentativeId);
    return this._http.get<EntityResponse<ConsultancyBasicData>>
    (`${ApiService.API_URL_COMPLETE}getLegalRepresentativeBasicData`, {params: params});
  }

  public getStationBasicData(personId: string): Observable<EntityResponse<StationBasicData>> {
    let params = new HttpParams();
    params = params.append('personId', personId);
    return this._http.get<EntityResponse<StationBasicData>>(ApiService.API_URL_COMPLETE + 'getStationBasicData', {params: params});
  }

  public deletePerson(id: string): Observable<DefaultResponse> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.delete<DefaultResponse>(ApiService.API_URL_COMPLETE + 'deletePerson', {params: params});
  }

  public listCollaborators(refId: string, isConsultancyBoolean: string): Observable<EntityCollectionResponse<PersonLite>> {
    let params = new HttpParams();
    params = params.append('isConsultancy', isConsultancyBoolean);
    params = params.append('refId', refId);
    return this._http.get<EntityCollectionResponse<PersonLite>>(ApiService.API_URL_COMPLETE + 'listCollaborators', {params: params});
  }

  public createReferencedPerson(person: Person): Observable<EntityResponse<Person>> {
    return this._http.post<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'createReferencedPerson', person);
  }

  public updateRolePerson(personId: string, role: number): Observable<EntityResponse<Person>> {
    const options = {
      personId: personId,
      role: role
    };
    return this._http.put<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'updateRolePerson', options);
  }

  public listDocumentByStation(stationId: string, regulationType?: string): Observable<EntityCollectionResponse<Document>> {
    let params = new HttpParams();
    params = params.append('idStation', stationId);
    params = params.append('regulationType', (regulationType ? regulationType : '1'));
    return this._http.get<EntityCollectionResponse<Document>>(ApiService.API_URL_COMPLETE + 'listDocumentByStation', {params: params});
  }

  public createDocument(document: Document): Observable<EntityResponse<Document>> {
    return this._http.post<EntityResponse<Document>>(ApiService.API_URL_COMPLETE + 'createDocument', document);
  }

  public updateDocument(document: Document): Observable<EntityResponse<Document>> {
    return this._http.put<EntityResponse<Document>>(ApiService.API_URL_COMPLETE + 'updateDocument', document);
  }

  public createStation(station: Station): Observable<EntityResponse<Station>> {
    return this._http.post<EntityResponse<Station>>(ApiService.API_URL_COMPLETE + 'createStation', station);
  }

  public listPersonStationByConsultancy(refId: string): Observable<EntityCollectionResponse<PersonLite>> {
    let params = new HttpParams();
    params = params.append('consultancyCreationId', refId);
    return this._http.get<EntityCollectionResponse<PersonLite>>
    (ApiService.API_URL_COMPLETE + 'listPersonStationByConsultancy', {params: params});
  }

  public personExists(email: any): Observable<DefaultResponse> {
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE + 'personExists', email);
  }

  public updatePersonWithDifferentEmail(person: Person): Observable<EntityResponse<Person>> {
    return this._http.put<EntityResponse<Person>>(ApiService.API_URL_COMPLETE + 'updatePersonWithDifferentEmail', person);
  }

  public createStationTask(stationTask: StationTask): Observable<EntityResponse<StationTask>> {
    return this._http.post<EntityResponse<StationTask>>(ApiService.API_URL_COMPLETE + 'createStationTask', stationTask);
  }

  public getFile(url: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('url', encodeURIComponent(url));
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'download', {responseType: 'blob' as 'json', params: params});
  }

  public createConsultancy(consultancy: Consultancy): Observable<EntityResponse<Consultancy>> {
    return this._http.post<EntityResponse<Consultancy>>(ApiService.API_URL_COMPLETE + 'createConsultancy', consultancy);
  }

  public listConsultancy(): Observable<EntityCollectionResponse<Consultancy>> {
    return this._http.get<EntityCollectionResponse<Consultancy>>(ApiService.API_URL_COMPLETE + 'listConsultancy');
  }

  public listTask(filters: any): Observable<EntityCollectionResponse<Task>> {
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    if (!filters.firstOpen) {
      params = params.append('fromDate', filters.startDate);
      params = params.append('untilDate', filters.endDate);
    }
    if (filters.status !== '0') {
      params = params.append('status', filters.status);
    }
    if (filters.type !== '0') {
      params = params.append('type', filters.type);
    }
    if (filters.cursor) {
      params = params.append('cursor', filters.cursor);
    }
    return this._http.get<EntityCollectionResponse<Task>>(ApiService.API_URL_COMPLETE + 'listTask', {params: params});
  }

  public listUTask(filters: any): Observable<EntityCollectionResponse<UTask>> {
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    params = params.append('type', filters.type);
    if (!filters.firstOpen) {
      params = params.append('fromDate', filters.startDate);
      params = params.append('untilDate', filters.endDate);
    }
    return this._http.get<EntityCollectionResponse<UTask>>(ApiService.API_URL_COMPLETE + 'listUTask', {params: params});
  }

  public getStationTask(stationTaskId: string): Observable<EntityResponse<StationTask>> {
    let params = new HttpParams();
    params = params.append('id', stationTaskId);
    return this._http.get<EntityResponse<StationTask>>(ApiService.API_URL_COMPLETE + 'getStationTask', {params: params});
  }

  public businessCardService(data: any): Observable<any> {
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
    if (data.bCardId) {
      params = params.append('bCardId', data.bCardId);
    }
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'bc', {
      headers: headers,
      params: params
    });
  }


  /**
   * Method to request pdf for SASISOPA or SGM
   * @deprecated Replace for fullSasisopaRequest or fullSgmRequest
   * @param {string} stationId: Station Identifier
   * @param {boolean} isSGM: identifier for file
   * @returns {Observable<any>} entityResponse
   */
  public getFullPDF(stationId: string, isSGM: boolean): Observable<any> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    params = params.append('isSGM', isSGM ? 'true' : 'false');
    const url = environment.local ? 'https://inspector-develop.maplander.com/' : environment.url;
    return this._http.get(url + 'endpoints/v1/pdf', {params: params});
  }

  public fullSasisopaRequest(stationId: string): Observable<any> {
    const options = {
      stationId: stationId
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'fullSasisopaRequest', options);
  }

  public fullSgmRequest(stationId: string): Observable<any> {
    const options = {
      stationId: stationId
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'fullSgmRequest', options);
  }

  public joinPDF(stationId: string, isSGM: boolean): Observable<any> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    params = params.append('isSGM', isSGM ? 'true' : 'false');
    const url = environment.local ? 'https://inspector-develop.maplander.com/' : environment.url;
    return this._http.get(url + 'endpoints/v1/joinPDF', {responseType: 'blob' as 'json', params: params});
  }

  public exportReport(stationId: string, taskId: string, typeReport: number, templateId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    params = params.append('taskId', taskId);
    params = params.append('typeReport', typeReport.toString());
    params = params.append('templateId', templateId.toString());
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'exportReport', {responseType: 'blob' as 'json', params: params});
  }

  public exportCalendarByTaskList(filters: any, uTask: boolean): Observable<any> {
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    params = params.append('uTask', (uTask ? 'true' : 'false'));
    if (!filters.firstOpen) {
      params = params.append('fromDate', filters.startDate);
      params = params.append('untilDate', filters.endDate);
    }
    if (filters.status !== '0' && !uTask) {
      params = params.append('status', filters.status);
    }
    if (filters.type !== '0') {
      params = params.append('typeTask', filters.type);
    }
    return this._http.get(ApiService.PROXY_ENDPOINTS + 'exportCalendarByTaskList', {responseType: 'blob' as 'json', params: params});
  }

  public getCompleteInfoDashboard(userId: string, refId: string, role: number, onlyOneStationId?: any): Observable<any> {
    let response1 = null;
    const response2 = this.getUtils();
    if (onlyOneStationId) {
      response1 = this.getStation(onlyOneStationId);
    } else {
      if (role === 7) {
        let stationId;
        stationId = undefined;
        const stationsView = SessionStorageService.getItem<{stationId: string, consultancyId: string, lastView: boolean}[]>
        (Constants.StationAdmin) || [];
        if (stationsView) {
          stationsView.forEach(item => {
            if (item.lastView) {
              stationId = item.stationId;
            }
          });
          response1 = this.getStation(stationId);
        }
      } else {
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
    return forkJoin([response1, response2]).pipe(map((resp: any[]) => {
      return {station: resp[0], utils: resp[1]};
    }));
  }

  public uploadToBusinessCard(form: FormData): Observable<any> {
    return this._http.post('https://business-card-74ca5.appspot.com/upload', form);
  }

  public listNotifications(personId: string, stationId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('personId', personId);
    params = params.append('stationId', stationId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'listNotifications', {params: params});
  }

  public deleteNotification(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.delete(ApiService.API_URL_COMPLETE + 'deleteNotification', {params: params});
  }

  /**
   * Start: list reports by reportType
   */

  public getTaskInformation(taskId: string, typeReport: number): Observable<any> {
    let response = null;
    let params = new HttpParams();
    params = params.append('taskId', taskId);
    switch (typeReport) {
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
  }

  /**
   * TypeReport = 1 | Operación y mantenimiento
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listOMReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listOMReport', {params: params});
  }

  /**
   * TypeReport = 2 | Compresor
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listCompressorReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listCompressorReport', {params: params});
  }

  /**
   * TypeReport = 4 | Sistema de recuperación de vapores
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listVRSReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listVRSReport', {params: params});
  }

  /**
   * TypeReport = 5 | Limpieza ecológica
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listScannedReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listScannedReport', {params: params});
  }

  /**
   * TypeReport = 6 | Recolección de residuos peligrosos
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listHWCReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listHWCReport', {params: params});
  }

  /**
   * TypeReport = 7 | Recepción y descarga de combustible
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listFRReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listFRReport', {params: params});
  }

  /**
   * TypeReport = 8 | Revisión de extintores
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listFEReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listFEReport', {params: params});
  }

  /**
   * TypeReport = 9 | Incidencia
   * @param {HttpParams} params
   * @return {Observable<any>}
   */
  private listIncidenceReport(params: HttpParams): Observable<any> {
    return this._http.get(ApiService.API_URL_COMPLETE + 'listIncidenceReport', {params: params});
  }

  /**
   * End: list reports by reportType
   */

  public createTask(report: any, type: number): Observable<any> {
    let response = null;
    switch (type) {
      case 1:
        response = this.createOMReport(report);
        break;
      case 2:
        response = this.createCompressorReport(report);
        break;
      case 4:
        response = this.createVRSReport(report);
        break;
      case 5:
        response = this.createScannedReport(report);
        break;
      case 6:
        response = this.createHWCReport(report);
        break;
      case 7:
        response = this.createFRReport(report);
        break;
      case 8:
        response = this.createFEReport(report);
        break;
      case 9:
      case 10:
        response = this.createIncidenceReport(report);
        break;
    }
    return response;
  }

  /**
   * Start: create reports by reportType
   */

  private createOMReport(report: OMReport): Observable<EntityResponse<ReportComplete<Task, OMReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, OMReport>>>(ApiService.API_URL_COMPLETE + 'createOMReport', report);
  }

  private createCompressorReport(report: CompressorReport): Observable<EntityResponse<ReportComplete<Task, CompressorReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, CompressorReport>>>
    (ApiService.API_URL_COMPLETE + 'createCompressorReport', report);
  }

  private createVRSReport(report: VRSReport): Observable<EntityResponse<ReportComplete<Task, VRSReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, VRSReport>>>(ApiService.API_URL_COMPLETE + 'createVRSReport', report);
  }

  private createScannedReport(report: ScannedReport): Observable<EntityResponse<ReportComplete<Task, ScannedReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, ScannedReport>>>
    (ApiService.API_URL_COMPLETE + 'createScannedReport', report);
  }

  private createFEReport(report: FEReport): Observable<EntityResponse<ReportComplete<Task, FEReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, FEReport>>>(ApiService.API_URL_COMPLETE + 'createFEReport', report);
  }

  private createHWCReport(report: HWCReport): Observable<EntityResponse<ReportComplete<Task, HWCReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, HWCReport>>>(ApiService.API_URL_COMPLETE + 'createHWCReport', report);
  }

  private createFRReport(report: FRReport): Observable<EntityResponse<ReportComplete<Task, FRReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, FRReport>>>(ApiService.API_URL_COMPLETE + 'createFRReport', report);
  }

  private createIncidenceReport(report: IncidenceReport): Observable<EntityResponse<ReportComplete<Task, IncidenceReport>>> {
    return this._http.post<EntityResponse<ReportComplete<Task, IncidenceReport>>>(ApiService.API_URL_COMPLETE + 'createIncidenceReport', report);
  }

  /**
   * End: create reports by reportType
   */

  public createFRReportAndTask(task: any, stationId: string): Observable<any> {
    return this._http.post(ApiService.API_URL_COMPLETE + 'createFRReportAndTask?stationId=' + stationId + '&type=1', task);
  }

  public createHWCReportAndTask(task: any, stationId: string): Observable<any> {
    return this._http.post(ApiService.API_URL_COMPLETE + 'createHWCReportAndTask?stationId=' + stationId + '&type=2', task);
  }

  public createIncidenceReportAndTask(task: any, stationId: string, type: '3'|'4'): Observable<any> {
    return this._http.post(ApiService.API_URL_COMPLETE + 'createIncidenceReportAndTask?stationId=' + stationId + '&type=' + type, task);
  }

  public listNotificationsAdmin(id: string): Observable<EntityCollectionResponse<Notification>> {
    let params = new HttpParams();
    params = params.append('personId', id);
    return this._http.get<EntityCollectionResponse<Notification>>(ApiService.API_URL_COMPLETE + 'listNotificationsAdmin', {params: params});
  }

  public getSasisopa(stationId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getSasisopa', {params: params});
  }

  public saveSasisopaDocument(item: any): Observable<any> {
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveSasisopaDocument', item);
  }

  public saveBrigade(brigadeElems: any): Observable<any> {
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveBrigade', brigadeElems);
  }

  public saveEvidenceDate(stationId: string, date: number): Observable<any> {
    const options = {
      id: stationId,
      date: date
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveEvidencesDate', options);
  }

  public getSgm(stationId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getSgm', {params: params});
  }

  public saveSgmSelection(item: any): Observable<any> {
    return this._http.post(ApiService.API_URL_COMPLETE + 'saveSgmSelection', item);
  }

  public enableStation(enable: boolean, stationId: string): Observable<EntityResponse<Station>> {
    const options = {
      enable: enable,
      id: stationId
    };
    return this._http.post<EntityResponse<Station>>(ApiService.API_URL_COMPLETE + 'enableStation', options);
  }

  public updateLegalRepresentativeInStation(personId: string, stationId: string): Observable<DefaultResponse> {
    let params = new HttpParams();
    params = params.append('personId', personId);
    params = params.append('stationId', stationId);
    return this._http.put<DefaultResponse>(ApiService.API_URL_COMPLETE + 'updateLegalRepresentativeInStation', {}, {
      params
    });
  }

  public sendEmailToValidateAccount(personId: string): Observable<DefaultResponse> {
    let params = new HttpParams();
    params = params.append('id', personId);
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE + 'sendEmailToValidateAccount', {}, {
      params
    });
  }

  public saveOtherDocStation(docs: OtherDocStation): Observable<EntityResponse<OtherDocStation>> {
    return this._http.post<EntityResponse<OtherDocStation>>(ApiService.API_URL_COMPLETE + 'saveOtherDocStation', docs);
  }

  public getOtherDocStation(id: string): Observable<EntityResponse<OtherDocStation>> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get<EntityResponse<OtherDocStation>>(ApiService.API_URL_COMPLETE + 'getOtherDocStation', {
      params
    });
  }

  public getAllSgm(stationTaskId: string, status: number, cursor: string | null,
                   limit: number): Observable<EntityCollectionResponse<Task>> {
    let params = new HttpParams();
    params = params.append('stationTaskId', stationTaskId);
    params = params.append('status', status.toString());
    params = params.append('limit', limit ? limit.toString() : '30');
    if (cursor) {
      params = params.append('cursor', cursor);
    }
    return this._http.get<EntityCollectionResponse<Task>>(ApiService.API_URL_COMPLETE + 'getAllSgm', {
      params: params
    });
  }

  public createCustomProcedure(procedure: CustomProcedure): Observable<EntityResponse<CustomProcedure>> {
    return this._http.post<EntityResponse<CustomProcedure>>(ApiService.API_URL_COMPLETE + 'createCustomProcedure', procedure);
  }

  public customProcedureList(stationId: string): Observable<EntityCollectionResponse<CustomProcedure>> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    return this._http.post<EntityCollectionResponse<CustomProcedure>>(ApiService.API_URL_COMPLETE + 'customProcedureList', {}, {
      params: params
    });
  }

  public resetStation(stationId: string): Observable<DefaultResponse> {
    let params = new HttpParams();
    params = params.append('stationId', stationId);
    return this._http.post<DefaultResponse>(ApiService.API_URL_COMPLETE + 'resetStation', {}, {
      params: params
    });
  }

  public listStationTaskByStation(stationId: string): Observable<EntityCollectionResponse<StationTask>> {
    let params = new HttpParams();
    params = params.append('idStation', stationId);
    return this._http.get<EntityCollectionResponse<StationTask>>(ApiService.API_URL_COMPLETE + 'listStationTaskByStation', {
      params: params
    });
  }

  public deleteTask(taskId: string): Observable<EntityResponse<StationLite>> {
    let  params = new HttpParams();
    params = params.append('taskId', taskId);
    return this._http.delete<EntityResponse<StationLite>>(ApiService.API_URL_COMPLETE + 'deleteTask', {
      params: params
    });
  }

  private initNetwork(): void {
    this._subscriptionNetwork = this._networkService.getNetworkChanges().subscribe(status => {
      const text = (!status) ? 'La conexión a internet se ha perdido' : 'De nuevo en linea';
      this._snackBarService.setMessage(text, 'OK', (status) ? 2000 : 0);
    });
  }


}
