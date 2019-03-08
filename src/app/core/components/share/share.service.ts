/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ShareComponent} from './share.component';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class ShareService {

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _bottomSheet: MatBottomSheet
  ) { }

  public open(url: string): void{
    this._bottomSheet.open(ShareComponent, {
      panelClass: 'share-panel',
      data: url
    })
  }

  private getHost(): string{
    let host = '';
    if(isPlatformBrowser(this._platformId)){
      host = window.location.host;
    }
    return host;
  }

  private getProtocol(): string{
    let protocol = '';
    if(isPlatformBrowser(this._platformId)){
      protocol = window.location.protocol + '//';
    }
    return protocol;
  }
}
