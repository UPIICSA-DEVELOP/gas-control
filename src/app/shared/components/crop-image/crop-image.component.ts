/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SnackBarService} from 'ng-maplander';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss']
})
export class CropImageComponent implements OnInit {

  public imageChangedEvent: any = '';
  public showCropper: boolean;
  private _blobImage: any;
  private _base64Image: any;

  constructor(
    public _dialogRef: MatDialogRef<CropImageComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _snackBarService: SnackBarService
  ) {
  }

  ngOnInit() {
    this.imageChangedEvent = this._data.event;
  }


  public imageCropped(event: any) {
    this._blobImage = event.file;
    this._base64Image = event.base64;
  }

  public imageLoaded() {
    this.showCropper = true;
  }

  public loadImageFailed() {
    this._snackBarService.setMessage('Ocurrio un error al cargar la imagen, por favor, intente de nuevo.', 'OK', 2000);
  }

  public finishCrop(): void {
    this._dialogRef.close({blob: this._blobImage, base64: this._base64Image});
  }

  public cancelCrop(): void {
    this._dialogRef.close({imageFile: null});
  }

}
