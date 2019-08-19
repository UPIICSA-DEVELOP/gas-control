/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from './dialog.component';
import {TypeDialog} from '../../../utils/enums/type-dialog';
import {MatDialogRef} from '@angular/material/dialog/typings/dialog-ref';

export interface ConfigDialog {
  type: TypeDialog;
  title: string;
  message: string;
  inputPlaceholder?: string;
  inputPlaceholderTwo?: string
  accept?: boolean;
  cancel?: boolean;
  text?: string;
  secondText?: string;
}

@Injectable()
export class DialogService {

  constructor(
    private _dialog: MatDialog
  ) { }

  /**
   * Dialog for confirm action
   *
   * @param {string} title Title of dialog
   * @param {string} message Message body of dialog
   * @param {string} accept Text for button accept
   * @param {string} cancel Text for button cancel
   *
   * @return {@link MatDialogRef<DialogComponent>}
   *
   * */
  public confirmDialog(title: string, message: string, accept?: string, cancel?: string): MatDialogRef<DialogComponent>{
   return this._dialog.open(DialogComponent,
     {
      data:
         {
            type: TypeDialog.Confirm,
            title: title,
            message: message,
            accept: (accept)?accept:'ACEPTAR',
            cancel: (cancel)?cancel:'CANCELAR'
         },
       disableClose: true,
       panelClass: 'dialog-panel'
      }
   );
  }


  /**
   * Dialog of information
   * @param {string} title Title of dialog
   * @param {string} message Message of dialog
   * @param {string} accept Text for button accept
   *
   * @return {@link MatDialogRef<DialogComponent>}
   *
   * */
  public alertDialog(title: string, message: string, accept?: string): MatDialogRef<DialogComponent>{
    return this._dialog.open(DialogComponent,
      {
        data:
          {
            type: TypeDialog.Alert,
            title: title,
            message: message,
            accept: (accept)?accept:'ACEPTAR',
            cancel: ''
          },
        disableClose: true,
        panelClass: 'dialog-panel'
      }
    );
  }


  /**
   * Dialog with input
   *
   * @param {string} title Title of dialog
   * @param {string} message Message of dialog
   * @param {string} inputPlaceholder Text of placeholder of input
   * @param {string} accept Text for button accept dialog
   * @param {string} cancel Text for button cancel dialog
   * @param {string} text Text for input placeholder
   *
   * @return {@link MatDialogRef<DialogComponent>}
   *
   * */
  public alertWithInput(title: string, message: string, inputPlaceholder: string, accept?: string, cancel?: string, text?: string): MatDialogRef<DialogComponent>{
    return this._dialog.open(DialogComponent,
      {
        data:
          {
            type: TypeDialog.Input,
            title: title,
            message: message,
            inputPlaceholder: inputPlaceholder,
            accept: (accept)?accept:'ACEPTAR',
            cancel: (cancel)?cancel:'CANCELAR',
            text: text
          },
        disableClose: true,
        panelClass: 'dialog-panel'
      }
    );
  }
  public alertWithDoubleInput(title: string, message: string, inputPlaceholder: string, inputPlaceholderTwo?:string, accept?: string, text?: string, secondText?: string): MatDialogRef<DialogComponent>{
    return this._dialog.open(DialogComponent,
      {
        data:
          {
            type: TypeDialog.DoubleInput,
            title: title,
            message: message,
            inputPlaceholder: inputPlaceholder,
            inputPlaceholderTwo: inputPlaceholderTwo,
            accept: (accept)?accept:'ACEPTAR',
            text: text,
            secondText: secondText
          },
        disableClose: true,
        panelClass: 'dialog-panel'
      }
    );
  }

 /* public dialogList(titleBar: string): MatDialogRef<DialogComponent>{
    return  this._dialog.open(DialogComponent,
      {
        data:
          {
            type:TypeDialog.list,
            titleBar: titleBar,
            message:''
          },
        disableClose: true
      }
      );
  }*/

}
