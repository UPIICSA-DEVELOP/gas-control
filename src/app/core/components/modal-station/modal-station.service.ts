/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ModalStationComponent} from '@app/core/components/modal-station/modal-station.component';

@Injectable({
  providedIn: 'root'
})
export class ModalStationService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(utils:any):MatDialogRef<ModalStationComponent>{
    return this._dialog.open(ModalStationComponent,{panelClass:'modal-panel', disableClose: true, data:utils});
  }
}
