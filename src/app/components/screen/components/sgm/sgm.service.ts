/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SgmComponent} from '@app/components/screen/components/sgm/sgm.component';

@Injectable()
export class SgmService {

  constructor(
    private _matDialog: MatDialog
  ) { }

  public open():MatDialogRef<SgmComponent>{
    return this._matDialog.open(SgmComponent,{panelClass: 'sgm-panel', disableClose: true});
  }
}
