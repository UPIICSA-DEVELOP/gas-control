/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ApiService} from 'app/core/services/api/api.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {CookieService} from 'ng-maplander';

@Injectable()
export class UserProfileService implements Resolve<any> {

  constructor(
    private _api: ApiService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const observer1 = this._api.getPerson(CookieService.getCookie(Constants.IdSession));
    const observer2 = this._api.getPersonInformation(CookieService.getCookie(Constants.IdSession));
    return forkJoin([observer1, observer2]).pipe(map((resp: any[]) => {
      return {user: resp[0], userInfo: resp[1]};
    }));
  }
}
