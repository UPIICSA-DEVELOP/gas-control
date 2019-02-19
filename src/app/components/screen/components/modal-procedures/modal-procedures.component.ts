/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {Constants} from '@app/core/constants.core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-modal-procedures',
  templateUrl: './modal-procedures.component.html',
  styleUrls: ['./modal-procedures.component.scss']
})
export class ModalProceduresComponent implements OnInit {
  public procedures: any[];
  public selected: boolean[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ModalProceduresComponent>
  ) {
    this.selected = [];
    this.procedures = this._data;
  }

  ngOnInit() {
    this.initArray();
  }

  public closeModal():void{
    this._dialogRef.close({code:-1});
  }

  public finishSelectProcedures():void{
    this._dialogRef.close({code: 1, data: this.selected});
  }

  private initArray():void{
    for (let i = 0; i<this.procedures.length; i++){
      this.selected.push(false);
    }
  }
}
