/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GroupIcon} from '@app/utils/interfaces/group-icon';

@Component({
  selector: 'app-modal-station',
  templateUrl: './modal-station.component.html',
  styleUrls: ['./modal-station.component.scss']
})
export class ModalStationComponent implements OnInit {
  public icons: GroupIcon[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ModalStationComponent>
  ) {
  }

  ngOnInit() {
    if (this._data) {
      this.icons = this._data;
      console.log(this._data);
    }
  }

  public selectStationIcon(icon: GroupIcon): void {
    this._dialogRef.close({code: 1, data: icon});
  }

  public closeModal(): void {
    this._dialogRef.close({code: -1});
  }
}
