/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CountryCodeComponent} from '@app/shared/components/country-code/country-code.component';
import {CountryCodeService} from '@app/shared/components/country-code/country-code.service';
import {CropImageComponent} from '@app/shared/components/crop-image/crop-image.component';
import {DialogComponent} from '@app/shared/components/dialog/dialog.component';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {ImageVisorComponent} from '@app/shared/components/image-visor/image-visor.component';
import {ImageVisorService} from '@app/shared/components/image-visor/image-visor.service';
import {LocationComponent} from '@app/shared/components/location/location.component';
import {LocationService} from '@app/shared/components/location/location.service';
import {OpenFileComponent} from '@app/shared/components/open-file/open-file.component';
import {OpenFileService} from '@app/shared/components/open-file/open-file.service';
import {PdfVisorComponent} from '@app/shared/components/pdf-visor/pdf-visor.component';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {SearchBoxCoreComponent} from '@app/shared/components/search-box/search-box.component';
import {ShareComponent} from '@app/shared/components/share/share.component';
import {ShareService} from '@app/shared/components/share/share.service';
import {SignaturePadComponent} from '@app/shared/components/signature-pad/signature-pad.component';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {UpdatePasswordComponent} from '@app/shared/components/update-password/update-password.component';
import {UpdatePasswordService} from '@app/shared/components/update-password/update-password.service';
import {CommonsModule} from '@app/commons/commons.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {Constants} from '@app/utils/constants/constants.utils';
import {AgmCoreModule} from '@agm/core';
import {FooterComponent} from '@app/shared/components/footer/footer.component';
import {AddGasStationComponent} from '@app/shared/components/add-gas-station/add-gas-station.component';
import {AddStationService} from '@app/shared/components/add-gas-station/add-station.service';
import {SharedPipesModule} from '@app/shared/pipes/shared.pipes.module';
import {ModalStationComponent} from '@app/shared/components/modal-station/modal-station.component';
import {ModalStationService} from '@app/shared/components/modal-station/modal-station.service';
import {RouterModule} from '@angular/router';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {UploadFileModule} from 'ng-maplander';


const Components = [
  CountryCodeComponent,
  CropImageComponent,
  DialogComponent,
  FooterComponent,
  ImageVisorComponent,
  LocationComponent,
  OpenFileComponent,
  PdfVisorComponent,
  SearchBoxCoreComponent,
  ShareComponent,
  SignaturePadComponent,
  UpdatePasswordComponent,
  AddGasStationComponent,
  ModalStationComponent
];


const Providers = [
  CountryCodeService,
  DialogService,
  ImageVisorService,
  LocationService,
  OpenFileService,
  PdfVisorService,
  ShareService,
  SignaturePadService,
  UpdatePasswordService,
  UploadFileService,
  AddStationService,
  ModalStationService
];

const EntryComponents = [
  CountryCodeComponent,
  DialogComponent,
  ImageVisorComponent,
  LocationComponent,
  OpenFileComponent,
  PdfVisorComponent,
  ShareComponent,
  SignaturePadComponent,
  UpdatePasswordComponent,
  AddGasStationComponent,
  CropImageComponent,
  ModalStationComponent
];


@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    RouterModule,
    SharedPipesModule,
    ImageCropperModule,
    PdfViewerModule,
    UploadFileModule,
    AgmCoreModule.forRoot({
      apiKey: Constants.GoogleApiKey,
      libraries: [
        'places', 'geometry', 'drawing'
      ],
      language: 'es'
    })
  ],
  declarations: [
    Components
  ],
  exports: [
    Components,
    CommonsModule
  ],
  entryComponents: [
    EntryComponents
  ],
  providers: [
    Providers
  ]
})
export class ComponentsModule {
}
