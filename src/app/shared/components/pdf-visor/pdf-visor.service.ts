/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {PdfVisorComponent} from 'app/shared/components/pdf-visor/pdf-visor.component';
import {ApiService} from '@app/core/services/api/api.service';


export interface PdfVisorOptions {
  urlOrFile: any,
  hideDownload?: boolean
}

@Injectable()
export class PdfVisorService {

  constructor(
    private _dialog: MatDialog,
    private _api: ApiService
  ) { }

  public open(options: PdfVisorOptions): void{

    if (Object.prototype.toString.call(options.urlOrFile) === '[object File]'){
      const reader = new FileReader();
      reader.readAsDataURL(options.urlOrFile);
      reader.onload = () => {
        this._dialog.open(PdfVisorComponent,{panelClass:'pdf-visor-panel', data:{url: reader.result, hideDownload: options.hideDownload}, disableClose: true});
      };
    }else{
      let file = null;
      if(typeof options.urlOrFile === 'string'){
        this._api.getFile(options.urlOrFile.toString()).subscribe(response => {
          file = response;
          file = window.URL.createObjectURL(new Blob([file], {type: 'application/pdf'}));
          this._dialog.open(PdfVisorComponent,{panelClass:'pdf-visor-panel', data:{url: file, hideDownload: options.hideDownload}, disableClose: true});
        });
      }else{
        file = window.URL.createObjectURL(new Blob([options.urlOrFile], {type: 'application/pdf'}));
        this._dialog.open(PdfVisorComponent,{panelClass:'pdf-visor-panel', data:{url: file, hideDownload: options.hideDownload}, disableClose: true});
      }
    }
  }
}
