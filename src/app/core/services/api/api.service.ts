/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NetworkService} from '@app/core/services/connection/network.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';


@Injectable()
export class ApiService {

  private static API_URL = 'https://schedule-maplander.appspot.com/_ah/api/';
  private static API_CHANNEL = 'communication/';
  private static API_VERSION = 'v1/';
  private static API_URL_COMPLETE = ApiService.API_URL + ApiService.API_CHANNEL + ApiService.API_VERSION;

  constructor(
    private _http: HttpClient,
    private _networkService: NetworkService,
    private _snackBarService: SnackBarService
  ) {
    this.initNetwork();
  }

  public signIn(options: any): Observable<any> {
    const user = {
      email: options.email,
      password: options.password,
      token: (options.token)?options.token:'123',
      type: 3
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'signIn', user);
  }

   public  resetPassword(email: string): Observable<any> {
     const options = {
       email: email
     };
    return this._http.post(ApiService.API_URL_COMPLETE + 'sendSignInLink', options);
   }

   public signInWithLink(id: string): Observable<any> {
    const options = {
      id: id,
      token: '123',
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
    return this._http.post('https://schedule-maplander.appspot.com/upload', part);
  }

  public deleteFileToBlob(blobName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('blobName', blobName);
    return this._http.delete('https://schedule-maplander.appspot.com/upload', {params: params});
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

  public updateDocumet(document: any):Observable<any>{
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
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this._http.get(url, {responseType: 'arraybuffer' as 'json', headers: headers});
  }

  public createConsultancy(data: any): Observable<any>{
    const request = {
      address: data.address,
      businessName: data.businessName,
      location:
        {
          latitude: data.location.latitude,
          longitude: data.location.longitude
        },
      officePhone: data.officePhone,
      rfc: data.rfc
    };
    return this._http.post(ApiService.API_URL_COMPLETE + 'createConsultancy', request);
  }

  public createPerson(person: any): Observable<any>{
    return this._http.post(ApiService.API_URL_COMPLETE + 'createPerson', person);
  }

  public listConsultancy(): Observable<any>{
    return this._http.get(ApiService.API_URL_COMPLETE + 'listConsultancy',);
  }

  public listTaskDateStatus(filters: any): Observable<any>{
    let params = new HttpParams();
    params = params.append('stationTaskId', filters.stationTaskId);
    params = params.append('fromDate', filters.startDate);
    if(filters.status !== '5'){
      params = params.append('status', filters.status);
    }
    params = params.append('untilDate', filters.endDate);
    return this._http.get(ApiService.API_URL_COMPLETE + 'listTaskDateStatus', {params: params});
  }

  public getStationTask(stationTaskId: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('id', stationTaskId);
    return this._http.get(ApiService.API_URL_COMPLETE + 'getStationTask', {params: params});
  }

  public businessCardService(data: any): Observable<any>{
    let params = new HttpParams();
    params = params.append('imageUrl', data.imageUrl || '');
    params = params.append('company', data.company || '');
    params = params.append('name', data.name || '');
    params = params.append('workPosition', data.workPosition || '');
    params = params.append('phone', data.phone || '');
    params = params.append('email', data.email || '');
    params = params.append('website', data.website || '');
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this._http.get('https://inspector-maplander-develop.appspot.com/bc', {
      responseType: 'blob' as 'json',
      headers: headers,
      params: params
    });
  }

  public getCompleteInfoDashboard(userId: string, refId: string, role: number, onlyOneStationId?: any): Observable<any>{
    let response1 = null;
    let response2 = this.getUtils();
    if(onlyOneStationId){
      response1 = this.getStation(onlyOneStationId);
    }else{
      switch (role) {
        case 1:
        case 2:
        case 3:
        case 7:
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
    return forkJoin(response1, response2);
  }

  public uploadToBusinessCard(form: FormData): Observable<any>{
    return this._http.post('https://business-card-74ca5.appspot.com/upload', form);
  }

  private initNetwork(): void {
    this._networkService.getChangesNetwork().subscribe(status => {
      const text = (!status) ? 'La conexión a internet se ha perdido' : 'De nuevo en linea';
      this._snackBarService.openSnackBar(text, 'OK', (status) ? 2000 : 0);
    });
  }
}
