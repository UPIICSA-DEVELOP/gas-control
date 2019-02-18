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
import {Observable} from 'rxjs';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';

@Injectable()
export class AuthService implements Resolve<any>{

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _router: Router,
    private _messaging: MessagingService,
    private _sessionStorage: SessionStorageService,
    private _api: ApiService,
    private _dialog: DialogService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (isPlatformBrowser(this._platformId)) {
      if(state.url !== '/home/updatepassword'){
        if(AuthService.validateUpdatePassword()){
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
    LocalStorageService.setItem(Constants.UserInSession, {
      profileImage: (user.profileImage)?user.profileImage.thumbnail:null,
      role: user.role,
      refId: user.refId
    });
    CookieService.setCookie({
      value: user.id,
      name: Constants.IdSession,
      maxAge: time
    });
    if(user.signature){
      this._router.navigate(['/home']).then(() => {});
    }else{
      if(user.role===7){
        this._router.navigate(['/admin']).then(() => {});
      }else{
        this._dialog.alertDialog(
          'Información',
          'Para continuar es necesario registrar su firma digital',
          'REGISTRAR').afterClosed().subscribe(response =>{
          LocalStorageService.setItem(Constants.NotSignature, true);
          switch (user.role) {
            case 1:
            case 2:
            case 3:
              this._router.navigate(['/home/profile/consultancy']);
              break;
            case 4:
            case 5:
            case 6:
            case 7:
              this._router.navigate(['/home/profile/user']);
              break;
          }
        })
      }
    }
  }

  public logOut(): void{
    LocalStorageService.removeItem(Constants.SessionToken);
    LocalStorageService.removeItem(Constants.NotSignature);
    CookieService.deleteCookie(Constants.IdSession);
    LocalStorageService.removeItem(Constants.UserInSession);
    LocalStorageService.removeItem(Constants.NotCalendarTask);
    LocalStorageService.removeItem(Constants.StationInDashboard);
    this._router.navigate(['/']).then(() => {});
  }

  private static validateUser(): boolean {
    return CookieService.getCookie(Constants.IdSession) !== null;
  }

  private static validateUpdatePassword(): boolean{
    return LocalStorageService.getItem(Constants.UpdatePassword);
  }

  private goToHome(url: string): void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (url){
      case '/':
        if(AuthService.validateUser()){
          this.saveUserInfo(true);
        }
        break;
      default:
        switch (true){
          case /home/.test(url):
            if(!AuthService.validateUser()){
              this._router.navigate(['/']).then();
            }
            break;
          case /profile/.test(url):
            if(!AuthService.validateUser()){
              this._router.navigate(['/']).then();
            }
            break;
          case /admin/.test(url):
            if(!AuthService.validateUser()){
              this._router.navigate(['/']).then();
            }else{
              if(user.role!==7){
                this._router.navigate(['/']).then();
              }
            }
            break;
        }
        break;
    }
  }


  private saveUserInfo(navigateHome?:boolean): void{
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response =>{
      switch (response.code) {
        case 200:
          if (navigateHome) {
            LocalStorageService.setItem(Constants.UserInSession, {
              profileImage: (response.item.profileImage)?response.item.profileImage.thumbnail:null,
              role: response.item.role,
              refId: (response.item.refId?response.item.refId:null)
            });
            if(response.item.role===7){
              this._router.navigate(['/admin']).then();
            }else{
              this._router.navigate(['/home']).then();
            }
          }else{
            SessionStorageService.setItem(Constants.IdSession, response.item);
            this._router.navigate(['/home/updatepassword']).then();
          }
          break;
        default:
          LocalStorageService.setItem(Constants.UserInSession, {
            profileImage: null,
            role: null,
            refId: null
          });
          break;
      }
    });
  }
}
