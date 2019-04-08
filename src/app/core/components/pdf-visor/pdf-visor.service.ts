/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PdfVisorComponent} from '@app/core/components/pdf-visor/pdf-visor.component';
import {ApiService} from '@app/core/services/api/api.service';


export interface PdfVisorOptions {
  url: string,
  file?: File,
  notIsUrl?: boolean
  hideDownload?: boolean
}

@Injectable()
export class PdfVisorService {

  constructor(
    private _dialog: MatDialog,
    private _api: ApiService
  ) { }

  public open(options: PdfVisorOptions): void{
    if(options.notIsUrl){
      if(!options.file) {
        console.error(new Error('File is required'));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(options.file);
      reader.onload = () => {
        this._dialog.open(PdfVisorComponent,{panelClass:'pdf-visor-panel', data:reader.result});
      };
    }else{
      this._api.getFile(options.url).subscribe(response => {
        const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
        this._dialog.open(PdfVisorComponent,{panelClass:'pdf-visor-panel', data:{url: url, hideDownload: options.hideDownload}});
      });
    }
  }
}
