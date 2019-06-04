/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MetaService} from './meta/meta.service';
import {SnackBarService} from './snackbar/snackbar.service';
import {ClipboardService} from './clipboard/clipboard.service';
import {ApiService } from './api/api.service';
import {DeviceDetectorService} from './device-detector/device-detector.service';
import {LocalStorageService} from './local-storage/local-storage.service';
import {CookieService} from './cookie/cookie.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {MessagingService} from '@app/core/services/messaging/messaging.service';
import {RouterStateService} from '@app/core/services/router-state/router-state.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {SharedService} from '@app/core/services/shared/shared.service';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {UserProfileService} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.service';
import {IconsModule} from '@app/core/services/icons/icons.module';
import {NetworkModule} from '@app/core/services/network/network.module';
import {ConsoleModule} from '@app/core/services/console/console.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule.forRoot(),
    NetworkModule.forRoot(),
    ConsoleModule.forRoot()
  ],
  declarations: [],
  providers: []
})
export class ServicesModule {
  constructor(
    private _meta: MetaService,
    private _routerState: RouterStateService
  ) {
    this._routerState.loadRouting();
    this._meta.init();
  }

  static forRoot(): ModuleWithProviders{
    return {
      ngModule: ServicesModule,
      providers: [
        MetaService,
        SnackBarService,
        ClipboardService,
        ApiService,
        DeviceDetectorService,
        LocalStorageService,
        SessionStorageService,
        CookieService,
        MessagingService,
        RouterStateService,
        AuthService,
        AuthRouterService,
        UserProfileService,
        SharedService
      ]
    }
  }

}
