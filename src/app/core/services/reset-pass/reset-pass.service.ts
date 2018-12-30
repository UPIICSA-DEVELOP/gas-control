/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';

@Injectable()
export class ResetPassService implements Resolve<any>{

  constructor(
    private _api: ApiService,
    private _route:Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    const id = route.queryParams['link'];
    this._api.signInWithLink(id).subscribe(response =>{
      switch (response.code) {
        case 200:
          SessionStorageService.setItem(Constants.UserInSession, response.item);
          LocalStorageService.setItem(Constants.UpdatePassword, true);
          this._route.navigate(['/home/updatepassword']).then();
      }
    });
  }

}
