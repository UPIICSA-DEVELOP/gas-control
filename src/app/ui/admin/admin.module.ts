/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from '@app/ui/admin/pages/admin/admin.component';
import {AdminNotificationsComponent} from '@app/ui/admin/pages/admin-notifications/admin-notifications.component';
import {ListStationsComponent} from '@app/ui/admin/components/list-stations/list-stations.component';
import {AddConsultancyService} from '@app/ui/admin/components/add-consultancy/add-consultancy.service';
import {ListStationsService} from '@app/ui/admin/components/list-stations/list-stations.service';
import {SharedModule} from '@app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {adminRoutes} from '@app/ui/admin/admin.routes';
import {AddConsultancyComponent} from '@app/ui/admin/components/add-consultancy/add-consultancy.component';
import {UploadFileModule} from '@maplander/core';

const Components = [
  AddConsultancyComponent,
  ListStationsComponent
];


const Pages = [
  AdminComponent,
  AdminNotificationsComponent
];

const Providers = [
  AddConsultancyService,
  ListStationsService
];

const EntryComponents = [
  ListStationsComponent,
  AddConsultancyComponent
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(adminRoutes),
    UploadFileModule
  ],
  declarations: [
    Components,
    Pages
  ],
  exports: [],
  entryComponents: [
    EntryComponents
  ],
  providers: [
    Providers
  ]
})
export class AdminModule {
}
