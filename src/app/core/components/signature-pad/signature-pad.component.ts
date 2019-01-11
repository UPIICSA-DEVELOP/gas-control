/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import SignaturePad from 'signature_pad';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements OnInit {
  public canvas: any;
  public pad: any;
  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    @Inject(DOCUMENT) private _document: Document,
    private _dialogRef: MatDialogRef<SignaturePadComponent>,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      const container = this._document.getElementById('pad');
      this.canvas = container.querySelector('canvas');
      this.pad = new SignaturePad(this.canvas,{
        penColor: '#000000',
        backgroundColor: '#FFFFFF'
      });
    }
  }

  public clearCanvas(): void{
    this.pad.clear();
  }

  public closeCancel():void{
    this._dialogRef.close({code: -1});
  }

  public closeAccept():void{
    if (this.pad.isEmpty()){
      this._snackBarService.openSnackBar('Por favor registre su firma','OK',2000);
      return;
    }
    let data = this.pad.toDataURL('image/png');
    this._dialogRef.close({code: 1, blob: UtilitiesService.base64ToBlob(data), base64: data});
  }
}
