/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskFilterComponent implements OnInit {
  public option: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<TaskFilterComponent>
  ) { }

  ngOnInit() {
    if (this._data) {
      this.option=this._data;
    }
  }

  public close():void{
    this._dialogRef.close({code:-1});
  }

  public applyFilters():void{
    this._dialogRef.close({code:1,filter:this.option});
  }

}
