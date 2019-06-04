/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { REQUEST } from '@nguniversal/express-engine/tokens';
import * as express from 'express';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {environment} from 'environments/environment';
const CURRENT_URL = environment.url;

@Injectable()
export class TranslateInterceptor implements HttpInterceptor {

  constructor(@Inject(REQUEST) private request: express.Request) {}


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.includes('i18n')) {
      let url = CURRENT_URL + request.url.replace('./assets','assets');
      request = request.clone({
        url:  url
      });
    }
    return next.handle(request);
  }
}
