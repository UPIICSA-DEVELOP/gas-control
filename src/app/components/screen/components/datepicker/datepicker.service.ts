/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DatepickerComponent} from 'app/components/screen/components/datepicker/datepicker.component';

export interface DateRangeOptions {
  minDate: Date;
  maxDate: Date;
}

@Injectable()
export class DatepickerService {

  constructor(
    private _matDialog: MatDialog
  ) { }

  public open(dateConfig?: DateRangeOptions):MatDialogRef<DatepickerComponent>{
    return this._matDialog.open(DatepickerComponent,{panelClass:'date-panel', disableClose: true, data: dateConfig})
  }
}
