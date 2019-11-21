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
import {cookiesRoutes} from '@app/ui/cookies/cookies.routes';
import {CookiesComponent} from '@app/ui/cookies/pages/cookies/cookies.component';


const Components = [];

const Pages = [
  CookiesComponent
];

const Providers = [];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(cookiesRoutes)
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
export class CookiesModule {
}
