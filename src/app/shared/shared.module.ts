/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '@app/shared/components/components.module';
import {SharedPipesModule} from '@app/shared/pipes/shared.pipes.module';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ComponentsModule,
    SharedPipesModule
  ]
})
export class SharedModule {
}
