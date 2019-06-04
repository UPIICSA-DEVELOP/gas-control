/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Component, Inject, OnInit, SecurityContext} from '@angular/core';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {DeviceDetectorService} from '@app/core/services/device-detector/device-detector.service';
import {ClipboardService} from '@app/core/services/clipboard/clipboard.service';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  public urlShareWhatsApp: string;
  constructor(
    private _clipboard: ClipboardService,
    private _deviceDetector: DeviceDetectorService,
    private _sanitization: DomSanitizer,
    @Inject(MAT_BOTTOM_SHEET_DATA) private _data: any
  ) { }

  ngOnInit() {
    const url = 'https://wa.me/?text=' + this._data;
    this.urlShareWhatsApp = this._sanitization.sanitize(SecurityContext.URL, url);
  }

  public shareWithFacebook(): void{
    UtilitiesService.shareFacebook(this._data, this._deviceDetector.isMobileDevice());
  }

  public shareWithTwitter(): void{
    UtilitiesService.shareTwitter(window, this._data);
  }

  public copyLink(): void{
    this._clipboard.copy(this._data);
  }

}
