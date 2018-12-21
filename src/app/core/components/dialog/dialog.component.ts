/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TypeDialog} from '../../enums/type-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfigDialog} from '@app/core/components/dialog/dialog.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public info: any;
  public showInput: boolean;
  public simpleForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: ConfigDialog,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    switch (this._data.type){
      case TypeDialog.Confirm:
      case TypeDialog.Alert:
        this.info = {
          title: this._data.title || '',
          message: this._data.message || '',
          accept: this._data.accept || '',
          cancel: this._data.cancel
        };
        break;
      case TypeDialog.Input:
        this.showInput = true;
        this.info = {
          title: this._data.title || '',
          message: this._data.message || '',
          inputPlaceholder:  this._data.inputPlaceholder || '',
          accept: this._data.accept || '',
          cancel: this._data.cancel || ''
        };
        this.simpleForm = this._formBuilder.group({
          text: [this._data.text || '', [Validators.required, Validators.email]]
        });
        break;
    }
  }

  public accept(): void{
    this.dialogRef.close({code: 1});
  }

  public cancel(): void{
    this.dialogRef.close({code: -1});
  }

  public onSubmitForm(data): void{
    if(this.simpleForm.invalid){
      return;
    }
    this.dialogRef.close({code: 1, data: data});
  }

}
