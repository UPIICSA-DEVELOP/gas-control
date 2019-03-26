/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IconsService} from './icons/icons.service';
import {MetaService} from './meta/meta.service';
import {SnackBarService} from './snackbar/snackbar.service';
import {ClipboardService} from './clipboard/clipboard.service';
import {ApiService } from './api/api.service';
import {ApiLoaderService} from './api/api-loader.service';
import {DeviceDetectorService} from './device-detector/device-detector.service';
import {LocalStorageService} from './local-storage/local-storage.service';
import {CookieService} from './cookie/cookie.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {MessagingService} from '@app/core/services/messaging/messaging.service';
import {RouterStateService} from '@app/core/services/router-state/router-state.service';
import {NetworkService} from '@app/core/services/connection/network.service';
import {PriorityService} from '@app/core/services/priority/priority.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {ResetPassService} from '@app/core/services/reset-pass/reset-pass.service';
import {UserProfileService} from '@app/core/services/profiles/user-profile.service';
import {SharedService} from '@app/core/services/shared/shared.service';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {ResetPassRouterService} from '@app/core/services/reset-pass/reset-pass-router.service';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    MetaService,
    IconsService,
    SnackBarService,
    ClipboardService,
    ApiService,
    ApiLoaderService,
    DeviceDetectorService,
    LocalStorageService,
    SessionStorageService,
    CookieService,
    MessagingService,
    RouterStateService,
    NetworkService,
    PriorityService,
    AuthService,
    AuthRouterService,
    ResetPassService,
    ResetPassRouterService,
    UserProfileService,
    SharedService
  ]
})
export class ServicesModule {
  constructor(
    private _icons: IconsService,
    private _meta: MetaService,
    private _routerState: RouterStateService,
    private _networkService: NetworkService
  ) {
    this._routerState.loadRouting();
    this._networkService.init();
    this._meta.init();
    this._icons.init();
  }
}
