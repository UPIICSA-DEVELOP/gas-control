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
import {ResetPassComponent} from '@app/ui/reset-pass/pages/reset-pass/reset-pass.component';
import {resetPassRoutes} from '@app/ui/reset-pass/reset-pass.routes';


const Components = [];

const Pages = [
  ResetPassComponent
];

const Providers = [];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(resetPassRoutes)
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
export class ResetPassModule { }
