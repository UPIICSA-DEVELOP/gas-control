/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-modal-station',
  templateUrl: './modal-station.component.html',
  styleUrls: ['./modal-station.component.scss']
})
export class ModalStationComponent implements OnInit {
  public icons: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ModalStationComponent>
  ) { }

  ngOnInit() {
    if (this._data){
      this.icons = this._data;
    }
  }

  public selectStationType(data: any):void{
    this._dialogRef.close({code: 1, data: data})
  }

  public closeModal():void{
    this._dialogRef.close({code: -1})
  }
}
