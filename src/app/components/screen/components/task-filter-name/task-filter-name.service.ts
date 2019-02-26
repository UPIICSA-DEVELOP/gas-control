/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {TaskFilterNameComponent} from '@app/components/screen/components/task-filter-name/task-filter-name.component';


@Injectable()
export class TaskFilterNameService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(utils: any):MatDialogRef<TaskFilterNameComponent>{
    return this._dialog.open(TaskFilterNameComponent,{disableClose: true, panelClass: 'modal-panel', data: utils || null});
  }
}