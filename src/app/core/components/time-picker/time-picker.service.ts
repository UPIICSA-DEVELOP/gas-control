/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {AmazingTimePickerService} from 'amazing-time-picker';
import {IDialogResult} from 'amazing-time-picker/src/app/atp-library/definitions';

@Injectable()
export class TimePickerService {

  private _dialog: IDialogResult;

  constructor(
    private atp: AmazingTimePickerService
  ) { }

  public open(): IDialogResult{
    return  this.atp.open({
      theme: 'material-blue',
      arrowStyle: {
        background: 'blue',
        color: 'white'
      },
      preference:{
        labels:{
          ok: 'ACEPTAR',
          cancel: 'CANCELAR'
        }
      },
      animation: 'fade',
      locale: 'mx',
      changeToMinutes: true
    });
  }
}
