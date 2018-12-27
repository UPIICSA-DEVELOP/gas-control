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

  public getBlobStore(): Observable<any> {
    return this._http.get('https://1-dot-inmobimapa-backend.appspot.com/blob/androidserveurl', {responseType: 'text'});
  }

  public getPerson(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this._http.get(ApiService.API_URL_COMPLETE+ 'getPerson',{params: params});
  }

  public updatePerson(person: any): Observable<any> {
    return this._http.put( ApiService.API_URL_COMPLETE + 'updatePerson', person);
  }

  public uploadFileToBlob(url, body: any): Observable<any> {
    return this._http.post(url, body);
  }

  private initNetwork(): void {
    this._networkService.getChangesNetwork().subscribe(status => {
      const text = (!status) ? 'La conexión a internet se ha perdido' : 'De nuevo en linea';
      this._snackBarService.openSnackBar(text, 'OK', (status) ? 2000 : 0);
    });
  }
}
