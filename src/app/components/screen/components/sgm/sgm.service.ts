/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SgmComponent} from '@app/components/screen/components/sgm/sgm.component';

export interface SgmConfig{
  stationId: string;
  utils: any;
}

@Injectable()
export class SgmService {

  constructor(
    private _matDialog: MatDialog
  ) { }

  public open(config?: SgmConfig):MatDialogRef<SgmComponent>{
    return this._matDialog.open(SgmComponent,{panelClass: 'sgm-panel', disableClose: true, data: config || null});
  }
}
