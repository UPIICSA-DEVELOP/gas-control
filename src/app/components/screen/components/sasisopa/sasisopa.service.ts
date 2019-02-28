/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SasisopaComponent} from '@app/components/screen/components/sasisopa/sasisopa.component';

@Injectable()
export class SasisopaService {

  constructor(
    private _matDialog: MatDialog
  ) { }

  public open(isSasisopa: boolean):MatDialogRef<SasisopaComponent>{
    return this._matDialog.open(SasisopaComponent,{panelClass: 'sgm-and-sasisopa-panel', disableClose: true, data: isSasisopa || null});
  }
}
