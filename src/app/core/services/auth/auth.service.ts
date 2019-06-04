/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {CookieService, MaxAge} from 'app/core/services/cookie/cookie.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {MessagingService} from 'app/core/services/messaging/messaging.service';
import {Observable} from 'rxjs';
import {LocalStorageService} from 'app/core/services/local-storage/local-storage.service';
import {ApiService} from '@app/core/services/api/api.service';

@Injectable()
export class AuthService implements Resolve<any>{

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _router: Router,
    private _messaging: MessagingService,
    private _api: ApiService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(AuthService.validateUserInSession()){
      return this.loginAgain();
    }else{
      return null;
    }
  }

  public updateUserInSession(user: any): void{
   AuthService.saveInfoUser(user);
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

  public onNotificationsReceived(): Observable<any>{
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
    AuthService.saveInfoUser(user);
    CookieService.setCookie({
      value: user.id,
      name: Constants.IdSession,
      maxAge: time
    });
    if(!user.signature && user.role !== 7){
      LocalStorageService.setItem(Constants.NotSignature, true);
    }
    if(user.role === 7){
      this._router.navigate(['/admin']).then(() => {});
    }else{
      this._router.navigate(['/home']).then(() => {});
    }
  }

  public logOut(notNavigate?: boolean): void{
    this._api.signOut(LocalStorageService.getItem(Constants.SessionToken)).subscribe(response=>{
      switch (response.code){
        case 200:
          break;
        default:
          console.error(response);
          break;
      }
    });
    LocalStorageService.removeItem(Constants.ConsultancyInSession);
    LocalStorageService.removeItem(Constants.SessionToken);
    LocalStorageService.removeItem(Constants.NotSignature);
    CookieService.deleteCookie(Constants.IdSession);
    LocalStorageService.removeItem(Constants.UserInSession);
    LocalStorageService.removeItem(Constants.StationInDashboard);
    if(!notNavigate){
      this._router.navigate(['/']).then(() => {});
    }
  }

  private loginAgain(): Observable<boolean>{
    return new Observable<any>(observer => {
      AuthService.resetFlags();
      const user =  LocalStorageService.getItem(Constants.UserInSession);
      const data = {
        email: user.email,
        password: user.password,
        token: LocalStorageService.getItem(Constants.SessionToken) || undefined,
        type: 3
      };
      this._api.signIn(data).subscribe(response =>{
        switch (response.code) {
          case 200:
            const user = response.item;
            AuthService.saveInfoUser(user);
            if(!user.signature && user.role !== 7){
              LocalStorageService.setItem(Constants.NotSignature, true);
            }
            observer.next(true);
            observer.complete();
            break;
          default:
            console.error(response);
            observer.next(false);
            observer.complete();
            break;
        }
      });
    });
  }

  private static saveInfoUser(user: any){
    LocalStorageService.setItem(Constants.UserInSession, {
      completeName: (user.role===7 && user.completeName)? user.completeName : user.name+' '+user.lastName,
      profileImage: (user.profileImage)?user.profileImage.thumbnail:null,
      role: user.role,
      refId: user.refId,
      email: user.email,
      password: user.password
    });
  }

  private static validateUserInSession(): boolean {
    return CookieService.getCookie(Constants.IdSession) !== null;
  }

  private static resetFlags(): void{
    LocalStorageService.removeItem(Constants.NotSignature);
    LocalStorageService.removeItem(Constants.StationInDashboard);
    LocalStorageService.removeItem(Constants.ConsultancyInSession);
  }
}
