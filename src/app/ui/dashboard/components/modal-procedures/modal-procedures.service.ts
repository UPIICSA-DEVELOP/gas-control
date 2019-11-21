/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ModalProceduresComponent} from '@app/ui/dashboard/components/modal-procedures/modal-procedures.component';

export interface ProceduresConfig {
  utils: any;
  proceduresSelected: number[];
  notVisibleChecks?: boolean;
}

@Injectable()
export class ModalProceduresService {

  constructor(
    private _dialog: MatDialog
  ) {
  }

  public open(config: ProceduresConfig): MatDialogRef<ModalProceduresComponent> {
    return this._dialog.open(ModalProceduresComponent, {panelClass: 'modal-panel', disableClose: true, data: config || null});
  }
}
