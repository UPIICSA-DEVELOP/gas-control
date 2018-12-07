/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {BrowserModule, BrowserTransferStateModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {BrowserStateInterceptor} from '@app/app.browser.interceptor';
import {GestureConfig} from '@angular/material';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {ConnectionServiceModule} from 'ng-connection-service';
import {CoreModule} from '@app/core/core.module';
import { NavBarComponent } from './components/screen/components/nav-bar/nav-bar.component';
import {ScreenComponent} from '@app/components/screen/screen.component';
import { CollaboratorsComponent } from './components/screen/components/collaborators/collaborators.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ScreenComponent,
    CollaboratorsComponent
  ],
  imports: [
    CoreModule,
    ModuleMapLoaderModule,
    HttpClientModule,
    ConnectionServiceModule,
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    //AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(appRoutes),
    AngularFireMessagingModule,
    BrowserModule.withServerTransition({
      appId: 'com.maplander.inspector.front'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  entryComponents: [

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

