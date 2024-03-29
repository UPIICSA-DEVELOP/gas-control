/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {TransferState, makeStateKey} from '@angular/platform-browser';

import {Observable, of} from 'rxjs';
import {Platform} from '@angular/cdk/platform';

@Injectable()
export class BrowserStateInterceptor implements HttpInterceptor {

  constructor(
    private _transferState: TransferState,
    private _platform: Platform
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storedResponse: any = this._transferState.get(makeStateKey(req.url), null);
    if (storedResponse && !this._platform.isBrowser) {
      const response = new HttpResponse({body: storedResponse, status: 200});
      return of(response);
    }
    return next.handle(req);
  }
}
