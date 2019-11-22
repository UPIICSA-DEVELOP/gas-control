/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {ImageVisorService} from '@app/shared/components/image-visor/image-visor.service';
import {Subscription} from 'rxjs';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {UploadFileResponse} from '@app/shared/components/upload-file/upload-file.component';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {ModalProceduresService} from '@app/ui/dashboard/components/modal-procedures/modal-procedures.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {IncidenceReport} from '@app/utils/interfaces/reports/incidence-report';
import {Task} from '@app/utils/interfaces/task';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {LocalStorageService, SnackBarService} from 'ng-maplander';

@Component({
  selector: 'app-incidence-report',
  templateUrl: './incidence-report.component.html',
  styleUrls: ['./incidence-report.component.scss']
})
export class IncidenceReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  private _stationId: string;
  public task: Task;
  public utils: AppUtil;

  @Input() set taskIncidenceInfo(taskObj: any) {
    if (taskObj) {
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getIncidenceReport();
    }
  }

  @Input() set utilities(utils: any) {
    if (utils) {
      this.utils = utils;
    }
  }

  @Input() set station(station: any) {
    if (station) {
      this._stationId = station.id;
    }
  }

  public load: boolean;
  public incidenceForm: FormGroup;
  public incidenceReport: IncidenceReport;
  public date: any[];
  public taskItems: any[];
  public name: string;
  private readonly _load: boolean[];
  public editable: boolean;
  public error: boolean;
  private _copyTask: IncidenceReport;
  public procedures: number[];
  private _indexTask: number;
  private _subscriptionLoader: Subscription;
  private _subscriptionShared: Subscription;
  public evidenceThumbnail: string;
  private _evidenceElement: any;
  private _evidence: FormData;
  public signatureThumbnail: string;
  private _signatureElement: any;
  private _signature: FormData;

  constructor(
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _uploadFile: UploadFileService,
    private _proceduresService: ModalProceduresService,
    private _signatureService: SignaturePadService,
    private _sharedService: SharedService,
    private _formatTimePipe: FormatTimePipe
  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.procedures = [];
    this.editable = false;
    this.error = false;
    this._load = [false, false];
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.initIncidenceForm();
    this.getNotifications();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
    this._subscriptionShared.unsubscribe();
  }

  private initIncidenceForm(): void {
    this.incidenceForm = this._formBuilder.group({
      time: ['', [Validators.required]],
      area: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  private getNotifications(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.EditTask) {
        if (response.value === 9) {
          this.startEditFormat();
        }
      } else {
      }
    });
  }

  private patchForm(report: IncidenceReport): void {
    this.incidenceReport = {
      area: report.area || undefined,
      date: report.date || undefined,
      description: report.description || undefined,
      fileCS: report.fileCS || undefined,
      folio: report.folio || undefined,
      id: report.id || undefined,
      name: report.name || undefined,
      procedures: report.procedures || [],
      signature: report.signature || undefined,
      taskId: report.taskId || undefined,
      time: report.time
    };
    this.incidenceForm.patchValue({
      time: this._formatTimePipe.transform(this.incidenceReport.time),
      area: this.incidenceReport.area,
      description: this.incidenceReport.description
    });
    this.date = UtilitiesService.convertDate(this.incidenceReport.date);
    this.incidenceForm.disable();
  }

  private getIncidenceReport(): void {
    this._api.getTaskInformation(this._taskId, 9).subscribe(response => {
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

  private startEditFormat(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if (!isNewLoad) {
      this._copyTask = this.incidenceReport;
      this.procedures = this.incidenceReport.procedures || [];
      if (this.incidenceReport.fileCS) {
        this._evidenceElement = this.incidenceReport.fileCS;
        this.evidenceThumbnail = this.incidenceReport.fileCS.thumbnail;
      }
      this.incidenceReport.date = undefined;
      this.incidenceReport.signature = undefined;
      this.incidenceReport.folio = undefined;
    }
    this.incidenceForm.enable();
  }

  private resetElements(): void {
    this.incidenceReport = undefined;
    this.incidenceForm.reset();
    this.incidenceForm.disable();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if (this.task.status !== 4 && user.role === 7) {
      this.startEditFormat(true);
    }
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  public seeEvidence(): void {
    if (this.taskItems[this._indexTask].fileCS) {
      this._imageVisor.open(this.taskItems[this._indexTask].fileCS);
    } else {
      this._snackBarService.setMessage('Esta tarea no cuenta con evidencia', 'OK', 3000);
    }
  }

  public changeTime(ev: any): void {
    this.incidenceForm.patchValue({
      time: ev
    });
  }

  public loadEvidence(ev: UploadFileResponse): void {
    this.evidenceThumbnail = ev.url;
    this._load[0] = true;
    this._evidence = new FormData();
    this._evidence.append('path', 'Task' + this._taskId);
    this._evidence.append('fileName', 'evidence-' + this._taskId + new Date().getTime() + '.png');
    this._evidence.append('isImage', 'true');
    this._evidence.append('file', ev.blob);
    this.error = false;
  }

  public deleteEvidence(): void {
    this.evidenceThumbnail = undefined;
    this._load[0] = false;
    this._evidence = undefined;
  }

  public addRemoveArrayItem(isAdd: boolean, index?: number): void {
    if (isAdd) {
      this._proceduresService.open(
        {utils: this.utils.procedures, proceduresSelected: this.procedures, notVisibleChecks: false}
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this.procedures = response.data;
        }
      });
    } else {
      this.procedures.splice(index, 1);
    }
  }

  public loadSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.signatureThumbnail = response.base64;
        this._load[1] = true;
        this._signature = new FormData();
        this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
        this._signature.append('isImage', 'true');
        this._signature.append('file', response.blob);
      }
    });
  }

  public validateForm(value: any): void {
    if (!this.evidenceThumbnail) {
      this.error = true;
    }
    if (this.error || this.incidenceForm.invalid) {
      this._snackBarService.setMessage('Por favor, complete los campos', 'OK', 3000);
      return;
    }
    if (!this._signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    if (this._load[0]) {
      this.uploadFile(1);
      return;
    }
    if (this._load[1]) {
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
            this._load[0] = false;
            this.validateForm(this.incidenceForm.value);
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
            this._load[1] = false;
            this.validateForm(this.incidenceForm.value);
          }
        });
        break;
      default:
        break;
    }
  }

  private saveReport(value: any): void {
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.incidenceReport = {
      area: value.area,
      date: date.timeStamp,
      description: value.description,
      fileCS: this._evidenceElement,
      name: this.name,
      procedures: this.procedures,
      signature: this._signatureElement,
      taskId: this._taskId,
      time: UtilitiesService.removeFormatTime(value.time)
    };
    if (this._copyTask) {
      this.incidenceReport.id = this._copyTask.id;
      this._api.createTask(this.incidenceReport, 9).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
        } else {
          console.error(response);
        }
      });
    } else {
      this._api.createIncidenceReportAndTask(this.incidenceReport, this._stationId).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
        } else {
          console.error(response);
        }
      });
    }

  }

}
