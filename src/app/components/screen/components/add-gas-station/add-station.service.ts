/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AddGasStationComponent} from '@app/components/screen/components/add-gas-station/add-gas-station.component';

@Injectable()
export class AddStationService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open():MatDialogRef<AddGasStationComponent>{
    return this._dialog.open(AddGasStationComponent,{panelClass:'add-station-panel', disableClose: true});
  }
}
