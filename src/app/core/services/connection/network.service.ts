/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
//import {ConnectionService} from 'ng-connection-service';

@Injectable()
export class NetworkService {

  private _notifyNetworkChanges = new Subject<any>();
  //private _status: boolean;

  constructor(
    //private _connectionService: ConnectionService
  ) { }

  public init(): void{
    /*this._connectionService.monitor().subscribe(status => {
      this._status = status;
      this._notifyNetworkChanges.next(this._status);
    });*/
  }

  public getChangesNetwork(): Observable<any>{
    return this._notifyNetworkChanges.asObservable();
  }
}
