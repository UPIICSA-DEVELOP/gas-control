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
import {TermsComponent} from '@app/ui/terms/pages/terms/terms.component';
import {termsRoutes} from '@app/ui/terms/terms.routes';


const Components = [];

const Pages = [
  TermsComponent
];

const Providers = [];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(termsRoutes)
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
export class TermsModule {
}
