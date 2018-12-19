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
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {AuthService} from '@app/core/services/auth/auth.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    DirectivesModule,
    ServicesModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  exports: [
    MaterialModule,
    PipesModule,
    DirectivesModule,
    ServicesModule,
    FormsModule,
    ReactiveFormsModule,
    UploadImageComponent,
    CropImageComponent
  ],
  declarations: [
    DialogComponent,
    ShareComponent,
    UploadImageComponent,
    CropImageComponent
  ],
  entryComponents: [
    DialogComponent,
    ShareComponent,
    CropImageComponent
  ],
  providers: [
    DialogService,
    ShareService,
    UtilitiesService,
    UploadImageService,
    PipesModule,
    CurrencyPipe
  ]
})
export class CoreModule { }
