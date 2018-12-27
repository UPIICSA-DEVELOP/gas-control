/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {AuthService} from '@app/core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPassService implements Resolve<any>{

  constructor(
    private _api: ApiService,
    private _route:Router,
    private _auth: AuthService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    const id = route.queryParams['link'];
    this._api.signInWithLink(id).subscribe(response =>{
      switch (response.code) {
        case 200:
          this._auth.logIn(response.item.email, false);
          this._route.navigate(['/home']).then();
          break;
        default:
          this._route.navigate(['/']).then();
          break;
      }
    })
  }

}
