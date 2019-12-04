/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {dashboardRoutes} from '@app/ui/dashboard/dashboard.routes';
import {AddCollaboratorComponent} from '@app/ui/dashboard/pages/add-collaborator/add-collaborator.component';
import {CollaboratorsListComponent} from '@app/ui/dashboard/pages/collaborators-list/collaborators-list.component';
import {DatepickerComponent} from '@app/ui/dashboard/components/datepicker/datepicker.component';
import {DatepickerService} from '@app/ui/dashboard/components/datepicker/datepicker.service';
import {DirectoryListComponent} from '@app/ui/dashboard/components/directory-list/directory-list.component';
import {DocumentationComponent} from '@app/ui/dashboard/pages/documentation/documentation.component';
import {DocumentationService} from '@app/ui/dashboard/pages/documentation/documentation.service';
import {FeReportComponent} from '@app/ui/dashboard/components/list-tasks/components/fe-report/fe-report.component';
import {FrReportComponent} from '@app/ui/dashboard/components/list-tasks/components/fr-report/fr-report.component';
import {HwcReportComponent} from '@app/ui/dashboard/components/list-tasks/components/hwc-report/hwc-report.component';
import {HwgReportComponent} from '@app/ui/dashboard/components/list-tasks/components/hwg-report/hwg-report.component';
import {IncidenceReportComponent} from '@app/ui/dashboard/components/list-tasks/components/incidence-report/incidence-report.component';
import {OmReportComponent} from '@app/ui/dashboard/components/list-tasks/components/om-report/om-report.component';
import {ScannedReportComponent} from '@app/ui/dashboard/components/list-tasks/components/scanned-report/scanned-report.component';
import {VrsReportComponent} from '@app/ui/dashboard/components/list-tasks/components/vrs-report/vrs-report.component';
import {ListTasksComponent} from '@app/ui/dashboard/components/list-tasks/list-tasks.component';
import {ModalProceduresComponent} from '@app/ui/dashboard/components/modal-procedures/modal-procedures.component';
import {ModalProceduresService} from '@app/ui/dashboard/components/modal-procedures/modal-procedures.service';
import {NavBarComponent} from '@app/ui/dashboard/components/nav-bar/nav-bar.component';
import {NotificationsComponent} from '@app/ui/dashboard/pages/notifications/notifications.component';
import {ProceduresComponent} from '@app/ui/dashboard/pages/procedures/procedures.component';
import {ProfileComponent} from '@app/ui/dashboard/pages/profiles/profile/profile.component';
import {ProfileService} from '@app/ui/dashboard/pages/profiles/profile/profile.service';
import {StationProfileComponent} from '@app/ui/dashboard/pages/profiles/station-profile/station-profile.component';
import {StationProfileService} from '@app/ui/dashboard/pages/profiles/station-profile/station-profile.service';
import {UserProfileService} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.service';
import {SasisopaComponent} from '@app/ui/dashboard/components/sasisopa/sasisopa.component';
import {SasisopaService} from '@app/ui/dashboard/components/sasisopa/sasisopa.service';
import {SgmComponent} from '@app/ui/dashboard/components/sgm/sgm.component';
import {SgmService} from '@app/ui/dashboard/components/sgm/sgm.service';
import {StationListComponent} from '@app/ui/dashboard/pages/station-list/station-list.component';
import {StationStatusComponent} from '@app/ui/dashboard/components/station-status/station-status.component';
import {TaskCardComponent} from '@app/ui/dashboard/components/task-card/task-card.component';
import {TaskFilterComponent} from '@app/ui/dashboard/components/task-filter/task-filter.component';
import {TaskFilterService} from '@app/ui/dashboard/components/task-filter/task-filter.service';
import {TaskFilterNameComponent} from '@app/ui/dashboard/components/task-filter-name/task-filter-name.component';
import {TaskFilterNameService} from '@app/ui/dashboard/components/task-filter-name/task-filter-name.service';
import {CompressorReportComponent} from '@app/ui/dashboard/components/list-tasks/components/compressor-report/compressor-report.component';
import {UserProfileComponent} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.component';
import {DashboardComponent} from '@app/ui/dashboard/pages/dashboard/dashboard.component';
import {UploadFileModule} from '@maplander/core';


const Reports = [
  CompressorReportComponent,
  FeReportComponent,
  FrReportComponent,
  HwcReportComponent,
  HwgReportComponent,
  IncidenceReportComponent,
  OmReportComponent,
  ScannedReportComponent,
  VrsReportComponent
];

const Profiles = [
  ProfileComponent,
  StationProfileComponent,
  UserProfileComponent
];


const Components = [
  DatepickerComponent,
  DirectoryListComponent,
  ListTasksComponent,
  Reports,
  ModalProceduresComponent,
  NavBarComponent,
  SasisopaComponent,
  SgmComponent,
  StationStatusComponent,
  TaskCardComponent,
  TaskFilterComponent,
  TaskFilterNameComponent
];

const Pages = [
  AddCollaboratorComponent,
  CollaboratorsListComponent,
  DashboardComponent,
  DocumentationComponent,
  NotificationsComponent,
  ProceduresComponent,
  Profiles,
  StationListComponent
];

const Providers = [
  DatepickerService,
  DocumentationService,
  ModalProceduresService,
  ProfileService,
  StationProfileService,
  UserProfileService,
  SasisopaService,
  SgmService,
  TaskFilterService,
  TaskFilterNameService
];

const EntryComponents = [
  DatepickerComponent,
  ModalProceduresComponent,
  SasisopaComponent,
  SgmComponent,
  TaskFilterComponent,
  TaskFilterNameComponent
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(dashboardRoutes),
    UploadFileModule
  ],
  declarations: [
    Components,
    Pages
  ],
  exports: [],
  providers: [
    Providers
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class DashboardModule {
}
