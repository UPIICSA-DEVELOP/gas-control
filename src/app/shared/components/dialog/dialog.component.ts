/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TypeDialog} from '@app/utils/enums/type-dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfigDialog} from 'app/shared/components/dialog/dialog.service';

export function ValidatePasswords(ac: AbstractControl) {
  const password = ac.get('password').value;
  const repeatPassword = ac.get('confirmPassword').value;
  if (password !== repeatPassword) {
    ac.get('confirmPassword').setErrors({differentPasswords: true});
  } else {
    return null;
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @ViewChild('inputPasswordOne', {static: true}) private _inputPassOne: ElementRef;
  @ViewChild('inputPasswordTwo', {static: true}) private _inputPassTwo: ElementRef;
  public info: ConfigDialog;
  public showInput: boolean;
  public showDoubleInput: boolean;
  public showList: boolean;
  public hideOne: boolean;
  public hideTwo: boolean;
  public simpleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: ConfigDialog,
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    switch (this._data.type) {
      case TypeDialog.Confirm:
      case TypeDialog.Alert:
        this.showList = false;
        this.info = {
          title: this._data.title || '',
          message: this._data.message || '',
          accept: this._data.accept,
          cancel: this._data.cancel
        };
        break;
      case TypeDialog.Input:
        this.showInput = true;
        this.showDoubleInput = false;
        this.info = {
          title: this._data.title || '',
          message: this._data.message || '',
          inputPlaceholder: this._data.inputPlaceholder || '',
          accept: this._data.accept,
          cancel: this._data.cancel
        };
        this.simpleForm = this._formBuilder.group({
          text: [this._data.text || '', [Validators.required, Validators.email]]
        });
        break;
      case TypeDialog.DoubleInput:
        this.showInput = true;
        this.showDoubleInput = true;
        this.info = {
          title: this._data.title,
          message: this._data.message,
          inputPlaceholder: this._data.inputPlaceholder,
          inputPlaceholderTwo: this._data.inputPlaceholderTwo,
          accept: this._data.accept,
          cancel: this._data.cancel
        };
        this.simpleForm = this._formBuilder.group({
          password: [this._data.text || '', [Validators.required]],
          confirmPassword: [this._data.secondText || '', [Validators.required]]
        });
        this.simpleForm.setValidators(ValidatePasswords);
        break;
    }
  }

  public showPasswordOne(): void {
    this.hideOne = !this.hideOne;
    this._inputPassOne.nativeElement.type = (this.hideOne) ? 'text' : 'password';
  }

  public showPasswordTwo(): void {
    this.hideTwo = !this.hideTwo;
    this._inputPassTwo.nativeElement.type = (this.hideTwo) ? 'text' : 'password';
  }

  public accept(): void {
    this.dialogRef.close({code: 1});
  }

  public cancel(): void {
    this.dialogRef.close({code: -1});
  }

  public onSubmitForm(data): void {
    if (!this.showList) {
      if (this.simpleForm.invalid) {
        return;
      }
    }
    this.dialogRef.close({code: 1, data: data});
  }
}
