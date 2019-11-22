/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {MDate} from '@app/utils/class/MDate';
import {DOCUMENT} from '@angular/common';
import {DateRangeOptions} from '@app/ui/dashboard/components/datepicker/datepicker.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit, AfterViewInit {
  @ViewChild('pickerStart', {static: true}) private _pickerStart: any;
  @ViewChild('pickerEnd', {static: true}) private _pickerEnd: any;
  public dateForm: FormGroup;
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(MAT_DIALOG_DATA) public data: DateRangeOptions,
    private _dialogRef: MatDialogRef<DatepickerComponent>,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _adapter: DateAdapter<any>
  ) {
  }

  ngOnInit() {
    this._adapter.setLocale('es');
    this.dateForm = this._formBuilder.group({
      startDate: ['', []],
      endDate: ['', []]
    });
    this.dateForm.patchValue({
      startDate: MDate.getPrimitiveDate(this.data.startDate),
      endDate: MDate.getPrimitiveDate(this.data.endDate)
    });
  }

  ngAfterViewInit() {
    if (this._document.body.clientWidth <= 1024) {
      this._pickerStart.touchUi = true;
      this._pickerEnd.touchUi = true;
    }
  }

  public close(): void {
    this._dialogRef.close({code: -1});
  }

  public applyDate(data: any): void {
    if (data.startDate && data.endDate) {
      this.startDate = data.startDate || this.startDate;
      this.endDate = data.endDate || this.endDate;
    } else {
      this._snackBarService.openSnackBar('Elija ambas fechas', 'OK', 3000);
      return;
    }
    if (this.endDate < this.startDate) {
      this._snackBarService.openSnackBar('La fecha de termino no puede se mayor a la fecha de inicio', 'OK', 3000);
      return;
    }
    this._dialogRef.close({code: 1, startDate: this.startDate, endDate: this.endDate});
  }

}
