/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {CookieService, MaxAge} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class AuthService implements Resolve<any>{

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(isPlatformBrowser(this._platformId)){
      switch (state.url){
        case '/':
          if(AuthService.validateUser()){
            this._router.navigate(['/home']).then(() => {});
          }
          break;
        case '/home':
          if(!AuthService.validateUser()){
            this._router.navigate(['/']).then(() => {});
          }
          break;
      }
    }
  }

  public logIn(user: any, rememberUser: boolean): void{
    let time: MaxAge;
    if (rememberUser) {
      time = MaxAge.MONTH;
    } else {
      time = MaxAge.DAY;
    }
    debugger;
    SessionStorageService.setItem(Constants.UserInSession, {profileImage: (user.profileImage)?user.profileImage.thumbnail:null});
    CookieService.setCookie({
      value: user.id,
      name: Constants.IdSession,
      maxAge: time
    });
    this._router.navigate(['/home']).then(() => {});
  }

  public logOut(): void{
    CookieService.deleteCookie(Constants.IdSession);
    this._router.navigate(['/']).then(() => {});
  }

  private static validateUser(): boolean {
    return CookieService.getCookie(Constants.IdSession) !== null;
  }
}
