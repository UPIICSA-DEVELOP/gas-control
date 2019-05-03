/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class StationProfileService implements Resolve<any>{

  constructor(
    private _api: ApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const observer1 = this._api.getStation(route.params['id']);
    const observer2 = this._api.getUtils();
    return forkJoin(observer1, observer2).pipe(map((resp: any[]) => {return {station: resp[0], utils: resp[1]}}));
  }
}
