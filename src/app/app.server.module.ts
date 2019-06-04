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
import {MaterialModule} from '@app/commons/modules/material/material.module';
import {InterceptorsServerModule} from '@app/core/interceptors/server/interceptors.server.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    MaterialModule,
    InterceptorsServerModule
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppServerModule { }
