/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {Observable} from 'rxjs';

@Injectable()
export class UploadFileService {

  constructor(
    private _api: ApiService
  ) {
  }

  upload(formData: FormData): Observable<any> {
    return new Observable((observable) => {
      this._api.uploadFileToBlob(formData).subscribe((response) => {
        observable.next(response);
        observable.complete();
      });
    });
  }

  delete(blobName: string): Observable<any> {
    return new Observable((observable) => {
      this._api.deleteFileToBlob(blobName).subscribe((response) => {
        observable.next(response);
        observable.complete();
      });
    });
  }

  uploadToBusinessCard(formData: FormData): Observable<any> {
    return new Observable((observable) => {
      this._api.uploadToBusinessCard(formData).subscribe((response) => {
        observable.next(response);
        observable.complete();
      });
    });
  }

}
