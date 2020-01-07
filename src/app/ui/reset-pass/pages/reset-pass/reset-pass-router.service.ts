/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Constants} from 'app/utils/constants/constants.utils';
import {LocalStorageService} from '@maplander/core';

@Injectable()
export class ResetPassRouterService implements CanActivate {

  constructor(
    private _router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (LocalStorageService.getItem<string>(Constants.UpdatePassword)) {
      return true;
    } else {
      const id = route.queryParams['link'];
      if (id) {
        LocalStorageService.setItem<string>(Constants.UpdatePassword, id);
        return true;
      } else {
        return this._router.createUrlTree(['/login']);
      }
    }
  }

}
