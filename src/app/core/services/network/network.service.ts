/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class NetworkService {

  private _notifyNetworkChanges = new Subject<boolean>();

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    this._notifyNetworkChanges = new Subject<boolean>();
  }

  public getNetworkChanges(): Observable<boolean> {
    return this._notifyNetworkChanges.asObservable();
  }

  public init(): Promise<void> {
    return new Promise<void>(resolve => {
      if (isPlatformBrowser(this._platformId)) {
        window.addEventListener('online', () => {
          this._notifyNetworkChanges.next(navigator.onLine);
        });
        window.addEventListener('offline', () => {
          this._notifyNetworkChanges.next(navigator.onLine);
        });
      }
      resolve();
    });
  }
}

