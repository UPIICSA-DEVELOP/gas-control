/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-image-visor',
  templateUrl: './image-visor.component.html',
  styleUrls: ['./image-visor.component.scss']
})
export class ImageVisorComponent implements OnInit {
  private _lastIndex: number;
  public imageOnView: any;
  public images: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any[],
    private _dialogRef: MatDialogRef<ImageVisorComponent>
  ) {
    this._lastIndex = 0;
    this.images = [];
  }

  ngOnInit() {
    if(this._data){
      this.images = this._data
    }
  }

  public changeImage(next: boolean):void{
    if(next){
      this.imageOnView = this.images[this._lastIndex + 1];
    }else if(!next){
      this.imageOnView = this.images[this._lastIndex - 1]
    }
  }

  public close():void{
    this._dialogRef.close();
  }

}
