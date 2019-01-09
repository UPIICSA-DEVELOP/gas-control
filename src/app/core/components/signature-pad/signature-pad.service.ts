/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SignaturePadComponent} from '@app/core/components/signature-pad/signature-pad.component';

@Injectable({
  providedIn: 'root'
})
export class SignaturePadService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(): MatDialogRef<SignaturePadComponent>{
    return this._dialog.open(SignaturePadComponent,{panelClass:'signature-panel', disableClose: true});
  }
}
