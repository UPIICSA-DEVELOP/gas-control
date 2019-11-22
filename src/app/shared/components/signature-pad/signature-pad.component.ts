/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import SignaturePad from 'signature_pad';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {DeviceDetectorService} from '@app/core/services/device-detector/device-detector.service';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements OnInit {
  public canvas: any;
  public pad: any;
  public disable: boolean;

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    @Inject(DOCUMENT) private _document: Document,
    private _dialogRef: MatDialogRef<SignaturePadComponent>,
    private _snackBarService: SnackBarService,
    private _deviceDetector: DeviceDetectorService
  ) {
  }

  ngOnInit() {
    this.disable = LocalStorageService.getItem(Constants.NotSignature);
    if (isPlatformBrowser(this._platformId)) {
      const container = this._document.getElementById('pad');
      this.canvas = container.querySelector('canvas');
      this.resizeCanvas();
      this.pad = new SignaturePad(this.canvas, {
        penColor: '#000000',
        backgroundColor: '#FFFFFF'
      });
    }
  }

  public clearCanvas(): void {
    this.pad.clear();
  }

  public closeCancel(): void {
    this._dialogRef.close({code: -1});
  }

  public closeAccept(): void {
    if (this.pad.isEmpty()) {
      this._snackBarService.openSnackBar('Por favor registre su firma', 'OK', 2000);
      return;
    }
    const data = this.pad.toDataURL('image/png');
    this._dialogRef.close({code: 1, blob: UtilitiesService.base64ToBlob(data), base64: data});
  }

  public resizeCanvas(): void {
    const percent = this._deviceDetector.isMobileDevice() ? .80 : .40;
    const width = this._document.body.clientWidth;
    this.canvas.width = ((width * percent) - 36);
    this.canvas.height = (this.canvas.width / 2);
  }
}
