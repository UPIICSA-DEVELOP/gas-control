/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {UploadFileModule} from '@maplander/core';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {CompressorReportComponent} from '@app/shared/components/list-tasks/components/compressor-report/compressor-report.component';
import {FeReportComponent} from '@app/shared/components/list-tasks/components/fe-report/fe-report.component';
import {FrReportComponent} from '@app/shared/components/list-tasks/components/fr-report/fr-report.component';
import {HwcReportComponent} from '@app/shared/components/list-tasks/components/hwc-report/hwc-report.component';
import {HwgReportComponent} from '@app/shared/components/list-tasks/components/hwg-report/hwg-report.component';
import {IncidenceReportComponent} from '@app/shared/components/list-tasks/components/incidence-report/incidence-report.component';
import {OmReportComponent} from '@app/shared/components/list-tasks/components/om-report/om-report.component';
import {ScannedReportComponent} from '@app/shared/components/list-tasks/components/scanned-report/scanned-report.component';
import {VrsReportComponent} from '@app/shared/components/list-tasks/components/vrs-report/vrs-report.component';
import {TaskCardComponent} from '@app/shared/components/task-card/task-card.component';
import {TaskFilterComponent} from '@app/shared/components/task-filter/task-filter.component';
import {TaskFilterNameComponent} from '@app/shared/components/task-filter-name/task-filter-name.component';
import {ListTasksComponent} from '@app/shared/components/list-tasks/list-tasks.component';
import {DatepickerComponent} from '@app/shared/components/datepicker/datepicker.component';
import {TaskFilterNameService} from '@app/shared/components/task-filter-name/task-filter-name.service';
import {TaskFilterService} from '@app/shared/components/task-filter/task-filter.service';
import {DatepickerService} from '@app/shared/components/datepicker/datepicker.service';
import {ModalProceduresComponent} from '@app/shared/components/modal-procedures/modal-procedures.component';
import {ModalProceduresService} from '@app/shared/components/modal-procedures/modal-procedures.service';
import {FreeReportComponent} from '@app/shared/components/list-tasks/components/free-report/free-report.component';

const Reports = [
  CompressorReportComponent,
  FeReportComponent,
  FrReportComponent,
  HwcReportComponent,
  HwgReportComponent,
  IncidenceReportComponent,
  OmReportComponent,
  ScannedReportComponent,
  VrsReportComponent,
  FreeReportComponent,
];

const Components = [
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
  ModalStationComponent,
  TaskCardComponent,
  TaskFilterComponent,
  TaskFilterNameComponent,
  ListTasksComponent,
  Reports,
  DatepickerComponent,
  ModalProceduresComponent
];

const Providers = [
  DialogService,
  ImageVisorService,
  LocationService,
  OpenFileService,
  PdfVisorService,
  ShareService,
  SignaturePadService,
  UpdatePasswordService,
  AddStationService,
  ModalStationService,
  UploadFileService,
  DatepickerService,
  TaskFilterService,
  TaskFilterNameService,
  ModalProceduresService
];

const EntryComponents = [
  DialogComponent,
  ImageVisorComponent,
  LocationComponent,
  OpenFileComponent,
  PdfVisorComponent,
  ShareComponent,
  SignaturePadComponent,
  UpdatePasswordComponent,
  AddGasStationComponent,
  ModalStationComponent,
  DatepickerComponent,
  TaskFilterComponent,
  TaskFilterNameComponent,
  ModalProceduresComponent
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
