/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {TaskFilterNameComponent} from '@app/shared/components/task-filter-name/task-filter-name.component';

export interface FilterConfig {
  utils: any;
  lastTypeSelected: number;
}

@Injectable()
export class TaskFilterNameService {

  constructor(
    private _dialog: MatDialog
  ) {
  }

  public open(config: FilterConfig): MatDialogRef<TaskFilterNameComponent> {
    return this._dialog.open(TaskFilterNameComponent, {disableClose: true, panelClass: 'modal-panel', data: config || null});
  }
}
