/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ModalProceduresComponent} from '@app/components/screen/components/modal-procedures/modal-procedures.component';

@Injectable()
export class ModalProceduresService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(utils: any):MatDialogRef<ModalProceduresComponent>{
    return this._dialog.open(ModalProceduresComponent,{panelClass:'modal-panel', disableClose: true, data:utils || null});
  }
}
