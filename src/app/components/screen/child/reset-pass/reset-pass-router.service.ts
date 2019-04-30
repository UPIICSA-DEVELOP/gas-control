/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {LocalStorageService} from 'app/core/services/local-storage/local-storage.service';
import {Constants} from 'app/core/constants.core';

@Injectable()
export class ResetPassRouterService implements CanActivate{

  constructor(
    private _router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(LocalStorageService.getItem(Constants.UpdatePassword)){
      return true;
    }else{
      const id = route.queryParams['link'];
      if(id){
        LocalStorageService.setItem(Constants.UpdatePassword, id);
        return true;
      }else{
        return this._router.createUrlTree(['/login']);
      }
    }
  }

}
