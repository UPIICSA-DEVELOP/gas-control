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
    this.procedures = this._data.utils;
  }

  ngOnInit() {
    this.initArray();
  }

  public closeModal():void{
    this._dialogRef.close({code:-1});
  }

  public finishSelectProcedures():void{
    let procedure = [];
    this.selected.forEach((item, index)=>{
      if(item === true){
        procedure.push(index+1);
      }
    });
    this._dialogRef.close({code: 1, data: procedure});
  }

  private initArray():void{
    for (let i = 0; i<this.procedures.length; i++){
      this.selected.push(false);
    }
    for (let i = 0; i<this.procedures.length; i++){
      for(let j = 0; j <this._data.proceduresSelected.length; j++){
        if(this._data.proceduresSelected[j] === (i+1)){
          this.selected[i] = true;
        }
      }
    }
  }
}
