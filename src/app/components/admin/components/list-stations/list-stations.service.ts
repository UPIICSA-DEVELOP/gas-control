/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ListStationsComponent} from '@app/components/admin/components/list-stations/list-collaborators.component';

@Injectable()
export class ListStationsService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(id: string, name: string): void{
    this._dialog.open(ListStationsComponent,
      {disableClose: true, panelClass: 'list-stations-panel', data: {id: id, name: name}});
  }
}
