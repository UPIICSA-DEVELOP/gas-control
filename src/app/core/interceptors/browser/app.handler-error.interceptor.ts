/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/internal/operators';
import {SnackBarService} from 'app/core/services/snackbar/snackbar.service';
import {Constants} from 'app/utils/constants/constants.utils';


@Injectable()
export class HandlerErrorInterceptor implements HttpInterceptor {

  constructor(
    private _snackBar: SnackBarService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage;
          if (error instanceof ErrorEvent) {
            errorMessage = `Error client side: ${error.error.message}`;
          } else {
            errorMessage = `Error server side: ${error.status} \n ${error.message}`;
          }
          this._snackBar.openSnackBar(Constants.ErrorMessageHandler, 'OK', 3000);
          return throwError(errorMessage);
        })
      );
  }
}
