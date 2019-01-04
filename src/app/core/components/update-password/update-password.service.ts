/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {UpdatePasswordComponent} from '@app/core/components/update-password/update-password.component';

export interface ConfigDialogPass {
  title: string;
  message: string;
  inputPlaceholder?: string;
  inputPlaceholderTwo?: string;
  inputPlaceholderThree?: string;
  accept?: boolean;
  cancel?: boolean;
  oldPassword: string
}

@Injectable({
  providedIn: 'root'
})
export class UpdatePasswordService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public updatePassword(oldPass: string, title: string, message?: string, placeholderOne?: string, placeholderTwo?: string, placeholderThree?: string, accept?: string, cancel?: string): MatDialogRef<UpdatePasswordComponent> {
    return this._dialog.open(UpdatePasswordComponent,{
      data: {
        oldPassword: oldPass,
        title: title,
        message: message || '',
        inputPlaceholder: placeholderOne || '',
        inputPlaceholderTwo: placeholderTwo || '',
        inputPlaceholderThree: placeholderThree || '',
        accept: accept || 'ACEPTAR',
        cancel: cancel || 'CANCELAR',
      },
      disableClose: false
    })
  }
}
