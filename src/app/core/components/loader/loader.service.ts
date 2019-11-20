/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class LoaderService {

  private _observer: Subject<boolean>;

  constructor() {
    this._observer = new Subject<boolean>();
  }

  public setProgress(load: boolean): void {
    this._observer.next(load);
  }

  public getProgress(): Observable<boolean> {
    return this._observer.asObservable();
  }
}
