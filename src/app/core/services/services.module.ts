/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from './api/api.service';
import {DeviceDetectorService} from './device-detector/device-detector.service';
import {MessagingService} from '@app/core/services/messaging/messaging.service';
import {RouterStateService} from '@app/core/services/router-state/router-state.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {SharedService} from '@app/core/services/shared/shared.service';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {UserProfileService} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.service';
import {IconsModule} from '@app/core/services/icons/icons.module';
import {ClipboardModule, MetaModule, MetaService, NetworkModule} from '@maplander/core';

@NgModule({
  imports: [
    CommonModule,
    IconsModule.forRoot(),
    NetworkModule.forRoot(),
    ClipboardModule.forRoot(),
    MetaModule.forRoot(),
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
    this._meta.init().then();
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        ApiService,
        DeviceDetectorService,
        MessagingService,
        RouterStateService,
        AuthService,
        AuthRouterService,
        UserProfileService,
        SharedService
      ]
    };
  }
}
