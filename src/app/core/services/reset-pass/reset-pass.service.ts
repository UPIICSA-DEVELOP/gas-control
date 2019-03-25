/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
@Injectable()
export class ResetPassService implements Resolve<any>{

  constructor(
    private _api: ApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const id = route.queryParams['link'];
    if(id){
      return this._api.signInWithLink(id);
    }else {
      return null;
    }
  }

}
