/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {Observable} from 'rxjs';

@Injectable()
export class UploadImageService {

  constructor(
    private _api: ApiService
  ) { }

  uploadImage(formData: FormData): Observable<any>{
    return new Observable((observable) => {
      this._api.getBlobStore().subscribe((blob) => {
        this._api.uploadFileToBlob(blob, formData).subscribe((response) => {
          observable.next(response);
        });
      });
    });
  }
}
