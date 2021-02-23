/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FileCS} from '@app/utils/interfaces/file-cs';
import {UserMedia} from '@maplander/core/lib/utils/models/user-media';

@Component({
  selector: 'app-image-visor',
  templateUrl: './image-visor.component.html',
  styleUrls: ['./image-visor.component.scss']
})
export class ImageVisorComponent implements OnInit {
  private readonly _lastIndex: number;
  public images: Array<FileCS>;
  public viewMode: boolean;
  private _blobs: Array<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ImageVisorComponent>
  ) {
    this._lastIndex = 0;
    this.images = [];
    this.viewMode = false;
    this._blobs = [];
  }

  ngOnInit() {
    if (this._data) {
      this.viewMode = this._data.onlyViewMode;
      this.images = Object.assign([], this._data.images);
      this._blobs = Object.assign([], this._data.blobs);
    }
  }

  public onUploadImage(ev: UserMedia): void {
    if (!ev) {
      return;
    }
    this.images.push({
      thumbnail: ev.url,
      blobName: null
    });
    this._blobs.push(ev);
  }

  public removeImage(index: number): void {
    this.images.splice(index, 1);
    this._blobs.splice(index, 1);
  }

  public changeImage(currentIndex: number, newIndex: number): void {
    const temp = this.images[newIndex];
    this.images[newIndex] = this.images[currentIndex];
    this.images[currentIndex] = temp;
    const tempBlob = this._blobs[newIndex];
    this._blobs[newIndex] = this._blobs[currentIndex];
    this._blobs[currentIndex] = tempBlob;
  }

  public close(): void {
    if (this.viewMode) {
      this._dialogRef.close({code: -1});
    } else {
      this._dialogRef.close({code: 1, data: {images: this.images, blobs: this._blobs}});
    }
  }

}
