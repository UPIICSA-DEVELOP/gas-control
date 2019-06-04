/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconsService} from '@app/core/services/icons/icons.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [],
  declarations: [],
  entryComponents: [],
  providers: []
})
export class IconsModule {

  public static forRoot(): ModuleWithProviders{
    return {
      ngModule: IconsModule,
      providers: [
        IconsService,
        {
          provide: APP_INITIALIZER,
          useFactory: init,
          multi: true,
          deps: [IconsService]
        }
      ]
    }
  }
}

export function init(service: IconsService): () => Promise<any>{
  return (): Promise<any> => {
    return service.init();
  }
}
