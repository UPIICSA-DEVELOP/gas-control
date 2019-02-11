/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { NgModule} from '@angular/core';
import {ConvertTimeAndCapacityPipe} from '@app/core/pipes/convert-time-and-capacity/convert-time-and-capacity.pipe';
import {FormatDatePipe} from '@app/core/pipes/format-date/format-date.pipe';

@NgModule({
  declarations: [
    ConvertTimeAndCapacityPipe,
    FormatDatePipe
  ],
  imports: [

  ],
  exports: [
    ConvertTimeAndCapacityPipe,
    FormatDatePipe
  ],
  providers: [
    ConvertTimeAndCapacityPipe,
    FormatDatePipe
  ]
})
export class PipesModule {
  constructor() {
  }
}
