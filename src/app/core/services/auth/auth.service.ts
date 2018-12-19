/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {Resolve, Router} from '@angular/router';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';

@Injectable()
export class AuthService implements Resolve<any>{

  constructor(
    private _router: Router
  ) { }

  resolve() {
    if (!AuthService.validateUser()) {
      this._router.navigate(['/']);
    }else {
      this._router.navigate(['/home']);
    }
  }

  private static validateUser(): boolean {
    return CookieService.getCookie(Constants.UserInSession) !== null;
  }
}
