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
import {MessagingService} from '@app/core/services/messaging/messaging.service';
import {Observable} from 'rxjs/index';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {ApiService} from '@app/core/services/api/api.service';

@Injectable()
export class AuthService implements Resolve<any>{

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _router: Router,
    private _messaging: MessagingService,
    private _sessionStorage: SessionStorageService,
    private _api: ApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (isPlatformBrowser(this._platformId)) {
      if(state.url !== '/home/updatepassword'){
        if(AuthService.validateUpdatePassword()){
          this.saveUserInfo();
          this._router.navigate(['/home/updatepassword']).then();
        }else{
          this.goToHome(state.url);
        }
      }else if(!AuthService.validateUpdatePassword()){
        this._router.navigate(['/home']).then();
      }
    }
  }

  public requestPermissionNotifications(): Observable<string>{
    return new Observable<string>((observer) => {
      this._messaging.requestPermission().subscribe((token: string | null) => {
        observer.next(token);
        observer.complete();
      }, error => {
        observer.next(null);
        observer.complete();
      })
    });
  }

  public onNotificationsRecived(): Observable<any>{
    return this._messaging.receiveMessage();
  }

  public logIn(user: any, rememberUser: boolean, token?: string): void{
    let time: MaxAge;
    if (rememberUser) {
      time = MaxAge.MONTH;
    } else {
      time = MaxAge.DAY;
    }
    if(token){
      LocalStorageService.setItem(Constants.SessionToken, token);
    }
    SessionStorageService.setItem(Constants.UserInSession, {
      profileImage: (user.profileImage)?user.profileImage.thumbnail:null,
      role: user.role
    });
    CookieService.setCookie({
      value: user.id,
      name: Constants.IdSession,
      maxAge: time
    });
    this._router.navigate(['/home']).then(() => {});
  }

  public logOut(): void{
    LocalStorageService.removeItem(Constants.SessionToken);
    CookieService.deleteCookie(Constants.IdSession);
    SessionStorageService.removeItem(Constants.UserInSession);
    this._router.navigate(['/']).then(() => {});
  }

  private static validateUser(): boolean {
    return CookieService.getCookie(Constants.IdSession) !== null;
  }

  private static validateUpdatePassword(): boolean{
    return LocalStorageService.getItem(Constants.UpdatePassword);
  }

  private goToHome(url: string): void{
    switch (url){
      case '/':
        if(AuthService.validateUser()){
          this.saveUserInfo();
          this._router.navigate(['/home']).then();
        }
        break;
      default:
        switch (true){
          case /home/.test(url):
            if(!AuthService.validateUser()){
              this._router.navigate(['/']).then();
            }
            break;
          }
        break;
    }
  }


  private saveUserInfo(): void{
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response =>{
      switch (response.code) {
        case 200:
          SessionStorageService.setItem(Constants.UserInSession, {
            profileImage: (response.item.profileImage)?response.item.profileImage.thumbnail:null,
            role: response.item.role
          });
          break;
        default:
          SessionStorageService.setItem(Constants.UserInSession, {
            profileImage: null,
            role: response.item.role
          });
          break;
      }
    });
  }
}
