/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { NgModule} from '@angular/core';
import {ConvertTimeAndCapacityPipe} from '@app/core/pipes/convert-time-and-capacity/convert-time-and-capacity.pipe';

@NgModule({
  declarations: [
    ConvertTimeAndCapacityPipe
  ],
  imports: [

  ],
  exports: [
    ConvertTimeAndCapacityPipe
  ],
  providers: [
    ConvertTimeAndCapacityPipe
  ]
})
export class PipesModule {
  constructor() {
  }
}
