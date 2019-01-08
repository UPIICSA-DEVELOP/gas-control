/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Component, ContentChild, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, TemplateRef} from '@angular/core';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {MatDialog} from '@angular/material/dialog';
import {CropImageComponent} from '@app/core/components/crop-image/crop-image.component';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

export interface UploadImageResponse {
  blob: Blob,
  url: string
}

@Component({
  exportAs: 'app-upload-image',
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  @ContentChild(TemplateRef)
  @Input() layoutTemplate: TemplateRef<any>;
  @Output() onLoadImage: EventEmitter<UploadImageResponse> = new EventEmitter<UploadImageResponse>();
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

  public onChangeFile(event): void{
    const file = event.target.value;
    if(this.validateImage(file)) {
      this._dialog.open(CropImageComponent,
        {
          data:
            {
              event: event
            },
          disableClose: true
        }
      ).afterClosed().subscribe((response) => {
        this.onLoadImage.emit({url: response.base64, blob: response.blob});
      });
    }
  }

  public onUpdate(): void{
    this._document.getElementById(this.id).click();
  }

  public onRemove(): void{
    this.onRemoveImage.emit(true);
  }

  private validateImage(file: any): boolean{
    if(!(/(\.jpg|\.jpeg|\.png)$/i).exec(file)){
      this._snackBarService.openSnackBar('Suba un archivo que tenga las extensiones .jpeg / .jpg / .png solamente.', 'OK', 2000);
      return false;
    }else{
      return true;
    }
  }
}
