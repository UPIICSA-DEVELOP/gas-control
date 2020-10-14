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
import {DirectoryListComponent} from '@app/ui/dashboard/components/directory-list/directory-list.component';
import {DocumentationComponent} from '@app/ui/dashboard/pages/documentation/documentation.component';
import {DocumentationService} from '@app/ui/dashboard/pages/documentation/documentation.service';
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
import {UserProfileComponent} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.component';
import {DashboardComponent} from '@app/ui/dashboard/pages/dashboard/dashboard.component';
import {DialogModule, UploadFileModule, CountryCodeModule} from '@maplander/core';
import { ArchiveComponent } from './pages/archive/archive.component';


const Profiles = [
  ProfileComponent,
  StationProfileComponent,
  UserProfileComponent
];


const Components = [
  DirectoryListComponent,
  ModalProceduresComponent,
  NavBarComponent,
  SasisopaComponent,
  SgmComponent,
  StationStatusComponent
];

const Pages = [
  ArchiveComponent,
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
  DocumentationService,
  ModalProceduresService,
  ProfileService,
  StationProfileService,
  UserProfileService,
  SasisopaService,
  SgmService
];

const EntryComponents = [
  ModalProceduresComponent,
  SasisopaComponent,
  SgmComponent
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CountryCodeModule,
    RouterModule.forChild(dashboardRoutes),
    UploadFileModule,
    DialogModule
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
