/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  public dateForm: FormGroup;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  constructor(
    private _dialogRef: MatDialogRef<DatepickerComponent>,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.dateForm = this._formBuilder.group({
      startDate:['',[]],
      endDate:['',[]]
    });
  }
  public close():void{
    this._dialogRef.close({code: -1})
  }

  public applyDate(data:any):void{
    if (data.startDate && data.endDate) {
      this.startDate = data.startDate || this.startDate;
      this.endDate = data.endDate || this.endDate;
    }else{
      this._snackBarService.openSnackBar('Elija ambas fechas','OK',3000);
      return;
    }
    let startDate = this.startDate.toLocaleDateString();
    let endDate = this.endDate.toLocaleDateString();
    this._dialogRef.close({code: 1, startDate: startDate, endDate: endDate});
  }

}