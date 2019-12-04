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
import {Constants} from '@app/utils/constants/constants.utils';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Subscription} from 'rxjs';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {ModalProceduresService} from '@app/ui/dashboard/components/modal-procedures/modal-procedures.service';
import {OMReport} from '@app/utils/interfaces/reports/omr-report';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';
import {Task} from '@app/utils/interfaces/task';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {UserMedia} from '@maplander/core/lib/utils/models/user-media';

@Component({
  selector: 'app-om-report',
  templateUrl: './om-report.component.html',
  styleUrls: ['./om-report.component.scss']
})
export class OmReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: Task;
  public utils: AppUtil;

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

  private readonly _loads: boolean[];
  public errors: boolean[];
  public omForm: FormGroup;
  public omReport: OMReport;
  public date: any[];
  public taskItems: any[];
  public personnelNames: string[];
  public procedures: number[];
  public editable: boolean;
  public newPersonnel: string;
  public signatureThumbnail: string;
  public evidenceThumbnail: string;
  public name: string;
  public load: boolean;
  public startValidate: boolean;
  public hwgData: HWGReport;
  private _signatureElement: any;
  private _signature: FormData;
  private _evidenceElement: any;
  private _evidence: FormData;
  private _indexTask: number;
  private _copyLastTask: OMReport;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  private _hwgElement: HWGReport;

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
    this.omReport = {
      activityType: report.activityType || null,
      cottonClothes: report.cottonClothes || null,
      date: report.date || null,
      description: report.description || null,
      endTime: report.endTime,
      faceMask: report.faceMask || null,
      fileCS: report.fileCS || null,
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
      this.hwgData = undefined;
    }
    this.date = UtilitiesService.convertDate(this.omReport.date);
    this.omForm.disable();
  }

  private resetElements(): void {
    this.omReport = undefined;
    this.omForm.reset();
    this.omForm.disable();
    const user = LocalStorageService.getItem(Constants.UserInSession);
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

  private startEditFormat(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    this._sharedService.setNotification({type: SharedTypeNotification.HwgActive, value: isNewLoad ? isNewLoad : false});
    if (!isNewLoad) {
      this._copyLastTask = this.omReport;
      this.procedures = this.omReport.procedures || [];
      this.personnelNames = this.omReport.personnelNames || [];
      if (this.omReport.fileCS) {
        this._evidenceElement = this.omReport.fileCS;
        this.evidenceThumbnail = this.omReport.fileCS.thumbnail;
      }
      if (this.omReport.hwgReport) {
        this.hwgData = this.omReport.hwgReport;
      }
      this.omReport.date = undefined;
      this.omReport.signature = undefined;
      this.omReport.folio = undefined;
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
            {utils: this.utils.procedures, proceduresSelected: this.procedures, notVisibleChecks: false}
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
    if (ev == null) {
      this.evidenceThumbnail = null;
      this._loads[0] = false;
      this._evidence = null;
      this._evidenceElement = null;
    }
    this.evidenceThumbnail = ev.url;
    this._loads[0] = true;
    this._evidence = new FormData();
    this._evidence.append('path', 'Task' + this._taskId);
    this._evidence.append('fileName', 'evidence-' + this._taskId + new Date().getTime() + '.png');
    this._evidence.append('isImage', 'true');
    this._evidence.append('file', ev.blob);
    this.errors[2] = false;
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
    if (this.task.evidence && !this.evidenceThumbnail) {
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
      this.uploadFile(1);
      return;
    }
    if (this._loads[1]) {
      this.uploadFile(2);
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
      description: value.description || undefined,
      endTime: UtilitiesService.removeFormatTime(value.endTime),
      fileCS: this._evidenceElement || undefined,
      faceMask: value.faceMask,
      gloves: value.gloves,
      goggles: value.goggles,
      helmet: value.helmet,
      hwgReport: undefined,
      industrialShoes: value.industrialShoes,
      kneepads: value.kneepads,
      maintenanceType: value.maintenanceType,
      name: this.name,
      observations: value.observations || undefined,
      personnelNames: this.personnelNames,
      personnelType: value.personnelType,
      procedures: this.procedures || undefined,
      protectiveGoggles: value.protectiveGoggles,
      signature: this._signatureElement,
      startTime: UtilitiesService.removeFormatTime(value.startTime),
      taskId: this._taskId,
      toolsAndMaterials: value.toolsAndMaterials || undefined
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
            this.validateForm(this.omForm.value);
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
            this.validateForm(this.omForm.value);
          }
        });
        break;
      default:
        break;
    }
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
    this.validateForm(this.omForm.value);
  }

  public startValidateForm(): void {
    this.startValidate = true;
  }

}
