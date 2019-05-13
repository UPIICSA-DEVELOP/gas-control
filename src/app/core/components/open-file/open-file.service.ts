/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ShareComponent} from '@app/core/components/share/share.component';
import {OpenFileComponent} from '@app/core/components/open-file/open-file.component';

@Injectable()
export class OpenFileService {

  constructor(
    private _bottomSheet: MatBottomSheet
  ) { }

  public open(file: string): void{
    this._bottomSheet.open(OpenFileComponent, {
      panelClass: 'share-panel',
      data: file
    })
  }
}
