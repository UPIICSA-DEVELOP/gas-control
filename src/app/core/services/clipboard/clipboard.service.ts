/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {SnackBarService} from '../snackbar/snackbar.service';

@Injectable()
export class ClipboardService {

  constructor(private snack: SnackBarService) { }

  public copy(text: string): void {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.snack.openSnackBar('Link copiado al portapapeles', 'OK', 1000);
    } catch (e) {
      this.snack.openSnackBar('Ha ocurrido un error al copiar al portapapeles', 'OK', 1000);
      console.error('Error in ClipboardService', e);
    }
  }
}
