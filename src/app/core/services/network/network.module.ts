/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NetworkService} from '@app/core/services/network/network.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [],
  declarations: [],
  entryComponents: [],
  providers: []
})
export class NetworkModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NetworkModule,
      providers: [
        NetworkService,
        {
          provide: APP_INITIALIZER,
          useFactory: init,
          multi: true,
          deps: [NetworkService]
        }
      ]
    };
  }
}

export function init(service: NetworkService): () => Promise<any> {
  return (): Promise<any> => {
    return service.init();
  };
}

