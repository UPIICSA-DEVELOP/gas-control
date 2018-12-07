/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/core/material/material.module';
import {ServerStateInterceptor} from './app.server.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateInterceptor} from '@app/app.translate.interceptor';

@NgModule({
  imports: [
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    MaterialModule,
    AppModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerStateInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TranslateInterceptor,
      multi: true
    }
  ]
})
export class AppServerModule { }
