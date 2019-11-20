/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SplashComponent} from '@app/core/components/splash/splash.component';
import {CommonsModule} from '@app/commons/commons.module';
import {LoaderComponent} from '@app/core/components/loader/loader.component';
import {LoaderService} from '@app/core/components/loader/loader.service';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule
  ],
  declarations: [
    SplashComponent,
    LoaderComponent
  ],
  exports: [
    SplashComponent,
    LoaderComponent
  ],
  providers: [
    LoaderService
  ]
})
export class CoreComponentsModule {
}
