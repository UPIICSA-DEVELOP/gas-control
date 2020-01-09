/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ApiService} from 'app/core/services/api/api.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class DocumentationService implements Resolve<any> {

  constructor(
    private _api: ApiService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const observer1 = this._api.listDocumentByStation(route.params['station'], '1');
    const observer2 = this._api.listDocumentByStation(route.params['station'], '2');
    const observer3 = this._api.getOtherDocStation(route.params['station']);
    const observer4 = this._api.getUtils();
    return forkJoin([observer1, observer2, observer3, observer4]).pipe(map((resp: any[]) => {
      return {asea: resp[0], cre: resp[1], others: resp[2], profeco: resp[3]};
    }));
  }
}
