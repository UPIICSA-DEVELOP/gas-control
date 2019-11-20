/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {Platform} from '@angular/cdk/platform';

@Injectable()
export class DeviceDetectorService {

  constructor(
    private _platform: Platform
  ) {
  }

  public isMobileDevice(): boolean {
    return this._platform.ANDROID || this._platform.IOS;
  }

  public isAndroidDevice(): boolean {
    return this._platform.ANDROID;
  }

  public isIosDevice(): boolean {
    return this._platform.IOS;
  }
}
