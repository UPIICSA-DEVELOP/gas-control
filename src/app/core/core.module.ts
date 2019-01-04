/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {DialogComponent} from './components/dialog/dialog.component';
import {DialogService} from './components/dialog/dialog.service';
import { ShareComponent } from './components/share/share.component';
import {ShareService} from './components/share/share.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '@app/core/pipes/pipes.module';
import {UtilitiesService} from './utilities/utilities.service';
import {ServicesModule} from '@app/core/services/services.module';
import {DirectivesModule} from '@app/core/directives/directives.module';
import {UploadImageComponent} from './components/upload-file/upload-image.component';
import {UploadImageService} from '@app/core/components/upload-file/upload-image.service';
import {MaterialModule} from '@app/core/material/material.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import { CropImageComponent } from './components/crop-image/crop-image.component';
import {AuthService} from '@app/core/services/auth/auth.service';
import {CountryCodeComponent} from '@app/core/components/country-code/country-code.component';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {LocationComponent} from '@app/core/components/location/location.component';
import {SearchBoxCoreComponent} from '@app/core/components/search-box/search-box.component';
import {AgmCoreModule} from '@agm/core';
import {Constants} from '@app/core/constants.core';
import {LocationService} from '@app/core/components/location/location.service';
import {UpdatePasswordComponent} from '@app/core/components/update-password/update-password.component';
import {UpdatePasswordService} from '@app/core/components/update-password/update-password.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    DirectivesModule,
    ServicesModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AgmCoreModule.forRoot({
      apiKey: Constants.GoogleApiKey,
      libraries: [
        "places","geometry","drawing"
      ],
      language: "es"
    }),
  ],
  exports: [
    MaterialModule,
    PipesModule,
    DirectivesModule,
    ServicesModule,
    FormsModule,
    ReactiveFormsModule,
    UploadImageComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent,
    SearchBoxCoreComponent
  ],
  declarations: [
    DialogComponent,
    UpdatePasswordComponent,
    ShareComponent,
    UploadImageComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent,
    SearchBoxCoreComponent
  ],
  entryComponents: [
    DialogComponent,
    UpdatePasswordComponent,
    ShareComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent
  ],
  providers: [
    AuthService,
    DialogService,
    UpdatePasswordService,
    ShareService,
    UtilitiesService,
    UploadImageService,
    PipesModule,
    CurrencyPipe,
    CountryCodeService,
    LocationService
  ]
})
export class CoreModule { }
