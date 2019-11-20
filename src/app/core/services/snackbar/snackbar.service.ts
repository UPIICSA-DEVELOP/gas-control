/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {Platform} from '@angular/cdk/platform';

@Injectable()
export class SnackBarService {

  private _snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(private platform: Platform, private snackBar: MatSnackBar) {
  }

  public openSnackBar(message: string, action: string, duration: number, horizontal?: any, vertical?: any): void {
    const h = (horizontal) ? horizontal : 'end';
    const v = (vertical) ? vertical : 'bottom';
    if (this.platform.isBrowser) {
      this._snackBarRef = this.snackBar.open(message, action, {
        duration: duration,
        horizontalPosition: h,
        verticalPosition: v
      });
    }
  }

  public closeSnackBar(): void {
    if (this._snackBarRef === undefined) {
      console.error(new Error('The MatSnackBarRef is undefined, invoke first openSnackBar'));
      return;
    }
    this._snackBarRef.dismiss();
  }
}
