/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { NgModule} from '@angular/core';
import {ConvertTimeAndCapacityPipe} from '@app/shared/pipes/convert-time-and-capacity/convert-time-and-capacity.pipe';
import {FormatDatePipe} from '@app/shared/pipes/format-date/format-date.pipe';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {FormatFolioPipe} from '@app/shared/pipes/format-folio/format-folio.pipe';

const Pipes = [
  ConvertTimeAndCapacityPipe,
  FormatDatePipe,
  FormatTimePipe,
  FormatFolioPipe
];


@NgModule({
  declarations: Pipes,
  imports: [],
  exports: Pipes,
  providers: []
})

export class SharedPipesModule {}
