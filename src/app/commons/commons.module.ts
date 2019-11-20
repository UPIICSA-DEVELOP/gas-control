/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@app/commons/modules/material/material.module';
import {InjectorModule} from '@app/commons/modules/injector/injector.module';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    InjectorModule
  ]
})
export class CommonsModule {
}
