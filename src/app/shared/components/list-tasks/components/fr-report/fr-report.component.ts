/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {Subscription} from 'rxjs';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {FRReport} from '@app/utils/interfaces/reports/frr-report';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';
import {MDate} from '@app/utils/class/MDate';

@Component({
  selector: 'app-fr-report',
  templateUrl: './fr-report.component.html',
  styleUrls: ['./fr-report.component.scss']
})
export class FrReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  private _stationId: string;
  public task: any;

  @Input() set taskFrInfo(taskObj: any) {
    if (taskObj) {
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getFRReport();
    }
  }

  @Input() set station(station: any) {
    if (station) {
      this._stationId = station.id;
    }
  }

  public load: boolean;
  public frForm: FormGroup;
  public frReport: FRReport;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public name: string;
  public error: boolean;
  private _indexTask: number;
  public signatureThumbnail: string;
  private _signatureElement: any;
  private _signature: FormData;
  private _copyLastTask: FRReport;
  private _subscriptionLoader: Subscription;
  private _subscriptionShared: Subscription;
  private _load: boolean;
  public readonly starDate: Date;

  constructor(
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _formBuilder: FormBuilder,
    private _signatureService: SignaturePadService,
    private _uploadFileService: UploadFileService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _formatTimePipe: FormatTimePipe
  ) {
    this.starDate = new Date();
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.editable = false;
    this._load = false;
    this.error = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.initFrReport();
    this.getNotifications();
  }

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private getNotifications(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.EditTask) {
        if (response.value === 7) {
          this.startEditTask();
        }
      } else {
      }
    });
  }

  private initFrReport(): void {
    this.frForm = this._formBuilder.group({
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      remissionNumber: ['', [Validators.required]],
      tankNumber: ['', [Validators.required]],
      remission: ['', [Validators.required]],
      volumetric: ['', [Validators.required]],
      finalVol: ['', [Validators.required]],
      waste: ['', [Validators.required]],
      fuelType: [0, []],
      receiveName: ['', [Validators.required]]
    });
  }


  private patchForm(report: FRReport): void {
    this.frReport = {
      date: report.date || null,
      diesel: report.diesel || null,
      endTime: report.endTime,
      fileCS: report.fileCS || null,
      finalVol: report.finalVol || null,
      folio: report.folio || null,
      id: report.id || null,
      magna: report.magna || null,
      name: report.name || null,
      premium: report.premium || null,
      receiveName: report.receiveName || null,
      remission: report.remission || null,
      remissionNumber: report.remissionNumber,
      signature: report.signature || null,
      startTime: report.startTime,
      tankNumber: report.tankNumber,
      taskId: report.taskId || null,
      volumetric: report.volumetric || null,
      waste: report.waste || null
    };
    let fuelType = 0;
    if (this.frReport.magna) {
      fuelType = 1;
    } else if (this.frReport.premium) {
      fuelType = 2;
    } else if (this.frReport.diesel) {
      fuelType = 3;
    }
    this.frForm.patchValue({
      date: MDate.getPrimitiveDate(this.frReport.date),
      startTime: this._formatTimePipe.transform(this.frReport.startTime),
      endTime: this._formatTimePipe.transform(this.frReport.endTime),
      remissionNumber: this.frReport.remissionNumber,
      remission: this.frReport.remission,
      volumetric: this.frReport.volumetric,
      fuelType: fuelType,
      receiveName: this.frReport.receiveName
    });
    this.date = UtilitiesService.convertDate(this.frReport.date);
    this.frForm.disable();
  }

  private getFRReport(): void {
    this._api.getTaskInformation(this._taskId, 7).subscribe(response => {
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

  private resetElements(): void {
    this.frReport = undefined;
    this.frForm.reset();
    this.frForm.disable();
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (this.task.status !== 4 && user.role === 7) {
      this.startEditTask(true);
    }
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditTask(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = LocalStorageService.getItem<any>(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if (!isNewLoad) {
      this._copyLastTask = this.frReport;
      this.frReport.date = undefined;
      this.frReport.signature = undefined;
      this.frReport.folio = undefined;
    }
    this.frForm.enable();
  }

  public changeTime(ev: any, type: string): void {
    this.frForm.patchValue({
      [type]: ev
    });
  }

  public changeFuelType(ev: any) {
    this.error = false;
  }

  public loadSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.signatureThumbnail = response.base64;
        this._load = true;
        this._signature = new FormData();
        this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
        this._signature.append('isImage', 'true');
        this._signature.append('file', response.blob);
      }
    });
  }

  public validateForm(value: any): void {
    if (!value.fuelType) {
      this.error = true;
    }
    if (this.frForm.invalid || this.error) {
      this._snackBarService.setMessage('Por favor, complete los campos', 'OK', 3000);
      return;
    }
    if (!this._signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    if (this._load) {
      this.uploadSignature();
      return;
    }
    this.saveReport(value);
  }

  private saveReport(value: any): void {
    this.frReport = {
      date: UtilitiesService.createPersonalTimeStamp(value.date).timeStamp,
      diesel: value.fuelType === 3,
      endTime: UtilitiesService.removeFormatTime(value.endTime),
      finalVol: value.finalVol,
      magna: value.fuelType === 1,
      name: this.name,
      premium: value.fuelType === 2,
      receiveName: value.receiveName,
      remission: value.remission,
      remissionNumber: value.remissionNumber,
      signature: this._signatureElement,
      startTime: UtilitiesService.removeFormatTime(value.startTime),
      tankNumber: value.tankNumber,
      taskId: this._taskId,
      volumetric: value.volumetric,
      waste: value.waste
    };
    if (this._copyLastTask) {
      this.frReport.id = this._copyLastTask.id;
      this._api.createTask(this.frReport, 7).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
        } else {
          console.error(response);
        }
      });
    } else {
      this._api.createFRReportAndTask(this.frReport, this._stationId).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
        } else {
          console.error(response);
        }
      });
    }
  }

  private uploadSignature(): void {
    this._uploadFileService.upload(this._signature).subscribe(response => {
      if (response) {
        this._signatureElement = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this._load = false;
        this.validateForm(this.frForm.value);
      }
    });
  }
}
