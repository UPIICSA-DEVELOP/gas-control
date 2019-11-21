/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SasisopaComponent} from '@app/ui/dashboard/components/sasisopa/sasisopa.component';
import {AppUtil} from '@app/utils/interfaces/app-util';

export interface SasisopaConfigurations {
  stationId: string;
  utils: AppUtil;
}

@Injectable()
export class SasisopaService {

  constructor(
    private _matDialog: MatDialog
  ) {
  }

  public open(config?: SasisopaConfigurations): MatDialogRef<SasisopaComponent> {
    return this._matDialog.open(SasisopaComponent, {panelClass: 'sasisopa-panel', disableClose: true, data: config || null});
  }
}
