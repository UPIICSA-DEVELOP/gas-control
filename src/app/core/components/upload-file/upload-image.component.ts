/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {MatDialog} from '@angular/material/dialog';
import {CropImageComponent} from '@app/core/components/crop-image/crop-image.component';

@Component({
  exportAs: 'app-upload-image',
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  @ContentChild(TemplateRef)
  @Input() layoutTemplate: TemplateRef<any>;
  @Output() onLoadImage: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _snackBarService: SnackBarService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
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

  private validateImage(file: any): boolean{
    if(!(/(\.jpg|\.jpeg|\.png)$/i).exec(file)){
      this._snackBarService.openSnackBar('Suba un archivo que tenga las extensiones .jpeg / .jpg / .png solamente.', 'OK', 2000);
      return false;
    }else{
      return true;
    }
  }
}
