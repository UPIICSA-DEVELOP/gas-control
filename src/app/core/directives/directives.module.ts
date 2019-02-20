/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DisableWriteDirective} from '@app/core/directives/disable-write/disable-write.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DisableWriteDirective
  ],
  exports: [
    DisableWriteDirective
  ]
})
export class DirectivesModule { }
