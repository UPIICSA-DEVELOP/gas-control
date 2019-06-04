/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {PrivacyComponent} from '@app/ui/privacy/pages/privacy/privacy.component';
import {privacyRoutes} from '@app/ui/privacy/privacy.routes';


const Components = [];

const Pages = [
  PrivacyComponent
];

const Providers = [];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(privacyRoutes)
  ],
  declarations: [
    Components,
    Pages
  ],
  exports: [],
  providers: [
    Providers
  ]
})
export class PrivacyModule { }
