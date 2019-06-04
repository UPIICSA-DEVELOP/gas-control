/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-open-file',
  templateUrl: './open-file.component.html',
  styleUrls: ['./open-file.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpenFileComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) private _data: any,
    private _pdf: PdfVisorService,
    private _bottomSheet: MatBottomSheetRef
  ) { }

  ngOnInit() {
  }

  public download():void{
    this._pdf.open({urlOrFile:this._data});
    this._bottomSheet.dismiss();
  }

  public cancel():void{
    this._bottomSheet.dismiss();
  }
}
