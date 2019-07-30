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
//import {ConnectionServiceModule} from 'ng-connection-service';
import {CoreModule} from '@app/core/core.module';
import { NavBarComponent } from './components/screen/components/nav-bar/nav-bar.component';
import {ScreenComponent} from '@app/components/screen/screen.component';
import { StationStatusComponent } from './components/screen/components/station-status/station-status.component';
import { ListTasksComponent } from './components/screen/components/list-tasks/list-tasks.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationsComponent } from './components/screen/components/notifications/notifications.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '@env/environment';
import { SplashComponent } from './splash/splash.component';
import { ResetPassComponent } from './components/screen/child/reset-pass/reset-pass.component';
import { ProfileComponent } from './components/screen/components/profiles/profile/profile.component';
import { StationListComponent } from './components/screen/components/station-list/station-list.component';
import { CollaboratorsListComponent } from './components/screen/components/collaborators-list/collaborators-list.component';
import { StationProfileComponent } from './components/screen/components/profiles/station-profile/station-profile.component';
import { UserProfileComponent } from './components/screen/components/profiles/user-profile/user-profile.component';
import { FooterComponent } from './components/screen/components/footer/footer.component';
import { DirectoryListComponent } from './components/screen/components/directory-list/directory-list.component';
import { AddCollaboratorComponent } from './components/screen/components/add-collaborator/add-collaborator.component';
import { AddGasStationComponent } from './components/screen/components/add-gas-station/add-gas-station.component';
import { DocumentationComponent } from './components/screen/components/documentation/documentation.component';
import { ProceduresComponent } from './components/screen/components/procedures/procedures.component';
import { PrivacyComponent } from './components/screen/child/privacy/privacy.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddConsultancyComponent } from './components/admin/components/add-consultancy/add-consultancy.component';
import { ListStationsComponent } from './components/admin/components/list-stations/list-stations.component';
import {ListStationsService} from '@app/components/admin/components/list-stations/list-stations.service';
import {DatepickerComponent} from './components/screen/components/datepicker/datepicker.component';
import {TaskFilterComponent} from './components/screen/components/task-filter/task-filter.component';
import {ModalStationComponent} from '@app/components/screen/components/modal-station/modal-station.component';
import {AddConsultancyService} from '@app/components/admin/components/add-consultancy/add-consultancy.service';
import { ModalProceduresComponent } from './components/screen/components/modal-procedures/modal-procedures.component';
import { TermsComponent } from './components/screen/child/terms/terms.component';
import { CookiesComponent } from './components/screen/child/cookies/cookies.component';
import { SasisopaComponent } from './components/screen/components/sasisopa/sasisopa.component';
import { TaskFilterNameComponent } from './components/screen/components/task-filter-name/task-filter-name.component';
import {InjectorModule} from '@app/core/injector/injector.module';
import { OmReportComponent } from './components/screen/components/list-tasks/components/om-report/om-report.component';
import { VrsReportComponent } from './components/screen/components/list-tasks/components/vrs-report/vrs-report.component';
import { HwgReportComponent } from './components/screen/components/list-tasks/components/hwg-report/hwg-report.component';
import { ScannedReportComponent } from './components/screen/components/list-tasks/components/scanned-report/scanned-report.component';
import { HwcReportComponent } from './components/screen/components/list-tasks/components/hwc-report/hwc-report.component';
import { FrReportComponent } from './components/screen/components/list-tasks/components/fr-report/fr-report.component';
import { FeReportComponent } from './components/screen/components/list-tasks/components/fe-report/fe-report.component';
import { IncidenceReportComponent } from './components/screen/components/list-tasks/components/incidence-report/incidence-report.component';
import { CompressorReportComponent } from './components/screen/components/list-tasks/components/compressor-report/compressor-report.component';
import {HandlerErrorInterceptor} from '@app/app.handler-error.interceptor';
import { SgmComponent } from './components/screen/components/sgm/sgm.component';
import { AdminNotificationsComponent } from './components/admin/components/admin-notifications/admin-notifications.component';
import { TaskCardComponent } from './components/screen/components/task-card/task-card.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ScreenComponent,
    StationStatusComponent,
    ListTasksComponent,
    LoginComponent,
    NotificationsComponent,
    ResetPassComponent,
    NotificationsComponent,
    SplashComponent,
    ProfileComponent,
    StationListComponent,
    CollaboratorsListComponent,
    StationProfileComponent,
    UserProfileComponent,
    FooterComponent,
    DirectoryListComponent,
    AddCollaboratorComponent,
    AddGasStationComponent,
    DocumentationComponent,
    ProceduresComponent,
    PrivacyComponent,
    DatepickerComponent,
    TaskFilterComponent,
    PrivacyComponent,
    ProceduresComponent,
    AdminComponent,
    AddConsultancyComponent,
    ListStationsComponent,
    ModalStationComponent,
    ModalProceduresComponent,
    TermsComponent,
    CookiesComponent,
    SasisopaComponent,
    TaskFilterNameComponent,
    OmReportComponent,
    VrsReportComponent,
    HwgReportComponent,
    ScannedReportComponent,
    HwcReportComponent,
    FrReportComponent,
    FeReportComponent,
    IncidenceReportComponent,
    CompressorReportComponent,
    SgmComponent,
    AdminNotificationsComponent,
    TaskCardComponent
  ],
  imports: [
    CoreModule,
    InjectorModule,
    ModuleMapLoaderModule,
    HttpClientModule,
    //ConnectionServiceModule,
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(appRoutes, {useHash: true}),
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
    NgxMaterialTimepickerModule
  ],
  entryComponents: [
    AddGasStationComponent,
    DatepickerComponent,
    TaskFilterComponent,
    ListStationsComponent,
    ModalStationComponent,
    ListStationsComponent,
    AddConsultancyComponent,
    ModalProceduresComponent,
    SasisopaComponent,
    SgmComponent,
    TaskFilterNameComponent
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
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },
    ListStationsService,
    AddConsultancyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){

  }

}


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

