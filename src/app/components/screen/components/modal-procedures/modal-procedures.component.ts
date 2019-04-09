/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HashService} from '@app/core/utilities/hash.service';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';

@Component({
  selector: 'app-modal-procedures',
  templateUrl: './modal-procedures.component.html',
  styleUrls: ['./modal-procedures.component.scss']
})
export class ModalProceduresComponent implements OnInit {
  public procedures: any[];
  public selected: boolean[];
  public seeCheckbox: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ModalProceduresComponent>,
    private _pdf: PdfVisorService
  ) {
    this.seeCheckbox = true;
    this.selected = [];
    this.procedures = this._data.utils;
  }

  ngOnInit() {
    this.seeCheckbox = this._data.notVisibleChecks;
    this.initArray();
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

  public openFile(url:any):void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (user.role){
      case 1:
      case 2:
      case 7:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url)});
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url), hideDownload: true});
        break;
    }
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
