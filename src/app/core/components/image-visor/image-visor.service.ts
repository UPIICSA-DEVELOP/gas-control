/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ImageVisorComponent} from '@app/core/components/image-visor/image-visor.component';

@Injectable()
export class ImageVisorService {

  constructor(
    private _dialogRef: MatDialog
  ) { }

  public open(imagesArray: any[]):MatDialogRef<ImageVisorComponent>{
    return this._dialogRef.open(ImageVisorComponent,{disableClose: true, panelClass:'modal-panel', data: imagesArray || null});
  }
}
