/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable()
export class ApiLoaderService {

  private _progressHttp = new Subject<any>();

  constructor() { }

  public getProgress(): Observable<any>{
    return this._progressHttp.asObservable();
  }

  public setProgress(load: boolean): void{
    this._progressHttp.next(load);
  }
}
