/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InterceptorsBrowserModule} from '@app/core/interceptors/browser/interceptors.browser.module';
import {ServicesModule} from '@app/core/services/services.module';
import {CoreComponentsModule} from '@app/core/components/core.components.module';
import {CoreDirectivesModule} from '@app/core/directives/core.directives.module';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule.forRoot()
  ],
  exports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    InterceptorsBrowserModule
  ]
})
export class CoreModule {

  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
