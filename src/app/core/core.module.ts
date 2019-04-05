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
import {DatepickerService} from '@app/components/screen/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/components/screen/components/task-filter/task-filter.service';
import {ModalStationService} from '@app/components/screen/components/modal-station/modal-station.service';
import { PdfVisorComponent } from './components/pdf-visor/pdf-visor.component';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {ModalProceduresService} from '@app/components/screen/components/modal-procedures/modal-procedures.service';
import {AmazingTimePickerModule} from 'amazing-time-picker';
import {TimePickerService} from '@app/core/components/time-picker/time-picker.service';
import {SasisopaService} from '@app/components/screen/components/sasisopa/sasisopa.service';
import {TaskFilterNameService} from '@app/components/screen/components/task-filter-name/task-filter-name.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {ImageVisorComponent} from '@app/core/components/image-visor/image-visor.component';
import {SgmService} from '@app/components/screen/components/sgm/sgm.service';
import {HashService} from '@app/core/utilities/hash.service';

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
    AmazingTimePickerModule,
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
    PdfVisorComponent,
    ImageVisorComponent
  ],
  entryComponents: [
    DialogComponent,
    UpdatePasswordComponent,
    ShareComponent,
    CropImageComponent,
    CountryCodeComponent,
    LocationComponent,
    SignaturePadComponent,
    PdfVisorComponent,
    ImageVisorComponent
  ],
  providers: [
    AuthService,
    DialogService,
    UpdatePasswordService,
    ShareService,
    UtilitiesService,
    HashService,
    UploadFileService,
    PipesModule,
    CurrencyPipe,
    CountryCodeService,
    LocationService,
    SignaturePadService,
    DatepickerService,
    TaskFilterService,
    ModalStationService,
    PdfVisorService,
    AddStationService,
    ModalProceduresService,
    TimePickerService,
    SasisopaService,
    SgmService,
    TaskFilterNameService,
    ImageVisorService
  ]
})
export class CoreModule { }
