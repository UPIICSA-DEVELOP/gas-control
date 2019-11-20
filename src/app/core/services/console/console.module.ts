/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConsoleService} from '@app/core/services/console/console.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [],
  declarations: [],
  entryComponents: [],
  providers: []
})
export class ConsoleModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ConsoleModule,
      providers: [
        ConsoleService,
        {
          provide: APP_INITIALIZER,
          useFactory: init,
          multi: true,
          deps: [ConsoleService]
        }
      ]
    };
  }
}

export function init(service: ConsoleService): () => Promise<any> {
  return (): Promise<any> => {
    return service.init();
  };
}
