/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {TaskFilterComponent} from 'app/components/screen/components/task-filter/task-filter.component';


@Injectable({
  providedIn: 'root'
})
export class TaskFilterService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(filter?:number):MatDialogRef<TaskFilterComponent>{
    return this._dialog.open(TaskFilterComponent,{panelClass:'filter-panel', disableClose: true, data:filter || 0});
  }
}
