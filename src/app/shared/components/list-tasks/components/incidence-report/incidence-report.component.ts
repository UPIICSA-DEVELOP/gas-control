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
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {ModalProceduresService} from '@app/shared/components/modal-procedures/modal-procedures.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {IncidenceReport} from '@app/utils/interfaces/reports/incidence-report';
import {Task} from '@app/utils/interfaces/task';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';
import {CustomProcedure} from '@app/utils/interfaces/customProcedure';

@Component({
  selector: 'app-incidence-report',
  templateUrl: './incidence-report.component.html',
  styleUrls: ['./incidence-report.component.scss']
})
export class IncidenceReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  private _stationId: string;
  public task: any;
  public utils: AppUtil;
  public stationProcedures: Array<CustomProcedure>;

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
      this.getStationProcedures();
    }
  }

  public load: boolean;
  public incidenceForm: FormGroup;
  public incidenceReport: IncidenceReport;
  public date: Array<any>;
  public taskItems: Array<any>;
  public name: string;
  private readonly _load: Array<boolean>;
  public editable: boolean;
  public error: boolean;
  private _copyTask: IncidenceReport;
  public procedures: Array<number>;
  private _indexTask: number;
  private _subscriptionLoader: Subscription;
  private _subscriptionShared: Subscription;
  private _signature: FormData;
  private _blobs: Array<any>;

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
    this._blobs = [];
    this.stationProcedures = null;
    this.incidenceReport = {
      area: '',
      date: 0,
      description: '',
      extraFileCS: [],
      fileCS: null,
      folio: 0,
      id: null,
      name: '',
      procedures: [],
      signature: null,
      taskId: '',
      time: 0
    };
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

  public getProcedureName(procedureId: string | number): string {
    let name = '';
    this.utils.procedures.forEach((item) => {
      if (item.id === procedureId.toString()) {
        name = item.name;
      }
    });
    this.stationProcedures.forEach((item) => {
      if (item.customProcedureId === procedureId) {
        name = item.name;
      }
    });
    return name;
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
    if (!report.extraFileCS && report.fileCS) {
      report.extraFileCS = [];
      report.extraFileCS.push(report.fileCS);
      this._blobs = report.extraFileCS;
    }
    this.incidenceReport = {
      area: report.area || null,
      date: report.date || null,
      description: report.description || null,
      extraFileCS: report.extraFileCS || null,
      folio: report.folio || null,
      id: report.id || null,
      name: report.name || null,
      procedures: report.procedures || [],
      signature: report.signature || null,
      taskId: report.taskId || null,
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
    const user = LocalStorageService.getItem<any>(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if (!isNewLoad) {
      this._copyTask = this.incidenceReport;
      this.procedures = this.incidenceReport.procedures || [];
      this.incidenceReport.date = null;
      this.incidenceReport.signature = null;
      this.incidenceReport.folio = null;
    }
    this.incidenceForm.enable();
  }

  private resetElements(): void {
    this.incidenceForm.reset();
    this.incidenceForm.disable();
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (this.task.status !== 4 && user.role === 7) {
      this.startEditFormat(true);
    }
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  public seeEvidence(): void {
    this._imageVisor.open(
      this.incidenceReport.extraFileCS || [], this._blobs || [], !this.editable
    ).afterClosed().subscribe((response) => {
      switch (response.code) {
        case 1:
          if (response.data === null) {
            this._load[0] = false;
          }
          this._load[0] = true;
          this.error = false;
          this._blobs = response.data.blobs;
          this.incidenceReport.extraFileCS = response.data.images;
          break;
      }
    });
  }

  public changeTime(ev: any): void {
    this.incidenceForm.patchValue({
      time: ev
    });
  }

  public addRemoveArrayItem(isAdd: boolean, index?: number): void {
    if (isAdd) {
      this._proceduresService.open(
        {utils: this.utils.procedures, proceduresSelected: this.procedures,
          notVisibleChecks: false, stationId: this._stationId}
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
    if (!this.editable) {
      return;
    }
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.incidenceReport.signature = {
          thumbnail: response.base64,
          blobName: null
        };
        this._load[1] = true;
        this._signature = new FormData();
        this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
        this._signature.append('isImage', 'true');
        this._signature.append('file', response.blob);
      }
    });
  }

  public validateForm(value: any): void {
    if (this.incidenceReport.extraFileCS.length === 0) {
      this.error = true;
    }
    if (this.error || this.incidenceForm.invalid) {
      this._snackBarService.setMessage('Por favor, complete los campos', 'OK', 3000);
      return;
    }
    if (!this.incidenceReport.signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    if (this._load[0]) {
      this.uploadEvidences();
      return;
    }
    if (this._load[1]) {
      this.uploadFile();
      return;
    }
    this.saveReport(value);
  }

  private uploadEvidences(): void {
    for (let i = 0; i < this._blobs.length; i++) {
      if (this._blobs[i].hasOwnProperty('url')) {
        const evidence = new FormData();
        evidence.append('path', 'Task' + this._taskId);
        evidence.append('fileName', 'evidence-' + this._taskId + new Date().getTime() + '.png');
        evidence.append('isImage', 'true');
        evidence.append('file', this._blobs[i].blob);
        this._uploadFile.upload(evidence).subscribe(response => {
          if (response) {
            this._blobs[i] = response.item;
            this.uploadEvidences();
          }
        });
        break;
      } else {
        this.incidenceReport.extraFileCS[i] = this._blobs[i];
        if (i === this._blobs.length - 1) {
          this._load[0] = false;
          this.validateForm(this.incidenceForm.value);
          break;
        }
      }
    }
  }

  private uploadFile(): void {
    this._uploadFile.upload(this._signature).subscribe(response => {
      if (response) {
        this.incidenceReport.signature = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this._load[1] = false;
        this.validateForm(this.incidenceForm.value);
      }
    });
  }

  private saveReport(value: any): void {
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.incidenceReport = {
      area: value.area,
      date: date.timeStamp,
      description: value.description,
      extraFileCS: this.incidenceReport.extraFileCS,
      name: this.name,
      procedures: this.procedures,
      signature: this.incidenceReport.signature,
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
      this._api.createIncidenceReportAndTask(this.incidenceReport, this._stationId, '3').subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
        } else {
          console.error(response);
        }
      });
    }

  }

  private getStationProcedures(): void {
    this._api.customProcedureList(this._stationId).subscribe((response) => {
      if (response.items) {
        if (this.stationProcedures === null) {
          this.stationProcedures = [];
        }
        this.stationProcedures = this.stationProcedures.concat(response.items || []);
      }
    });
  }

}
