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
import {UploadFileComponent} from './components/upload-file/upload-file.component';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
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
import {SignaturePadComponent} from '@app/core/components/signature-pad/signature-pad.component';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {DatepickerComponent} from '@app/core/components/datepicker/datepicker.component';
import {DatepickerService} from '@app/core/components/datepicker/datepicker.service';
import {TaskFilterComponent} from '@app/core/components/task-filter/task-filter.component';
import {TaskFilterService} from '@app/core/components/task-filter/task-filter.service';
import { ModalStationComponent } from './components/modal-station/modal-station.component';
import {ModalStationService} from '@app/core/components/modal-station/modal-station.service';
import { PdfVisorComponent } from './components/pdf-visor/pdf-visor.component';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';

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
    UploadFileComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent,
    SearchBoxCoreComponent
  ],
  declarations: [
    DialogComponent,
    UpdatePasswordComponent,
    ShareComponent,
    UploadFileComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent,
    SearchBoxCoreComponent,
    SignaturePadComponent,
    DatepickerComponent,
    TaskFilterComponent,
    ModalStationComponent,
    PdfVisorComponent
  ],
  entryComponents: [
    DialogComponent,
    UpdatePasswordComponent,
    ShareComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent,
    SignaturePadComponent,
    DatepickerComponent,
    TaskFilterComponent,
    ModalStationComponent,
    PdfVisorComponent
  ],
  providers: [
    AuthService,
    DialogService,
    UpdatePasswordService,
    ShareService,
    UtilitiesService,
    UploadFileService,
    PipesModule,
    CurrencyPipe,
    CountryCodeService,
    LocationService,
    SignaturePadService,
    DatepickerService,
    TaskFilterService,
    ModalStationService,
    PdfVisorService
  ]
})
export class CoreModule { }
