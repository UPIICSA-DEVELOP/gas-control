/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserStateInterceptor} from '@app/core/interceptors/browser/app.browser.interceptor';
import {HandlerErrorInterceptor} from '@app/core/interceptors/browser/app.handler-error.interceptor';
import {LoaderInterceptor} from '@app/core/interceptors/browser/app.loader.interceptor';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandlerErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ]
})
export class InterceptorsBrowserModule {
}
