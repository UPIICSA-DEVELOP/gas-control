/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ContentChild, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, TemplateRef} from '@angular/core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {CropImageComponent} from '@app/core/components/crop-image/crop-image.component';
import {MatDialog} from '@angular/material';

export interface UploadFileResponse {
  blob: any
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @ContentChild(TemplateRef)
  @Input() layoutTemplate: TemplateRef<any>;
  @Output() onLoadImage: EventEmitter<UploadFileResponse> = new EventEmitter<UploadFileResponse>();
  @Output() onRemoveImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  public show: boolean;
  public id: string;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: any,
    private _snackBarService: SnackBarService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.id = UtilitiesService.makeRandomHash();
    this.show = isPlatformBrowser(this._platformId);
  }

  public onUpdate(): void{
    this._document.getElementById(this.id).click();
  }

  public onRemove(): void{
    this.onRemoveImage.emit(true);
  }

  public onChangeFile(event): void{
    const file = event.target.value;
    if(this.validateFile(file)) {
      this.onLoadImage.emit(
        {blob: {
          type: event.srcElement.accept,
          size: event.srcElement.size
          }}
        );
    }
  }
  private validateFile(file: any): boolean {
    if (!(/(\.pdf)$/i).exec(file)) {
      this._snackBarService.openSnackBar('Suba un archivo que tenga la extensión .pdf solamente.', 'OK', 2000);
      return false;
    } else {
      return true;
    }
  }
}
