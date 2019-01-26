/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {ModalStationComponent} from '@app/core/components/modal-station/modal-station.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PdfVisorComponent} from '@app/core/components/pdf-visor/pdf-visor.component';

@Injectable({
  providedIn: 'root'
})
export class PdfVisorService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(pdf:any):MatDialogRef<PdfVisorComponent>{
    return this._dialog.open(PdfVisorComponent,{panelClass:'filter-panel', disableClose: true, data:pdf});
  }
}
