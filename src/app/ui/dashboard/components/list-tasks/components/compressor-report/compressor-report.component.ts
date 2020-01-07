/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {ImageVisorService} from '@app/shared/components/image-visor/image-visor.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {Subscription} from 'rxjs';
import {Constants} from '@app/utils/constants/constants.utils';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {CompressorReport} from '@app/utils/interfaces/reports/compressor-report';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';
import {Task} from '@app/utils/interfaces/task';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {UserMedia} from '@app/utils/interfaces/user-media';
import {Person} from '@app/utils/interfaces/person';

@Component({
  selector: 'app-compressor-report',
  templateUrl: './compressor-report.component.html',
  styleUrls: ['./compressor-report.component.scss']
})
export class CompressorReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: Task;

  @Input() set taskCompInfo(taskObj: Task) {
    if (taskObj) {
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getCompReport();
    }
  }

  public load: boolean;
  public compressorReport: CompressorReport;
  public compForm: FormGroup;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public name: string;
  public signatureThumbnail: string;
  public evidenceThumbnail: string;
  public error: boolean;
  public startValidate: boolean;
  public hwgData: HWGReport;
  private _indexTask: number;
  private _signature: FormData;
  private _evidence: FormData;
  private readonly _loads: boolean[];
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  private _evidenceElement: any;
  private _signatureElement: any;
  private _copyTask: CompressorReport;
  private _hwgElement: HWGReport;

  constructor(
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _uploadFile: UploadFileService,
    private _signatureService: SignaturePadService,
    private _formatTimePipe: FormatTimePipe
  ) {
    this.startValidate = false;
    this.error = false;
    this._loads = [false, false];
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.editable = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.initCompForm();
    this.getNotifications();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
    this._subscriptionShared.unsubscribe();
  }

  private getNotifications(): void {
    this._subscriptionShared = this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.EditTask) {
        if (response.value === 2) {
          this.startEditFormat();
        }
      } else {
      }
    });
  }

  private initCompForm(): void {
    this.compForm = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      brand: ['', []],
      model: ['', []],
      controlNumber: ['', []],
      pressure: ['', [Validators.required]],
      purge: ['', [Validators.required]],
      securityValve: ['', [Validators.required]],
      modifications: ['', []],
      observations: ['', []]
    });
  }

  private resetElements(): void {
    this.compressorReport = null;
    this.compForm.reset();
    this.compForm.disable();
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (this.task.status !== 4 && user.role === 7) {
      this.startEditFormat(true);
    }
  }

  private patchForm(report: CompressorReport): void {
    this.compressorReport = {
      brand: report.brand || null,
      controlNumber: report.controlNumber || null,
      date: report.date || null,
      endTime: report.endTime,
      fileCS: report.fileCS || null,
      folio: report.folio || null,
      hwgReport: report.hwgReport || null,
      id: report.id || null,
      model: report.model || null,
      modifications: report.modifications || null,
      name: report.name || null,
      observations: report.observations || null,
      pressure: report.pressure || null,
      purge: report.purge || null,
      securityValve: report.securityValve || null,
      signature: report.signature || null,
      startTime: report.startTime,
      taskId: report.taskId || null
    };
    this.compForm.patchValue({
      startTime: this._formatTimePipe.transform(this.compressorReport.startTime),
      endTime: this._formatTimePipe.transform(this.compressorReport.endTime),
      brand: this.compressorReport.brand,
      model: this.compressorReport.model,
      controlNumber: this.compressorReport.controlNumber,
      pressure: this.compressorReport.pressure,
      purge: this.compressorReport.purge,
      securityValve: this.compressorReport.securityValve,
      modifications: this.compressorReport.modifications,
      observations: this.compressorReport.observations
    });
    if (this.compressorReport.hwgReport) {
      this.hwgData = this.compressorReport.hwgReport;
    } else {
      this.hwgData = undefined;
    }
    this.date = UtilitiesService.convertDate(this.compressorReport.date);
    this.compForm.disable();
  }

  private getCompReport(): void {
    this._api.getTaskInformation(this._taskId, 2).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.items) {
          this.taskItems = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
          this._indexTask = 0;
          this.patchForm(this.taskItems[0]);
        } else {
          this.resetElements();
        }
      } else {
        this.resetElements();
      }
    });
  }

  public seeEvidence(): void {
    if (this.task.status !== 4) {
      return;
    }
    if (this.taskItems[this._indexTask].fileCS) {
      this._imageVisor.open(this.taskItems[this._indexTask].fileCS);
    } else {
      this._snackBarService.setMessage('Esta tarea no cuenta con evidencia', 'OK', 3000);
    }
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }


  private startEditFormat(prepare?: boolean): void {
    let today: any = new Date();
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.name + user.lastName;
    this._sharedService.setNotification({type: SharedTypeNotification.HwgActive, value: prepare ? prepare : false});
    if (!prepare) {
      this._copyTask = this.compressorReport;
      this.compressorReport.signature = null;
      if (this.compressorReport.fileCS) {
        this.evidenceThumbnail = this.compressorReport.fileCS.thumbnail;
        this._evidenceElement = this.compressorReport.fileCS;
      }
      if (this.compressorReport.hwgReport) {
        this.hwgData = this.compressorReport.hwgReport;
      }
      this.compressorReport.signature = null;
      this.compressorReport.folio = null;
      this.compressorReport.name = user.name + user.lastName;
    }
    this.compForm.enable();
  }

  public changeTime(ev: any, type: string): void {
    this.compForm.patchValue({
      [type]: ev
    });
  }

  public loadSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.signatureThumbnail = response.base64;
        this._loads[1] = true;
        this._signature = new FormData();
        this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
        this._signature.append('isImage', 'true');
        this._signature.append('file', response.blob);
      }
    });
  }

  public loadEvidence(ev: UserMedia): void {
    if (ev) {
      this.evidenceThumbnail = null;
      this._loads[0] = false;
      this._evidence = null;
      this._evidenceElement = null;
    }
    this.error = false;
    this.evidenceThumbnail = ev.url;
    this._loads[0] = true;
    this._evidence = new FormData();
    this._evidence.append('path', '');
    this._evidence.append('fileName', 'evidence-' + new Date().getTime() + '.png');
    this._evidence.append('isImage', 'true');
    this._evidence.append('file', ev.blob);
  }

  public validateForm(value: any): void {
    let error = false;
    if (this.task.evidence && (!this._evidence && !this.compressorReport.fileCS)) {
      this.error = true;
    }
    if (this.task.hwg) {
      if (!this._hwgElement.area ||
        !this._hwgElement.waste ||
        !this._hwgElement.quantity ||
        !this._hwgElement.unity ||
        !this._hwgElement.temporaryStorage) {
        error = true;
      }
    }
    if (this.compForm.invalid || this.error || error) {
      this._snackBarService.setMessage('Por favor, complete los campos', 'OK', 3000);
      return;
    }
    if (!this._signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    if (this._loads[0]) {
      this.uploadFile(1);
      return;
    }
    if (this._loads[1]) {
      this.uploadFile(2);
      return;
    }
    this.saveReport(value);
  }

  private uploadFile(type: number): void {
    switch (type) {
      case 1:
        this._uploadFile.upload(this._evidence).subscribe(response => {
          if (response) {
            this._evidenceElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[0] = false;
            this.validateForm(this.compForm.value);
          }
        });
        break;
      case 2:
        this._uploadFile.upload(this._signature).subscribe(response => {
          if (response) {
            this._signatureElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[1] = false;
            this.validateForm(this.compForm.value);
          }
        });
        break;
      default:
        break;
    }
  }

  private saveReport(value): any {
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.compressorReport = {
      brand: value.brand,
      controlNumber: value.controlNumber,
      date: date.timeStamp,
      endTime: UtilitiesService.removeFormatTime(value.endTime),
      fileCS: this._evidenceElement,
      hwgReport: undefined,
      modifications: value.modifications,
      model: value.model,
      name: this.name,
      observations: value.observations,
      purge: value.purge,
      pressure: value.pressure,
      signature: this._signatureElement,
      securityValve: value.securityValve,
      startTime: UtilitiesService.removeFormatTime(value.startTime),
      taskId: this._taskId,
    };
    if (this._copyTask) {
      this.compressorReport.id = this._copyTask.id;
    }
    if (this.task.hwg) {
      this.compressorReport.hwgReport = this._hwgElement;
    }
    this._api.createTask(this.compressorReport, 2).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
      } else {
        console.error(response);
      }
    });
  }

  public getHWGReportInformation(ev: any): void {
    if (ev.valid) {
      this._hwgElement = {
        area: ev.value.area,
        corrosive: ev.value.corrosive,
        explosive: ev.value.explosive,
        flammable: ev.value.flammable,
        reactive: ev.value.reactive,
        quantity: ev.value.quantity,
        temporaryStorage: ev.value.temporaryStorage,
        toxic: ev.value.toxic,
        unity: ev.value.unity,
        waste: ev.value.waste
      };
    } else {
      this._hwgElement = {
        area: undefined,
        corrosive: false,
        explosive: false,
        flammable: false,
        reactive: false,
        quantity: undefined,
        temporaryStorage: undefined,
        toxic: false,
        unity: undefined,
        waste: undefined
      };
    }
    this.startValidate = false;
    this.validateForm(this.compForm.value);
  }

  public startValidateForm(): void {
    this.startValidate = true;
  }

}
