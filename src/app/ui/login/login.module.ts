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
import {loginRoutes} from '@app/ui/login/login.routes';
import {LoginComponent} from '@app/ui/login/pages/login/login.component';


const Components = [];

const Pages = [
  LoginComponent
];

const Providers = [];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(loginRoutes)
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
export class LoginModule {
}
