/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ImageVisorService} from '@app/shared/components/image-visor/image-visor.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs';
import {Constants} from '@app/utils/constants/constants.utils';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {VRSReport} from '@app/utils/interfaces/reports/vrs-report';
import {VRSTank} from '@app/utils/interfaces/vrs-tank';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';
import {AuthService} from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-vrs-report',
  templateUrl: './vrs-report.component.html',
  styleUrls: ['./vrs-report.component.scss']
})
export class VrsReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;

  @Input() set taskVrsInfo(taskObj: any) {
    if (taskObj) {
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getVRSReport();
    }
  }

  public load: boolean;
  public vrsForm: FormGroup;
  public vrsReport: VRSReport;
  public date: Array<any>;
  public taskItems: Array<any>;
  public tanks: Array<VRSTank>;
  public editable: boolean;
  public name: string;
  public error: boolean;
  public errorTank: Array<boolean>;
  private _signature: FormData;
  private readonly _loads: Array<boolean>;
  private _indexTask: number;
  private _copyTask: VRSReport;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  private _blobs: Array<any>;
  constructor(
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _uploadFileService: UploadFileService,
    private _signatureService: SignaturePadService,
    private _sharedService: SharedService
  ) {
    this.vrsReport = {
      date: 0,
      emergencyStop: '',
      extraFileCS: [],
      fileCS: null,
      folio: 0,
      id: null,
      name: '',
      observations: '',
      signature: null,
      taskId: '',
      vrsAlarm: '',
      vrsDispensary: null,
      vrsTanks: []
    };
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.tanks = [{
      capAndFillingAdapter: null,
      capAndSteamAdapter: null,
      fuelType: 0,
      overfillValve: null,
      vacuumPressureValve: null
    }];
    this.errorTank = [false];
    this.editable = false;
    this._loads = [false, false];
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.initVrsForm();
    this.getNotifications();
  }

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private getNotifications(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.EditTask) {
        if (response.value === 4) {
          this.startEditReport();
        }
      }
    });
  }

  private initVrsForm(): void {
    this.vrsForm = this._formBuilder.group({
      magna: [false, []],
      premium: [false, []],
      fuelNozzle: ['', [Validators.required]],
      longHose: ['', [Validators.required]],
      breakAway: ['', [Validators.required]],
      shortHose: ['', [Validators.required]],
      equipment: ['', [Validators.required]],
      vrsAlarm: ['', [Validators.required]],
      emergencyStop: ['', [Validators.required]],
      observations: ['', []]
    });
  }

  private resetElements(): void {
    this.vrsForm.reset();
    this.vrsForm.disable();
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (this.task.status !== 4 && user.role === 7) {
      this.startEditReport(true);
    }
  }

  private patchForm(task: any): void {
    if (!task.extraFileCS && task.fileCS) {
      task.extraFileCS = [];
      task.extraFileCS.push(task.fileCS);
      this._blobs = task.extraFileCS;
    }
    this.vrsReport = {
      date: task.date || null,
      emergencyStop: task.emergencyStop || null,
      extraFileCS: task.extraFileCS || null,
      folio: task.folio || null,
      id: task.id || null,
      name: task.name || null,
      observations: task.observations || null,
      signature: task.signature || null,
      taskId: task.taskId || null,
      vrsAlarm: task.vrsAlarm || null,
      vrsDispensary: task.vrsDispensary || null,
      vrsTanks: task.vrsTanks || null
    };
    this.vrsForm.patchValue({
      magna: this.vrsReport.vrsDispensary.magna,
      premium: this.vrsReport.vrsDispensary.premium,
      fuelNozzle: this.vrsReport.vrsDispensary.fuelNozzle,
      longHose: this.vrsReport.vrsDispensary.longHose,
      breakAway: this.vrsReport.vrsDispensary.breakAway,
      shortHose: this.vrsReport.vrsDispensary.shortHose,
      equipment: this.vrsReport.vrsDispensary.equipment,
      vrsAlarm: this.vrsReport.vrsAlarm,
      emergencyStop: this.vrsReport.emergencyStop,
      observations: this.vrsReport.observations
    });
    if (this.vrsReport.vrsTanks) {
      this.tanks = this.vrsReport.vrsTanks;
    }
    this.date = UtilitiesService.convertDate(this.vrsReport.date);
    this.vrsForm.disable();
  }

  private getVRSReport(): void {
    this._api.getTaskInformation(this._taskId, 4).subscribe(response => {
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
    this._imageVisor.open(
      this.vrsReport.extraFileCS || [], this._blobs || [], !this.editable
    ).afterClosed().subscribe((response) => {
      switch (response.code) {
        case 1:
          if (response.data === null) {
            this._loads[0] = false;
          }
          this._loads[0] = true;
          this._blobs = response.data.blobs;
          this.vrsReport.extraFileCS = response.data.images;
          break;
      }
    });
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditReport(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = AuthService.getInfoUser();
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if (!isNewLoad) {
      this._copyTask = this.vrsReport;
      this.vrsReport.folio = null;
      this.vrsReport.date = null;
      this.vrsReport.signature = null;
    }
    this.tanks[0].fuelType = 1;
    this.vrsForm.enable();
  }

  public loadSignature(): void {
    if (!this.editable) {
      return;
    }
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.vrsReport.signature = {
          thumbnail: response.base64,
          blobName: null
        };
        this._loads[1] = true;
        this._signature = new FormData();
        this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
        this._signature.append('isImage', 'true');
        this._signature.append('file', response.blob);
      }
    });
  }

  public addRemoveTank(isAdd: boolean, index?: number): void {
    if (isAdd) {
      this.tanks.push({
        capAndFillingAdapter: null,
        capAndSteamAdapter: null,
        fuelType: 1,
        overfillValve: null,
        vacuumPressureValve: null
      });
      this.errorTank.push(false);
    } else {
      this.tanks.splice(index, 1);
      this.errorTank.splice(index, 1);
    }
  }

  public validateForm(value: any): void {
    let error = false;
    for (let i = 0; i < this.tanks.length; i++) {
      if (!this.tanks[i].vacuumPressureValve || !this.tanks[i].overfillValve ||
        !this.tanks[i].fuelType || !this.tanks[i].capAndSteamAdapter || !this.tanks[i].capAndFillingAdapter) {
        this.errorTank[i] = true;
        error = true;
      }
    }
    if (!value.magna && !value.premium) {
      this.error = true;
    }
    if (this.error || this.vrsForm.invalid || error) {
      this._snackBarService.setMessage('Por favor, complete los campos', 'OK', 3000);
      return;
    }
    if (!this._signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    if (this._loads[0]) {
      this.uploadEvidences();
      return;
    }
    if (this._loads[1]) {
      this.uploadFile();
      return;
    }
    this.saveReport(value);
  }

  private saveReport(value: any): void {
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.vrsReport = {
      date: date.timeStamp,
      emergencyStop: value.emergencyStop,
      extraFileCS: this.vrsReport.extraFileCS,
      name: this.name,
      observations: value.observations,
      signature: this.vrsReport.signature,
      taskId: this._taskId,
      vrsTanks: this.tanks,
      vrsAlarm: value.vrsAlarm,
      vrsDispensary: {
        breakAway: value.breakAway,
        diesel: false,
        equipment: value.equipment,
        fuelNozzle: value.fuelNozzle,
        longHose: value.longHose,
        magna: value.magna,
        premium: value.premium,
        shortHose: value.shortHose
      }
    };
    if (this._copyTask) {
      this.vrsReport.id = this._copyTask.id;
    }
    this._api.createTask(this.vrsReport, 4).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
      } else {
        console.error(response);
      }
    });
  }

  private uploadEvidences(): void {
    for (let i = 0; i < this._blobs.length; i++) {
      if (this._blobs[i].hasOwnProperty('url')) {
        const evidence = new FormData();
        evidence.append('path', 'Task' + this._taskId);
        evidence.append('fileName', 'evidence-' + this._taskId + new Date().getTime() + '.png');
        evidence.append('isImage', 'true');
        evidence.append('file', this._blobs[i].blob);
        this._uploadFileService.upload(evidence).subscribe(response => {
          if (response) {
            this._blobs[i] = response.item;
            this.uploadEvidences();
          }
        });
        break;
      } else {
        this.vrsReport.extraFileCS[i] = this._blobs[i];
        if (i === this._blobs.length - 1) {
          this._loads[0] = false;
          this.validateForm(this.vrsForm.value);
          break;
        }
      }
    }
  }

  private uploadFile(): void {
    this._uploadFileService.upload(this._signature).subscribe(response => {
      if (response) {
        this.vrsReport.signature = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this._loads[1] = false;
        this.validateForm(this.vrsForm.value);
      }
    });
  }

  public changeFuelType() {
    this.error = false;
  }

  public changeTankInfo(ev: any, index: number) {
    this.errorTank[index] = false;
  }

}
