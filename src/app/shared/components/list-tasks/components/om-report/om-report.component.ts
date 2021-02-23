/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {ImageVisorService} from '@app/shared/components/image-visor/image-visor.service';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Subscription} from 'rxjs';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {ModalProceduresService} from '@app/shared/components/modal-procedures/modal-procedures.service';
import {OMReport} from '@app/utils/interfaces/reports/omr-report';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {SnackBarService} from '@maplander/core';
import {AuthService} from '@app/core/services/auth/auth.service';
import {CustomProcedure} from '@app/utils/interfaces/customProcedure';

@Component({
  selector: 'app-om-report',
  templateUrl: './om-report.component.html',
  styleUrls: ['./om-report.component.scss']
})
export class OmReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  private _stationId: string;
  public task: any;
  public utils: AppUtil;
  public stationProcedures: CustomProcedure[];

  @Input() set taskOMInfo(taskObj: any) {
    if (taskObj) {
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getOMReport();
    }
  }

  @Input() set utilities(utils: any) {
    if (utils) {
      this.utils = utils;
    }
  }

  @Input() set station(station: any) {
    if (station) {
      this._stationId = station;
      this.getStationProcedures();
    }
  }

  private readonly _loads: Array<boolean>;
  public errors: Array<boolean>;
  public omForm: FormGroup;
  public omReport: OMReport;
  public date: Array<any>;
  public taskItems: Array<any>;
  public personnelNames: Array<string>;
  public procedures: Array<number>;
  public editable: boolean;
  public newPersonnel: string;
  public name: string;
  public load: boolean;
  public startValidate: boolean;
  public hwgData: HWGReport;
  private _signature: FormData;
  private _indexTask: number;
  private _copyLastTask: OMReport;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  private _hwgElement: HWGReport;
  private _blobs: Array<any>;

  constructor(
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _signatureService: SignaturePadService,
    private _proceduresService: ModalProceduresService,
    private _uploadFile: UploadFileService,
    private _formatTimePipe: FormatTimePipe
  ) {
    this.startValidate = false;
    this._loads = [false, false];
    this.errors = [false, false, false];
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.personnelNames = [];
    this.procedures = [];
    this.editable = false;
    this.stationProcedures = null;
    this._blobs = [];
    this.omReport = {
      activityType: '',
      cottonClothes: false,
      date: 0,
      description: '',
      endTime: 0,
      extraFileCS: [],
      faceMask: false,
      fileCS: null,
      folio: 0,
      gloves: false,
      goggles: false,
      helmet: false,
      hwgReport: null,
      id: null,
      industrialShoes: false,
      kneepads: false,
      maintenanceType: '',
      name: '',
      observations: '',
      personnelNames: [],
      personnelType: '',
      procedures: [],
      protectiveGoggles: false,
      signature: null,
      startTime: 0,
      taskId: '',
      toolsAndMaterials: ''
    };
  }

  ngOnInit() {
    this.initOmForm();
    this.detectNotifications();
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
  }

  ngOnDestroy() {
    this.editable = false;
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
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

  private detectNotifications(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.EditTask) {
        if (response.value === 1) {
          this.startEditFormat();
        }
      } else {
      }
    });
  }

  private initOmForm(): void {
    this.omForm = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      maintenanceType: ['', [Validators.required]],
      activityType: ['', [Validators.required]],
      personnelType: ['', [Validators.required]],
      cottonClothes: [false, []],
      faceMask: [false, []],
      gloves: [false, []],
      kneepads: [false, []],
      protectiveGoggles: [false, []],
      industrialShoes: [false, []],
      goggles: [false, []],
      helmet: [false, []],
      toolsAndMaterials: ['', []],
      description: ['', []],
      observations: ['', []]
    });
  }

  private patchForm(report: OMReport): void {
    if (!report.extraFileCS && report.fileCS) {
      report.extraFileCS = [];
      report.extraFileCS.push(report.fileCS);
      this._blobs = report.extraFileCS;
    }
    this.omReport = {
      activityType: report.activityType || null,
      cottonClothes: report.cottonClothes || null,
      date: report.date || null,
      description: report.description || null,
      endTime: report.endTime || null,
      extraFileCS: report.extraFileCS || null,
      faceMask: report.faceMask || null,
      folio: report.folio || null,
      gloves: report.gloves || null,
      goggles: report.goggles || null,
      helmet: report.helmet || null,
      hwgReport: report.hwgReport || null,
      id: report.id || null,
      industrialShoes: report.industrialShoes || null,
      kneepads: report.kneepads || null,
      maintenanceType: report.maintenanceType || null,
      name: report.name || null,
      observations: report.observations || null,
      personnelNames: report.personnelNames || null,
      personnelType: report.personnelType || null,
      procedures: report.procedures || null,
      protectiveGoggles: report.protectiveGoggles || null,
      signature: report.signature || null,
      startTime: report.startTime,
      taskId: report.taskId || null,
      toolsAndMaterials: report.toolsAndMaterials || null
    };
    this.omForm.patchValue({
      startTime: this._formatTimePipe.transform(this.omReport.startTime),
      endTime: this._formatTimePipe.transform(this.omReport.endTime),
      maintenanceType: this.omReport.maintenanceType,
      activityType: this.omReport.activityType,
      personnelType: this.omReport.personnelType,
      cottonClothes: this.omReport.cottonClothes,
      faceMask: this.omReport.faceMask,
      gloves: this.omReport.gloves,
      kneepads: this.omReport.kneepads,
      protectiveGoggles: this.omReport.protectiveGoggles,
      industrialShoes: this.omReport.industrialShoes,
      goggles: this.omReport.goggles,
      helmet: this.omReport.helmet,
      toolsAndMaterials: this.omReport.toolsAndMaterials,
      description: this.omReport.description,
      observations: this.omReport.observations
    });
    if (this.omReport.hwgReport) {
      this.hwgData = this.omReport.hwgReport;
    } else {
      this.hwgData = null;
    }
    this.date = UtilitiesService.convertDate(this.omReport.date);
    this.omForm.disable();
  }

  private resetElements(): void {
    this.omForm.reset();
    this.omForm.disable();
    const user = AuthService.getInfoUser();
    if (this.task.status !== 4 && user.role === 7) {
      this.startEditFormat(true);
    }
  }

  private getOMReport(): void {
    this._api.getTaskInformation(this._taskId, 1).subscribe(response => {
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
      this.omReport.extraFileCS || [], this._blobs || [], !this.editable
    ).afterClosed().subscribe((response) => {
      switch (response.code) {
        case 1:
          if (response.data === null) {
            this._loads[0] = false;
          }
          this._loads[0] = true;
          this.errors[2] = false;
          this._blobs = response.data.blobs;
          this.omReport.extraFileCS = response.data.images;
          break;
      }
    });
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditFormat(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = AuthService.getInfoUser();
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    this._sharedService.setNotification({type: SharedTypeNotification.HwgActive, value: isNewLoad ? isNewLoad : false});
    if (!isNewLoad) {
      this._copyLastTask = this.omReport;
      this.procedures = this.omReport.procedures || [];
      this.personnelNames = this.omReport.personnelNames || [];
      if (this.omReport.hwgReport) {
        this.hwgData = this.omReport.hwgReport;
      }
      this.omReport.date = null;
      this.omReport.signature = null;
      this.omReport.folio = null;
    }
    this.omForm.enable();
  }

  public addRemoveArrayItem(type: number, isAdd: boolean, index?: number): void {
    switch (type) {
      case 1:
        if (isAdd) {
          if (!this.newPersonnel || UtilitiesService.removeDiacritics(this.newPersonnel).length === 0) {
            return;
          }
          this.personnelNames.push(this.newPersonnel);
          this.newPersonnel = '';
          this.errors[0] = false;
        } else {
          this.personnelNames.splice(index, 1);
        }
        break;
      case 2:
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
        break;
    }
  }

  public changeTime(ev: any, type: string): void {
    this.omForm.patchValue({
      [type]: ev
    });
  }

  public loadSignature(): void {
    if (!this.editable) {
      return;
    }
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.omReport.signature = {
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

  public validateForm(value: any): void {
    let error = false;
    if (this.personnelNames.length === 0) {
      this.errors[0] = true;
    }
    if (!value.cottonClothes &&
      !value.faceMask &&
      !value.gloves &&
      !value.goggles &&
      !value.helmet &&
      !value.industrialShoes &&
      !value.kneepads &&
      !value.protectiveGoggles) {
      this.errors[1] = true;
    }
    if (this.task.evidence && this.omReport.extraFileCS.length === 0) {
      this.errors[2] = true;
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
    if (this.errors[0] || this.errors[1] || this.errors[2] || this.omForm.invalid || error) {
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
    this.omReport = {
      activityType: value.activityType,
      cottonClothes: value.cottonClothes,
      date: date.timeStamp,
      description: value.description || null,
      endTime: UtilitiesService.removeFormatTime(value.endTime),
      extraFileCS: this.omReport.extraFileCS,
      faceMask: value.faceMask,
      gloves: value.gloves,
      goggles: value.goggles,
      helmet: value.helmet,
      hwgReport: null,
      industrialShoes: value.industrialShoes,
      kneepads: value.kneepads,
      maintenanceType: value.maintenanceType,
      name: this.name,
      observations: value.observations || null,
      personnelNames: this.personnelNames,
      personnelType: value.personnelType,
      procedures: this.procedures || null,
      protectiveGoggles: value.protectiveGoggles,
      signature: this.omReport.signature,
      startTime: UtilitiesService.removeFormatTime(value.startTime),
      taskId: this._taskId,
      toolsAndMaterials: value.toolsAndMaterials || null
    };
    if (this._copyLastTask) {
      this.omReport.id = this._copyLastTask.id;
    }
    if (this.task.hwg) {
      this.omReport.hwgReport = this._hwgElement;
    }
    this._api.createTask(this.omReport, 1).subscribe(response => {
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
        this._uploadFile.upload(evidence).subscribe(response => {
          if (response) {
            this._blobs[i] = response.item;
            this.uploadEvidences();
          }
        });
        break;
      } else {
        this.omReport.extraFileCS[i] = this._blobs[i];
        if (i === this._blobs.length - 1) {
          this._loads[0] = false;
          this.validateForm(this.omForm.value);
          break;
        }
      }
    }
  }

  private uploadFile(): void {
    this._uploadFile.upload(this._signature).subscribe(response => {
      if (response) {
        this.omReport.signature = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this._loads[1] = false;
        this.validateForm(this.omForm.value);
      }
    });
  }

  public changeEquipment() {
    this.errors[1] = false;
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
        area: null,
        corrosive: false,
        explosive: false,
        flammable: false,
        reactive: false,
        quantity: null,
        temporaryStorage: null,
        toxic: false,
        unity: null,
        waste: null
      };
    }
    this.startValidate = false;
    this.validateForm(this.omForm.value);
  }

  public startValidateForm(): void {
    this.startValidate = true;
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
