/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AddConsultancyComponent} from '@app/components/admin/components/add-consultancy/add-consultancy.component';

@Injectable()
export class AddConsultancyService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(): MatDialogRef<AddConsultancyComponent>{
    return this._dialog.open(AddConsultancyComponent, {panelClass: 'add-consultancy-panel', disableClose: true});
  }
}
