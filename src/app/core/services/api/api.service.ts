/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  public deleteFileToBlob(blob: FormData): Observable<any> {
    return this._http.post('https://schedule-maplander.appspot.com/upload', blob);
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

  private initNetwork(): void {
    this._networkService.getChangesNetwork().subscribe(status => {
      const text = (!status) ? 'La conexión a internet se ha perdido' : 'De nuevo en linea';
      this._snackBarService.openSnackBar(text, 'OK', (status) ? 2000 : 0);
    });
  }
}
