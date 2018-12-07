/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {Observable} from 'rxjs';

@Injectable()
export class MessagingService {

  constructor(
    private _angularFireMessaging: AngularFireMessaging
  ) {
    this._angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  public requestPermission(): Observable<any> {
    return this._angularFireMessaging.requestToken;
  }

  public receiveMessage(): Observable<any> {
    return this._angularFireMessaging.messages;
  }
}
