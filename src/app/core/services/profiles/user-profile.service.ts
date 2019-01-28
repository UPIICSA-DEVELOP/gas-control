import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {Constants} from '@app/core/constants.core';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {forkJoin} from 'rxjs';

@Injectable()
export class UserProfileService implements Resolve<any> {

  constructor(
    private _api: ApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const observer1 = this._api.getPerson(CookieService.getCookie(Constants.IdSession));
    const observer2 = this._api.getPersonInformation(CookieService.getCookie(Constants.IdSession));
    return forkJoin(observer1, observer2);
  }
}
