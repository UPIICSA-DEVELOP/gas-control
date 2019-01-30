/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PdfVisorComponent} from '@app/core/components/pdf-visor/pdf-visor.component';
import {ApiService} from '@app/core/services/api/api.service';

@Injectable()
export class PdfVisorService {

  constructor(
    private _dialog: MatDialog,
    private _api: ApiService
  ) { }

  public open(fileUrl: string): void{
    this._api.getFile(fileUrl).subscribe(response => {
      const obj = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
      console.log(obj);
      return this._dialog.open(PdfVisorComponent,{panelClass:'pdf-visor-panel', data:obj});
    });
  }
}
