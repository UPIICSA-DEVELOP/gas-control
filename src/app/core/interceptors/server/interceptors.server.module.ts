/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ServerStateInterceptor} from '@app/core/interceptors/server/app.server.interceptor';
import {TranslateInterceptor} from '@app/core/interceptors/server/app.translate.interceptor';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerStateInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TranslateInterceptor,
      multi: true
    }
  ]
})
export class InterceptorsServerModule {
}
