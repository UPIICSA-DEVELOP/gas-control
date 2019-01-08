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

export interface UploadFileResponse {
  isImage: boolean,
  blob: Blob,
  file: File,
  url: string
}

export enum UploadFileType {
  image = 'image',
  file = 'file'
}

@Component({
  exportAs: 'app-upload-file',
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @ContentChild(TemplateRef)
  @Input() layoutTemplate: TemplateRef<any>;
  @Input() type: UploadFileType;
  @Output() onLoad: EventEmitter<UploadFileResponse> = new EventEmitter<UploadFileResponse>();
  @Output() onRemove: EventEmitter<boolean> = new EventEmitter<boolean>();
  public show: boolean;
  public id: string;
  public isImage: boolean;
  public acceptType: string;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: any,
    private _snackBarService: SnackBarService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.id = UtilitiesService.makeRandomHash();
    this.show = isPlatformBrowser(this._platformId);
    if(this.validateTypeExist()){
      this.validateType(this.type);
    }
  }

  public onChangeFile(event): void{
    const file = event.target.value;
    if(this.validateTypeExist()){
      switch (this.type){
        case UploadFileType.image:
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
              this.onLoad.emit({url: response.base64, blob: response.blob, isImage: true, file: null});
            });
          }
          break;
        case UploadFileType.file:
          if(this.validateFile(file)){
            this.onLoad.emit({url: null, blob: null, isImage: false, file: event.target.files[0]});
          }
          break;
      }
    }
  }

  public update(): void{
    this._document.getElementById(this.id).click();
  }

  public remove(): void{
    this.onRemove.emit(true);
  }

  private validateType(type: UploadFileType): void{
    switch (type){
      case UploadFileType.file:
        this.acceptType = 'application/pdf';
        this.isImage = false;
        break;
      case UploadFileType.image:
        this.acceptType = 'image/*';
        this.isImage = true;
        break;
      default:
        console.error(new Error('Invalid type'));
        break;
    }
  }

  private validateImage(file: any): boolean{
    if(!(/(\.jpg|\.jpeg|\.png)$/i).exec(file)){
      this._snackBarService.openSnackBar('Suba un archivo que tenga las extensiones .jpeg / .jpg / .png solamente.', 'OK', 2000);
      return false;
    }else{
      return true;
    }
  }

  private validateFile(file: any): boolean{
    if(!(/(\.pdf)$/i).exec(file)){
      this._snackBarService.openSnackBar('Suba un archivo que tenga las extensiones .pdf solamente.', 'OK', 2000);
      return false;
    }else{
      return true;
    }
  }

  private validateTypeExist(): boolean{
    if(this.type!==undefined || this.type!==null){
      return true;
    }else{
      console.error(new Error('Type is required'));
      return false;
    }
  }
}
