/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {observable, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignaturePadService {

  constructor(
    private _api: ApiService
  ) { }

  uploadSignature(formData: FormData): Observable<any>{
    return new Observable((observable)=>{
      this._api.uploadFileToBlob(formData).subscribe(response=>{
        observable.next(response);
      })
    })
  }
}
