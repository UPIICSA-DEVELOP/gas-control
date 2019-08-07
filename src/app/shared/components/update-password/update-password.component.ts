/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfigDialogPass} from 'app/shared/components/update-password/update-password.service';

const md5 = require('md5');

let data = null;

export function ValidatePasswords(ac: AbstractControl) {
  let password = ac.get('newPassword').value;
  let repeatPassword = ac.get('confirmNewPass').value;
  if(password !== repeatPassword){
    ac.get('confirmNewPass').setErrors({differentPasswords: true});
  }else{
    return null;
  }
}

export function ValidateOldPassword(ac: AbstractControl) {
  let oldPassword = ac.get('oldPassword').value;
  if(md5(oldPassword) !==  data.oldPass){
    ac.get('oldPassword').setErrors({invalidPassword: true});
  }else{
    return null;
  }
}

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  @ViewChild('inputPasswordOne') private _inputPassOne: ElementRef;
  @ViewChild('inputPasswordTwo') private _inputPassTwo: ElementRef;
  @ViewChild('inputPasswordThree') private _inputPassThree: ElementRef;
  public info: any;
  public hideOne: boolean;
  public hideTwo: boolean;
  public hideThree: boolean;
  public simpleForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: ConfigDialogPass,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.info = {
      title: this._data.title,
      message:this._data.message,
      placeholderOne:this._data.inputPlaceholder,
      placeholderTwo: this._data.inputPlaceholderTwo,
      placeholderThree: this._data.inputPlaceholderThree,
      accept: this._data.accept,
      cancel: this._data.cancel,
      oldPass: this._data.oldPassword
    };
    data = this.info;
    this.simpleForm = this._formBuilder.group({
      oldPassword: ['',[Validators.required]],
      newPassword: ['',[Validators.required]],
      confirmNewPass:['',[Validators.required]]
    });
    this.simpleForm.setValidators([ValidatePasswords, ValidateOldPassword]);
  }

  public showPasswordOne(): void {
    this.hideOne = !this.hideOne;
    this._inputPassOne.nativeElement.type = (this.hideOne)?'text':'password';
  }

  public showPasswordTwo(): void {
    this.hideTwo = !this.hideTwo;
    this._inputPassTwo.nativeElement.type = (this.hideTwo)?'text':'password';
  }

  public showPasswordThree(): void {
    this.hideThree = !this.hideThree;
    this._inputPassThree.nativeElement.type = (this.hideThree)?'text':'password';
  }

  public accept(data: any): void{
    if (this.simpleForm.invalid){
      return;
    }

    this.dialogRef.close({code: 1, data: md5(data.newPassword)});
  }

  public cancel(): void{
    this.dialogRef.close({code: -1});
  }

}